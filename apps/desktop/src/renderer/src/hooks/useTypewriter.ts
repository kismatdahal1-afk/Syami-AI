import { useEffect, useState } from 'react';

interface TypewriterOptions {
  /** When false, the full text is returned immediately. */
  enabled: boolean;
  /** Maximum total duration of the reveal in milliseconds. */
  maxDurationMs?: number;
}

/**
 * Reveals `text` character-by-character (ChatGPT-style streaming feel).
 * Pure UI - the full text is always available to the caller.
 */
export const useTypewriter = (
  text: string,
  { enabled, maxDurationMs = 4500 }: TypewriterOptions,
): string => {
  const [visible, setVisible] = useState(enabled ? '' : text);

  useEffect(() => {
    if (!enabled) {
      setVisible(text);
      return;
    }

    setVisible('');
    if (!text) return;

    const perCharMs = Math.max(3, Math.min(14, Math.round(maxDurationMs / text.length)));
    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setVisible(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(interval);
      }
    }, perCharMs);

    return () => window.clearInterval(interval);
  }, [text, enabled, maxDurationMs]);

  return visible;
};