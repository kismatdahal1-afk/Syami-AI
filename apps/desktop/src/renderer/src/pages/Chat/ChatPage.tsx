import { MessageSquare, Mic, Paperclip, Send } from 'lucide-react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FadeIn,
  Icon,
  Tooltip,
} from '@syami/ui';

const ChatPage = (): React.JSX.Element => {
  return (
    <FadeIn className="flex h-full flex-col items-center justify-center gap-6 p-8">
      <Avatar name="Syami AI" status="online" size="xl" />

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon={MessageSquare} size={18} />
            Chat Mode
          </CardTitle>
          <CardDescription>
            The conversation interface, markdown rendering, and SSE streaming ship in later phases.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 rounded-full border border-border bg-surface p-1.5 pr-2">
            <Button variant="ghost" size="sm" className="rounded-full px-2.5" disabled>
              <Tooltip content="Attach files" position="bottom">
                <Icon icon={Paperclip} size={16} />
              </Tooltip>
            </Button>
            <input
              type="text"
              placeholder="Ask something..."
              disabled
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <Button size="sm" className="rounded-full" disabled>
              <Icon icon={Mic} size={16} />
            </Button>
            <Button variant="primary" size="sm" className="rounded-full" disabled>
              <Icon icon={Send} size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Badge variant="neon" dot>
        Coming soon
      </Badge>
    </FadeIn>
  );
};

export default ChatPage;