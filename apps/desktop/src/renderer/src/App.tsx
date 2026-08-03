import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ChatPage from './pages/Chat/ChatPage';
import HomePage from './pages/Home/HomePage';
import SettingsPage from './pages/Settings/SettingsPage';

const App = (): React.JSX.Element => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  );
};

export default App;
