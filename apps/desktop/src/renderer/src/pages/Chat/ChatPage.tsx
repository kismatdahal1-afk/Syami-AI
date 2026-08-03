import { useActiveConversation, useChatStore } from '@/stores/chat.store';
import { ChatInput } from '@/components/chat/ChatInput';
import { EmptyState } from '@/components/chat/EmptyState';
import { MessageList } from '@/components/chat/MessageList';
import { OfflineNotice } from '@/components/chat/OfflineNotice';

const ChatPage = (): React.JSX.Element => {
  const active = useActiveConversation();
  const isSending = useChatStore((state) => state.isSending);
  const error = useChatStore((state) => state.error);
  const newChat = useChatStore((state) => state.newChat);
  const sendMessage = useChatStore((state) => state.sendMessage);

  const handlePrompt = (prompt: string): void => {
    if (!active) {
      newChat();
    }
    void sendMessage(prompt);
  };

  return (
    <div className="flex h-full flex-col">
      {error && <OfflineNotice message={error} />}
      {active && active.messages.length > 0 ? (
        <>
          <MessageList messages={active.messages} isSending={isSending} />
          <ChatInput />
        </>
      ) : (
        <EmptyState onPrompt={handlePrompt} />
      )}
    </div>
  );
};

export default ChatPage;