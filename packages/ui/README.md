# @syami/ui — Syami AI Design System

Shared design system for the Syami AI desktop application. Built with React 19, Tailwind CSS v4 (CSS-first tokens), Framer Motion, Zustand, and lucide-react. Consumed as TypeScript source directly — no build step.

## Packages / structure

```
src/
├── tokens/index.css    Design tokens (colors, typography, spacing, radii, shadows) + dark overrides
├── theme/              ThemeProvider, zustand store, useTheme hook
├── animations/         Framer Motion presets + PageTransition, FadeIn, SlideIn, ScaleIn
├── icons/              Icon wrapper (lucide-react) enforcing consistent size/stroke
├── components/         Avatar, Badge, Button, Card, Divider, Dropdown, Input (Input/SearchInput/Textarea), Loading, Modal, Tooltip
├── layouts/            AppLayout, AppSidebar, AppHeader, MainContent, FloatingWindowLayout
├── lib/cn.ts           className merge util (clsx + tailwind-merge)
└── index.ts            Public API barrel
```

## Tokens & theming

- All values are CSS variables defined with Tailwind v4 `@theme` in `src/tokens/index.css`; components only use semantic utilities (`bg-surface`, `text-muted-foreground`, `border-border`, …).
- Dark mode is opt-in via the `.dark` class on `<html>`. The consumer must define the `dark` custom variant in their compiled Tailwind context:

```css
/* consumer globals.css */
@import 'tailwindcss';
@import '@syami/ui/tokens.css';
@source '<path-to>/packages/ui/src';
@custom-variant dark (&:where(.dark, .dark *));
```

- Theme modes: `light | dark | system`. Stored in local storage under `syami.theme`; `system` follows the OS with live updates.

## Usage

```tsx
import { ThemeProvider, AppLayout, AppSidebar, AppHeader, MainContent, Button, Card } from '@syami/ui';

<ThemeProvider>
  <AppLayout
    sidebar={<AppSidebar brand={{ title: 'Syami AI' }} items={[]} />}
    header={<AppHeader left={...} right={...} />}
  >
    <MainContent>
      <Button variant="primary">Action</Button>
    </MainContent>
  </AppLayout>
</ThemeProvider>
```

## Conventions

- Components are typed, functional, and avoid `any`.
- No hardcoded colors or sizes — use design tokens only.
- One component per folder: `components/<Name>/<Name>.tsx` + `index.ts`.
- Run `npm run typecheck --workspace @syami/ui` after changes.
