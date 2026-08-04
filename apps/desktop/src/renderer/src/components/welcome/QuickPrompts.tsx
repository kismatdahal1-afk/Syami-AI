import { motion } from 'framer-motion';

interface QuickPrompt {
  id: string;
  label: string;
  prompt: string;
}

interface QuickPromptsProps {
  onSelect: (prompt: string) => void;
}

const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 'explain',
    label: 'Explain a concept',
    prompt: `Explain the following concept in a simple and easy-to-understand way.

Include:
• Definition
• How it works
• Real-world examples
• Key points

Topic:`,
  },
  {
    id: 'summarize',
    label: 'Summarize text',
    prompt: `Summarize the following text.

Include:

• Main ideas
• Important facts
• Key takeaways

Text:`,
  },
  {
    id: 'write-code',
    label: 'Write code',
    prompt: `Write clean, efficient, and well-commented code for the following requirement.

Language:

Requirement:`,
  },
  {
    id: 'brainstorm',
    label: 'Brainstorm ideas',
    prompt: `Help me brainstorm creative ideas for the following topic.

Include:

• Multiple ideas
• Practical suggestions
• Innovative approaches

Topic:`,
  },
  {
    id: 'translate',
    label: 'Translate English → Nepali',
    prompt: `Translate the following English text into natural, fluent Nepali while preserving the original meaning.

Text:`,
  },
  {
    id: 'generate',
    label: 'Generate ideas',
    prompt: `Generate creative and practical ideas for the following topic.

Include both simple and advanced suggestions.

Topic:`,
  },
  {
    id: 'study',
    label: 'Study with AI',
    prompt: `Help me study the following topic.

Please explain it step-by-step and include:

• Simple explanation
• Important concepts
• Examples
• Practice questions
• Quick revision tips

Topic:`,
  },
  {
    id: 'research',
    label: 'Research a topic',
    prompt: `Research the following topic in detail.

Include:

• Overview
• Key facts
• Important information
• Recent developments (if available)
• Practical applications
• Useful resources
• Final summary

Topic:`,
  },
];

export const QuickPrompts = ({ onSelect }: QuickPromptsProps): React.JSX.Element => (
  <div className="flex flex-wrap items-center justify-center gap-2">
    {QUICK_PROMPTS.map((item, index) => (
      <motion.button
        key={item.id}
        type="button"
        onClick={() => onSelect(item.prompt)}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.04, y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.3, delay: 0.1 + index * 0.05, ease: 'easeOut' }}
        className="cursor-pointer rounded-full border border-border/60 bg-surface/60 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-xl transition-colors duration-200 hover:border-accent/60 hover:text-accent hover:shadow-glow-accent"
      >
        {item.label}
      </motion.button>
    ))}
  </div>
);