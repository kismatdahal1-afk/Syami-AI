import type { ChatMessage, Conversation } from '../types/chat';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

export interface ExamplePrompt {
  id: string;
  label: string;
  prompt: string;
  description: string;
}

export const EXAMPLE_PROMPTS: ExamplePrompt[] = [
  {
    id: 'physics',
    label: 'Explain physics concepts',
    prompt: 'Explain physics concepts like gravity and momentum in simple terms.',
    description: 'Simple, visual explanations of core ideas',
  },
  {
    id: 'day',
    label: 'Help me plan my day',
    prompt: 'Help me plan my day with a focused morning routine.',
    description: 'A calm, productive daily schedule',
  },
  {
    id: 'nepali',
    label: 'Answer in Nepali',
    prompt: 'सरल शब्दमा नेपालीमा उत्तर दिनुहोस्: आर्टिफिसियल इन्टेलिजेन्स भनेको के हो?',
    description: 'AI सँग आफ्नै भाषामा कुरा गर्नुहोस्',
  },
];

const now = Date.now();

const physicsReply =
  'Great question — let\'s make physics feel intuitive.\n\n' +
  '## Gravity in one line\n\n' +
  '**Gravity** is the attraction between two masses: heavier objects pull harder, and distance weakens the pull.\n\n' +
  '## Momentum\n\n' +
  '- **Momentum** = mass × velocity\n' +
  '- It is conserved in any collision\n' +
  '- A train moving slowly can beat a fast bicycle because it has more mass\n\n' +
  'Here is how Newton\'s second law looks in code:\n\n' +
  '```typescript\n' +
  'function netForce(mass: number, acceleration: number): number {\n' +
  '  return mass * acceleration;\n' +
  '}\n' +
  '\n' +
  'const force = netForce(2.5, 9.8); // ~24.5 N\n' +
  'console.log(`Force needed: ${force.toFixed(2)} N`);\n' +
  '```\n\n' +
  '### Summary\n\n' +
  '| Concept | Key idea |\n' +
  '| --- | --- |\n' +
  '| Gravity | Attraction between masses |\n' +
  '| Momentum | Mass × velocity, always conserved |\n' +
  '| Inertia | Objects resist changes in motion |\n\n' +
  'Want me to go deeper into any of these? 🚀';

const planReply =
  'Here is a simple, focused plan for your day:\n\n' +
  '## Morning\n\n' +
  '1. **7:00** — Wake up, drink water, 10 minutes of stretching\n' +
  '2. **8:00** — Deep work block (no phone) on your most important task\n' +
  '3. **9:30** — Breakfast and a short walk\n\n' +
  '## Afternoon\n\n' +
  '- Handle messages and meetings in one batch\n' +
  '- Take a 20-minute break every 90 minutes\n\n' +
  '## Evening\n\n' +
  '- Review what worked and what didn\'t\n' +
  '- Plan tomorrow\'s top three priorities\n\n' +
  'Keep the list to **three priorities** — everything else is optional.';

const nepalReply =
  'नमस्ते! 🙏\n\n' +
  '**आर्टिफिसियल इन्टेलिजेन्स (AI)** भनेको कम्प्युटरलाई मानिसजस्तै सोच्न, सिक्न र समस्या समाधान गर्न सिकाउने प्रविधि हो।\n\n' +
  '### मुख्य कुराहरू\n\n' +
  '- **सिक्ने (Learning)** — धेरै उदाहरणबाट कम्प्युटरले ढाँचा पहिचान गर्छ\n' +
  '- **अनुमान (Reasoning)** — नयाँ प्रश्नको जवाफ पहिले देखेका कुराबाट दिन्छ\n' +
  '- **स्वचालन (Automation)** — दोहोरिने काम आफैं गर्छ\n\n' +
  'उदाहरणको लागि:\n\n' +
  '```python\n' +
  '# नेपाली भाषा प्रशोधनको सरल उदाहरण\n' +
  'greeting = "नमस्ते, म Syami AI हुँ"\n' +
  'print(greeting)\n' +
  '```\n\n' +
  'तपाईंलाई अझै कुन विषयमा जान्न मन छ?';

const genericReply =
  'Here is a clear answer:\n\n' +
  '## What I understand\n\n' +
  'Based on your question, the key points are:\n\n' +
  '1. **Context matters** — the more detail you share, the better the answer\n' +
  '2. **Structure helps** — breaking big ideas into small steps makes them clearer\n' +
  '3. **Examples stick** — a quick example often explains more than paragraphs\n\n' +
  '```js\n' +
  '// Minimal example\n' +
  'const idea = "ask more specific questions";\n' +
  'console.log(`Tip: ${idea}`);\n' +
  '```\n\n' +
  'Feel free to ask follow-up questions — I can go into as much depth as you need.';

export const REPLY_POOL = [physicsReply, planReply, nepalReply, genericReply];

export const pickReply = (): string => REPLY_POOL[Math.floor(Math.random() * REPLY_POOL.length)]!;

export const seedConversations = (): Conversation[] => {
  const physicsMessages: ChatMessage[] = [
    {
      id: 'm-1001',
      role: 'user',
      content: 'Explain physics concepts like gravity and momentum in simple terms.',
      createdAt: now - 2 * HOUR,
    },
    {
      id: 'm-1002',
      role: 'assistant',
      content: physicsReply,
      createdAt: now - 2 * HOUR + 5 * MINUTE,
    },
  ];

  const planMessages: ChatMessage[] = [
    {
      id: 'm-2001',
      role: 'user',
      content: 'Help me plan my day with a focused morning routine.',
      createdAt: now - 5 * HOUR,
    },
    {
      id: 'm-2002',
      role: 'assistant',
      content: planReply,
      createdAt: now - 5 * HOUR + 4 * MINUTE,
    },
    {
      id: 'm-2003',
      role: 'user',
      content: 'Can you make it shorter — just the top three tasks?',
      createdAt: now - 4 * HOUR,
    },
    {
      id: 'm-2004',
      role: 'assistant',
      content:
        'Sure — here is the shortened version:\n\n' +
        '1. **Deep work** on the most important task before noon\n' +
        '2. **One batch** for messages and meetings\n' +
        '3. **Plan tomorrow** before closing the day\n\n' +
        'Everything else is a bonus. Keep it that simple.',
      createdAt: now - 4 * HOUR + 3 * MINUTE,
    },
  ];

  const nepalMessages: ChatMessage[] = [
    {
      id: 'm-3001',
      role: 'user',
      content: 'सरल शब्दमा नेपालीमा उत्तर दिनुहोस्: आर्टिफिसियल इन्टेलिजेन्स भनेको के हो?',
      createdAt: now - 1 * HOUR,
    },
    {
      id: 'm-3002',
      role: 'assistant',
      content: nepalReply,
      createdAt: now - 1 * HOUR + 5 * MINUTE,
    },
  ];

  return [
    {
      id: 'conv-1001',
      title: 'Physics concepts explained',
      createdAt: now - 2 * HOUR,
      updatedAt: now - 2 * HOUR + 5 * MINUTE,
      messages: physicsMessages,
    },
    {
      id: 'conv-1002',
      title: 'Help me plan my day',
      createdAt: now - 5 * HOUR,
      updatedAt: now - 4 * HOUR + 3 * MINUTE,
      messages: planMessages,
    },
    {
      id: 'conv-1003',
      title: 'AI भनेको के हो? — नेपालीमा',
      createdAt: now - 1 * HOUR,
      updatedAt: now - 1 * HOUR + 5 * MINUTE,
      messages: nepalMessages,
    },
  ];
};