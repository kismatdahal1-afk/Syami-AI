/**
 * Syami AI - database seed (Phase 4)
 * Inserts default settings and three demo conversations with markdown-rich messages.
 *
 * Usage: npm run db:seed  (requires a reachable DATABASE_URL)
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PHYSICS_REPLY = [
  "Great question — let's make physics feel intuitive.",
  '',
  '## Gravity in one line',
  '',
  '**Gravity** is the attraction between two masses: heavier objects pull harder, and distance weakens the pull.',
  '',
  '## Momentum',
  '',
  '- **Momentum** = mass × velocity',
  '- It is conserved in any collision',
  '- A train moving slowly can beat a fast bicycle because it has more mass',
  '',
  "Here is how Newton's second law looks in code:",
  '',
  '```typescript',
  'function netForce(mass: number, acceleration: number): number {',
  '  return mass * acceleration;',
  '}',
  '',
  'const force = netForce(2.5, 9.8); // ~24.5 N',
  'console.log(`Force needed: ${force.toFixed(2)} N`);',
  '```',
  '',
  '### Summary',
  '',
  '| Concept | Key idea |',
  '| --- | --- |',
  '| Gravity | Attraction between masses |',
  '| Momentum | Mass × velocity, always conserved |',
  '| Inertia | Objects resist changes in motion |',
  '',
  'Want me to go deeper into any of these? 🚀',
].join('\n');

const PLAN_REPLY = [
  'Here is a simple, focused plan for your day:',
  '',
  '## Morning',
  '',
  '1. **7:00** — Wake up, drink water, 10 minutes of stretching',
  '2. **8:00** — Deep work block (no phone) on your most important task',
  '3. **9:30** — Breakfast and a short walk',
  '',
  '## Afternoon',
  '',
  '- Handle messages and meetings in one batch',
  '- Take a 20-minute break every 90 minutes',
  '',
  '## Evening',
  '',
  "- Review what worked and what didn't",
  "- Plan tomorrow's top three priorities",
  '',
  'Keep the list to **three priorities** — everything else is optional.',
].join('\n');

const NEPALI_REPLY = [
  'नमस्ते! 🙏',
  '',
  '**आर्टिफिसियल इन्टेलिजेन्स (AI)** भनेको कम्प्युटरलाई मानिसजस्तै सोच्न, सिक्न र समस्या समाधान गर्न सिकाउने प्रविधि हो।',
  '',
  '### मुख्य कुराहरू',
  '',
  '- **सिक्ने (Learning)** — धेरै उदाहरणबाट कम्प्युटरले ढाँचा पहिचान गर्छ',
  '- **अनुमान (Reasoning)** — नयाँ प्रश्नको जवाफ पहिले देखेका कुराबाट दिन्छ',
  '- **स्वचालन (Automation)** — दोहोरिने काम आफैं गर्छ',
  '',
  'उदाहरणको लागि:',
  '',
  '```python',
  '# नेपाली भाषा प्रशोधनको सरल उदाहरण',
  'greeting = "नमस्ते, म Syami AI हुँ"',
  'print(greeting)',
  '```',
  '',
  'तपाईंलाई अझै कुन विषयमा जान्न मन छ?',
].join('\n');

const main = async (): Promise<void> => {
  const existing = await prisma.conversation.count();
  if (existing > 0) {
    console.log('[seed] Conversations already exist — skipping demo data.');
    return;
  }

  const physics = await prisma.conversation.create({
    data: {
      title: 'Physics concepts explained',
      messages: {
        create: [
          {
            role: 'user',
            content: 'Explain physics concepts like gravity and momentum in simple terms.',
          },
          { role: 'assistant', content: PHYSICS_REPLY },
        ],
      },
    },
  });

  const plan = await prisma.conversation.create({
    data: {
      title: 'Help me plan my day',
      messages: {
        create: [
          {
            role: 'user',
            content: 'Help me plan my day with a focused morning routine.',
          },
          { role: 'assistant', content: PLAN_REPLY },
          { role: 'user', content: 'Can you make it shorter — just the top three tasks?' },
          {
            role: 'assistant',
            content:
              'Sure — here is the shortened version:\n\n' +
              '1. **Deep work** on the most important task before noon\n' +
              '2. **One batch** for messages and meetings\n' +
              '3. **Plan tomorrow** before closing the day\n\n' +
              'Everything else is a bonus. Keep it that simple.',
          },
        ],
      },
    },
  });

  const nepali = await prisma.conversation.create({
    data: {
      title: 'AI भनेको के हो? — नेपालीमा',
      messages: {
        create: [
          {
            role: 'user',
            content: 'सरल शब्दमा नेपालीमा उत्तर दिनुहोस्: आर्टिफिसियल इन्टेलिजेन्स भनेको के हो?',
          },
          { role: 'assistant', content: NEPALI_REPLY },
        ],
      },
    },
  });

  await prisma.settings.create({
    data: {
      theme: 'system',
      language: 'en',
    },
  });

  console.log(`[seed] Seeded conversations: ${[physics.title, plan.title, nepali.title].join(', ')}`);
  console.log('[seed] Seeded default settings (theme: system, language: en).');
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error('[seed] Failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
