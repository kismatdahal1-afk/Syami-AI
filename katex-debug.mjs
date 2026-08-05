import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';

const p = unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeKatex, { errorColor: 'x' });
const t = await p.run(await p.parse('$$\\frac{a}{b}$$ and inline $x^2$'));
const seen = [];
const walk = (n, d) => {
  seen.push(
    '  '.repeat(d) +
      n.type +
      (n.tagName ?? '') +
      (n.value !== undefined ? '=' + JSON.stringify(String(n.value).slice(0, 60)) : '') +
      (n.properties?.className ? ' [' + n.properties.className.join(',') + ']' : '')
  );
  for (const c of n.children ?? []) walk(c, d + 1);
};
walk(t, 0);
console.log(seen.join('\n'));
