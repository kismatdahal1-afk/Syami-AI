/**
 * Phase 4: mock reply generator.
 *
 * This is the seam where Phase 7 will insert the real Ollama pipeline
 * (prompt builder -> Ollama -> formatter). The chat service only depends
 * on "generate a reply for this message", so swapping this module later
 * does not change any other code.
 */

const REPLIES = [
  [
    'Here is a clear answer:',
    '',
    '## Key points',
    '',
    '1. **Context matters** — the more detail you share, the better the answer',
    '2. **Structure helps** — breaking big ideas into small steps makes them clearer',
    '3. **Examples stick** — a quick example often explains more than paragraphs',
    '',
    '```js',
    'const idea = "ask more specific questions";',
    'console.log(`Tip: ${idea}`);',
    '```',
    '',
    'Feel free to ask follow-up questions — I can go into as much depth as you need.',
  ].join('\n'),
  [
    'Sure! Quick breakdown for you:',
    '',
    '- **Short version:** works by combining context + pattern matching',
    '- **Long version:** it weighs evidence, ranks likely next steps, and formats the result',
    '- **Practical tip:** give it one clear goal per message',
    '',
    '| Input | Best response |',
    '| --- | --- |',
    '| Vague | Ask for clarification |',
    '| Specific | Direct answer |',
    '| Complex | Step-by-step plan |',
  ].join('\n'),
  [
    'नमस्ते! 🙏',
    '',
    'तपाईंको प्रश्नको सरल उत्तर:',
    '',
    '- **AI** भनेको कम्प्युटरलाई सिकाउने प्रविधि हो',
    '- यसले ढाँचा चिनेर उत्तर दिन्छ',
    '- यो मानिसको सहायक बन्नका लागि बनाइएको हो',
    '',
    'थप प्रश्न सोध्नुहोस्, म खुसीसाथ उत्तर दिन्छु।',
  ].join('\n'),
];

export const generateMockReply = (): string => REPLIES[Math.floor(Math.random() * REPLIES.length)]!;