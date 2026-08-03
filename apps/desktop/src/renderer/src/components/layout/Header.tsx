const Header = (): React.JSX.Element => {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-5">
      <span className="text-sm text-slate-500 dark:text-slate-400">Syami AI Desktop</span>
      <span className="rounded-full border border-border px-3 py-1 text-xs text-slate-500 dark:text-slate-400">
        Foundation
      </span>
    </header>
  );
};

export default Header;
