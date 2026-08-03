import { MessageContainer } from './MessageContainer';
import type { ChatMessage } from '@/types/chat';

interface UserMessageProps {
  message: ChatMessage;
}

export const UserMessage = ({ message }: UserMessageProps): React.JSX.Element => (
  <MessageContainer role="user" avatarName="You" time={message.createdAt}>
    <p className="whitespace-pre-wrap break-words">{message.content}</p>
  </MessageContainer>
);