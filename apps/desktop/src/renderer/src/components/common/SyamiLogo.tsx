import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { cn, Icon } from '@syami/ui';

export const SYAMI_LOGO_PATH = './assets/images/logo/syami-logo.png';

interface SyamiLogoProps {
  className?: string;
  alt?: string;
}

export const SyamiLogo = ({ className, alt = 'Syami AI logo' }: SyamiLogoProps): React.JSX.Element => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={cn(
          'inline-flex shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/25',
          className,
        )}
      >
        <Icon icon={Sparkles} size={18} />
      </span>
    );
  }

  return (
    <img
      src={SYAMI_LOGO_PATH}
      alt={alt}
      onError={() => setFailed(true)}
      className={cn('inline-block shrink-0 rounded-xl object-contain', className)}
    />
  );
};