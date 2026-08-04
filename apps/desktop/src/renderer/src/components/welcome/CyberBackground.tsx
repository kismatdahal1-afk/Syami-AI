import { motion } from 'framer-motion';

interface Orb {
  className: string;
  duration: number;
  delay: number;
  x: number[];
  opacity: number[];
}

interface Node {
  cx: number;
  cy: number;
  size: number;
  fill: string;
  opacity: number;
  delay: number;
  lines: { x1: number; y1: number; x2: number; y2: number; stroke: string }[];
}

const STREAMS = [
  { left: '8%', height: '170%', duration: 22, delay: -2 },
  { left: '22%', height: '150%', duration: 18, delay: -9 },
  { left: '78%', height: '160%', duration: 20, delay: -5 },
  { left: '90%', height: '175%', duration: 24, delay: -13 },
  { left: '96%', height: '150%', duration: 19, delay: -7 },
];

const ORBS: Orb[] = [
  { className: 'left-[12%] top-[30%] h-36 w-36 bg-accent/10 blur-3xl', duration: 22, delay: 0, x: [0, 28, -12, 0], opacity: [0.5, 1, 0.7, 0.5] },
  { className: 'right-[14%] top-[24%] h-40 w-40 bg-primary/10 blur-3xl', duration: 26, delay: 3, x: [0, -32, 14, 0], opacity: [0.6, 1, 0.6, 0.6] },
  { className: 'left-[20%] bottom-[18%] h-32 w-32 bg-violet-500/10 blur-3xl', duration: 24, delay: 6, x: [0, 20, -18, 0], opacity: [0.45, 1, 0.6, 0.45] },
  { className: 'right-[22%] bottom-[24%] h-36 w-36 bg-cyan-400/10 blur-3xl', duration: 28, delay: 9, x: [0, -22, 20, 0], opacity: [0.5, 1, 0.7, 0.5] },
];

const STROKE = 'rgba(99, 102, 241, 0.10)';
const STROKE_PURPLE = 'rgba(167, 139, 250, 0.08)';

const NODES: Node[] = [
  { cx: 6, cy: 26, size: 4, fill: '#06b6d4', opacity: 0.45, delay: 0, lines: [{ x1: 6, y1: 26, x2: 18, y2: 40, stroke: STROKE }] },
  { cx: 18, cy: 40, size: 3, fill: '#6366f1', opacity: 0.4, delay: 1.4, lines: [{ x1: 18, y1: 40, x2: 30, y2: 26, stroke: STROKE }] },
  { cx: 30, cy: 26, size: 4, fill: '#a78bfa', opacity: 0.45, delay: 0.7, lines: [{ x1: 30, y1: 26, x2: 44, y2: 34, stroke: STROKE }] },
  { cx: 44, cy: 34, size: 3, fill: '#06b6d4', opacity: 0.4, delay: 2.1, lines: [] },
  { cx: 94, cy: 22, size: 4, fill: '#6366f1', opacity: 0.45, delay: 1.8, lines: [{ x1: 94, y1: 22, x2: 82, y2: 36, stroke: STROKE }, { x1: 94, y1: 22, x2: 96, y2: 40, stroke: STROKE_PURPLE }] },
  { cx: 82, cy: 36, size: 3, fill: '#a78bfa', opacity: 0.4, delay: 0.9, lines: [{ x1: 82, y1: 36, x2: 70, y2: 22, stroke: STROKE }] },
  { cx: 70, cy: 22, size: 4, fill: '#06b6d4', opacity: 0.45, delay: 2.6, lines: [] },
  { cx: 96, cy: 40, size: 3, fill: '#06b6d4', opacity: 0.4, delay: 0.4, lines: [] },
  { cx: 8, cy: 76, size: 3, fill: '#a78bfa', opacity: 0.4, delay: 1.2, lines: [{ x1: 8, y1: 76, x2: 20, y2: 68, stroke: STROKE }] },
  { cx: 20, cy: 68, size: 4, fill: '#06b6d4', opacity: 0.45, delay: 2.4, lines: [{ x1: 20, y1: 68, x2: 32, y2: 76, stroke: STROKE_PURPLE }] },
  { cx: 32, cy: 76, size: 3, fill: '#6366f1', opacity: 0.4, delay: 0.5, lines: [] },
  { cx: 90, cy: 72, size: 4, fill: '#6366f1', opacity: 0.45, delay: 1.6, lines: [{ x1: 90, y1: 72, x2: 78, y2: 64, stroke: STROKE }] },
  { cx: 78, cy: 64, size: 3, fill: '#06b6d4', opacity: 0.4, delay: 3, lines: [{ x1: 78, y1: 64, x2: 66, y2: 72, stroke: STROKE_PURPLE }] },
  { cx: 66, cy: 72, size: 4, fill: '#a78bfa', opacity: 0.45, delay: 0.8, lines: [] },
];

export const CyberBackground = (): React.JSX.Element => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 overflow-hidden"
    style={{
      maskImage: 'radial-gradient(ellipse 92% 88% at 50% 45%, black 25%, transparent 100%)',
      WebkitMaskImage:
        'radial-gradient(ellipse 92% 88% at 50% 45%, black 25%, transparent 100%)',
    }}
  >
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse 62% 55% at 50% 46%, color-mix(in oklab, var(--color-accent) 18%, transparent) 0%, color-mix(in oklab, var(--color-primary) 9%, transparent) 45%, transparent 74%)',
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(600px 420px at 8% 12%, rgba(6, 182, 212, 0.07), transparent 70%), radial-gradient(600px 420px at 92% 8%, rgba(99, 102, 241, 0.08), transparent 70%), radial-gradient(600px 420px at 6% 90%, rgba(167, 139, 250, 0.06), transparent 70%), radial-gradient(600px 420px at 94% 90%, rgba(14, 165, 233, 0.07), transparent 70%)',
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(34, 211, 238, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(34, 211, 238, 0.05) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse 80% 65% at 50% 40%, black 15%, transparent 78%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 80% 65% at 50% 40%, black 15%, transparent 78%)',
      }}
    />
    <div
      className="absolute -inset-[25%] animate-[ambient-drift_26s_ease-in-out_infinite_alternate] will-change-transform"
      style={{
        background:
          'radial-gradient(ellipse 45% 35% at 30% 35%, rgba(6, 182, 212, 0.06), transparent 70%), radial-gradient(ellipse 45% 35% at 70% 65%, rgba(99, 102, 241, 0.06), transparent 70%)',
      }}
    />
    <div
      className="absolute -inset-[30%] animate-[ambient-drift_30s_ease-in-out_infinite_alternate-reverse] will-change-transform"
      style={{
        background:
          'radial-gradient(ellipse 40% 30% at 70% 30%, rgba(167, 139, 250, 0.05), transparent 70%), radial-gradient(ellipse 40% 30% at 30% 70%, rgba(14, 165, 233, 0.05), transparent 70%)',
      }}
    />

    {STREAMS.map((stream, index) => (
      <div
        key={index}
        className="absolute top-1/2 will-change-transform"
        style={{
          left: stream.left,
          height: stream.height,
          width: 1,
          opacity: 0.5,
          animationName: 'stream-flow',
          animationDuration: `${stream.duration}s`,
          animationDelay: `${stream.delay}s`,
          animationIterationCount: 'infinite',
          animationTimingFunction: 'ease-in-out',
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(34, 211, 238, 0.28) 30%, rgba(99, 102, 241, 0.28) 50%, rgba(167, 139, 250, 0.28) 65%, transparent 100%)',
        }}
      />
    ))}

    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      {NODES.map((node, index) => (
        <g key={index}>
          {node.lines.map((line, lineIndex) => (
            <line
              key={lineIndex}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={line.stroke}
              strokeWidth="0.3"
            />
          ))}
        </g>
      ))}
    </svg>

    {NODES.map((node, index) => (
      <span
        key={index}
        className="absolute rounded-full"
        style={{
          left: `${node.cx}%`,
          top: `${node.cy}%`,
          width: node.size,
          height: node.size,
          background: node.fill,
          opacity: node.opacity,
          transform: 'translate(-50%, -50%)',
          animationName: 'node-pulse',
          animationDuration: `${5 + (index % 4)}s`,
          animationDelay: `${node.delay}s`,
          animationIterationCount: 'infinite',
        }}
      />
    ))}

    <div
      className="absolute left-1/2 top-[38%] h-72 w-72 -translate-x-1/2 -translate-y-1/2"
      style={{
        background:
          'radial-gradient(circle, rgba(6, 182, 212, 0.14) 0%, rgba(99, 102, 241, 0.08) 45%, transparent 70%)',
        animationName: 'ambient-pulse',
        animationDuration: '9s',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
      }}
    />

    {ORBS.map((orb, index) => (
      <motion.div
        key={index}
        className={`absolute rounded-full blur-2xl ${orb.className}`}
        animate={{ x: orb.x, opacity: orb.opacity }}
        transition={{
          duration: orb.duration,
          delay: orb.delay,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);