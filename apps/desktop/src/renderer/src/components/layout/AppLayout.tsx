import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { APP_NAME } from '@syami/shared';
import { AppHeader, AppLayout as Shell, MainContent, PageTransition } from '@syami/ui';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ThemeSwitch } from '@/components/common/ThemeSwitch';
import { ChatSidebar } from '@/components/sidebar/ChatSidebar';

const AppLayout = (): React.JSX.Element => {
  const location = useLocation();
  const isChat = location.pathname.startsWith('/chat');

  return (
    <Shell
      sidebar={<ChatSidebar />}
      header={
        isChat ? (
          <ChatHeader />
        ) : (
          <AppHeader
            left={
              <NavLink to="/chat" className="text-sm font-medium text-foreground hover:text-primary">
                {APP_NAME}
              </NavLink>
            }
            right={<ThemeSwitch />}
          />
        )
      }
    >
      <MainContent padded={false}>
        <PageTransition animationKey={location.pathname} className="h-full">
          <Outlet />
        </PageTransition>
      </MainContent>
    </Shell>
  );
};

export default AppLayout;