import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/contrib/mhchem.js';

const normalize = (s) =>
  s.replace(/\\\[/g, '$$').replace(/\\\]/g, '$$').replace(/\\\(/g, '$').replace(/\\\)/g, '$');

const render = async (md) => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex, { errorColor: 'var(--color-muted-foreground)' });
  return processor.run(await processor.parse(normalize(md)));
};

const collect = (node, out = []) => {
  if (node.type === 'element') {
    out.push(node);
    for (const child of node.children ?? []) collect(child, out);
  } else if (node.type === 'text') {
    out.push(node);
  }
  return out;
};

const hasClass = (el, cls) => (el.properties?.className ?? []).includes(cls);

let failures = 0;
const check = (name, cond, detail = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${cond || !detail ? '' : '  -> ' + detail}`);
  if (!cond) failures++;
};

const inlineSample = 'The quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.';
const displaySample = '$$\\rho A_1 v_1 = \\rho A_2 v_2$$';
const parenSample = 'Density is \\( \\rho \\). Continuity: \\[ \\rho_1 A_1 v_1 = \\rho_2 A_2 v_2 \\]';
const chemSample = 'Water is $\\ce{H2O}$ and $\\ce{2H2 + O2 -> 2H2O}$.';
const badSample = 'Broken: $\\frac{1}{$ and also $\\int_$ here.';
const codeSample = 'Use `$x$` in code. ```ts\nconst p = 5;\n```';
const currencySample = 'It costs $5 and $10 total.';
const complexSample = '$$\\int_0^\\infty e^{-x^2}\\,dx = \\frac{\\sqrt{\\pi}}{2} \\qquad \\sum_{i=1}^n i = \\frac{n(n+1)}{2}$$';

const tree = await render([inlineSample, displaySample, parenSample, chemSample, badSample, codeSample, currencySample, complexSample].join('\n\n'));
const nodes = collect(tree);

const katexInline = nodes.filter((n) => n.type === 'element' && hasClass(n, 'katex'));
const katexDisplay = nodes.filter((n) => n.type === 'element' && hasClass(n, 'katex-display'));
const mathDisplays = nodes.filter((n) => n.type === 'element' && hasClass(n, 'math-display'));
const text = nodes.filter((n) => n.type === 'text').map((n) => n.value).join('');

check('inline $...$ renders KaTeX', katexInline.length >= 6, `katex spans=${katexInline.length}`);
check('display $$...$$ has katex-display', katexDisplay.length >= 2, `count=${katexDisplay.length}`);
check('display $$...$$ wrapped in math-display block', mathDisplays.length >= 2, `count=${mathDisplays.length}`);
check('no raw dollar delimiters leak into text', !text.includes('$'), text.match(/\$\S{0,40}/g)?.join(' | ') ?? '');
check('no raw LaTeX backslash commands leak', !/\\frac|\\sqrt|\\rho|\\int|\\sum|\\ce/.test(text));
check('invalid math does not crash, renders as katex error span', nodes.some((n) => n.type === 'element' && hasClass(n, 'katex-error')));
check('currency "$5 and $10" stays literal text', text.includes('$5 and $10'), text.match(/\$5.{0,20}/)?.[0] ?? 'not found');
check('math inside code spans is untouched', !text.includes('$x$'));
check('chemistry \\ce renders', katexInline.length >= 6);

const boxed = '$$\\boxed{x = 2}$$';
const t2 = await render(boxed);
check('\\boxed display renders', collect(t2).some((n) => n.type === 'element' && hasClass(n, 'katex-display')));

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
