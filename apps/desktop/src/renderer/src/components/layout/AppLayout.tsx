import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { APP_NAME } from '@syami/shared';
import { AnimatePresence, motion } from 'framer-motion';
import { AppHeader, AppLayout as Shell, Button, Icon, MainContent, PageTransition } from '@syami/ui';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatSidebar } from '@/components/sidebar/ChatSidebar';
import { SyamiLogo } from '@/components/common/SyamiLogo';
import { useIsMobile } from '@/hooks/useMediaQuery';

const AppLayout = (): React.JSX.Element => {
  const location = useLocation();
  const isChat = location.pathname.startsWith('/chat');
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = (): void => {
    if (isMobile) {
      setSidebarOpen((open) => !open);
    } else {
      setSidebarCollapsed((collapsed) => !collapsed);
    }
  };

  return (
    <>
      <Shell
        sidebar={
          !isMobile ? (
            <ChatSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
          ) : undefined
        }
        header={
          isChat ? (
            <ChatHeader />
          ) : (
            <AppHeader
              left={
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    leftIcon={<Icon icon={Menu} size={18} />}
                    aria-label="Toggle sidebar"
                    onClick={toggleSidebar}
                  />
                  <NavLink
                    to="/chat"
                    className="flex items-center gap-2 font-display text-sm font-medium text-foreground hover:text-primary"
                  >
                    <SyamiLogo className="h-6 w-6" alt="Syami AI" />
                    {APP_NAME}
                  </NavLink>
                </div>
              }
            />
          )
        }
      >
        <MainContent padded={false} className={isChat ? 'overflow-hidden' : undefined}>
          <PageTransition animationKey={location.pathname} className="h-full">
            <Outlet />
          </PageTransition>
        </MainContent>
      </Shell>

      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-50"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
            >
              <ChatSidebar collapsed={false} onToggle={() => setSidebarOpen(false)} resizable={false} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AppLayout;
