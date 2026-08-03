import type { ExamplePrompt } from './mockChat.types';

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