import { useActiveConversation, useChatStore } from '@/stores/chat.store';
import { ChatInput } from '@/components/chat/ChatInput';
import { EmptyState } from '@/components/chat/EmptyState';
import { MessageList } from '@/components/chat/MessageList';

const ChatPage = (): React.JSX.Element => {
  const active = useActiveConversation();
  const isSending = useChatStore((state) => state.isSending);
  const newChat = useChatStore((state) => state.newChat);
  const sendMessage = useChatStore((state) => state.sendMessage);

  const handlePrompt = (prompt: string): void => {
    if (!active) {
      newChat();
    }
    sendMessage(prompt);
  };

  if (!active || active.messages.length === 0) {
    return <EmptyState onPrompt={handlePrompt} />;
  }

  return (
    <div className="flex h-full flex-col">
      <MessageList messages={active.messages} isSending={isSending} />
      <ChatInput />
    </div>
  );
};

export default ChatPage;