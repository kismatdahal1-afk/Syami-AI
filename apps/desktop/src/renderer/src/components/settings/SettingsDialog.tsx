import { Modal } from '@syami/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { AboutPanel } from './AboutPanel';
import { AppearancePanel } from './AppearancePanel';
import { LanguagePanel } from './LanguagePanel';
import { LogoutPanel } from './LogoutPanel';
import { ModelPanel } from './ModelPanel';
import { ProfilePanel } from './ProfilePanel';

export type SettingsPanel = 'appearance' | 'language' | 'model' | 'about' | 'profile' | 'logout';

interface SettingsDialogProps {
  panel: SettingsPanel | null;
  onClose: () => void;
}

interface PanelMeta {
  title: string;
  description?: string;
  size: 'sm' | 'md' | 'lg';
}

const PANEL_META: Record<SettingsPanel, PanelMeta> = {
  appearance: { title: 'Appearance', description: 'Customize how Syami AI looks.', size: 'md' },
  language: { title: 'Language', description: 'Choose your preferred language.', size: 'md' },
  model: { title: 'AI Model', description: 'Runs entirely on your device.', size: 'md' },
  about: { title: 'About', size: 'lg' },
  profile: { title: 'Local User', description: 'Your profile on this device.', size: 'lg' },
  logout: { title: 'Logout', size: 'md' },
};

export const SettingsDialog = ({ panel, onClose }: SettingsDialogProps): React.JSX.Element => {
  const open = panel !== null;
  const meta = panel ? PANEL_META[panel] : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={meta?.title}
      description={meta?.description}
      size={meta?.size ?? 'md'}
      className="flex aspect-square w-[32rem] flex-col"
      contentClassName="min-h-0 flex-1 overflow-y-auto"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={panel ?? 'none'}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {panel === 'appearance' && <AppearancePanel />}
          {panel === 'language' && <LanguagePanel />}
          {panel === 'model' && <ModelPanel />}
          {panel === 'about' && <AboutPanel />}
          {panel === 'profile' && <ProfilePanel />}
          {panel === 'logout' && <LogoutPanel />}
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
};
