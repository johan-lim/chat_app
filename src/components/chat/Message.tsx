import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import type { Message } from "@/api/api.schemas";

interface MessageProps {
  message: Message;
  isCurrentUser: boolean;
}
export const MessageComponent = ({ message, isCurrentUser }: MessageProps) => {
  return (
    <div
      key={message.id}
      className={cn(
        "flex gap-3 max-w-[70%]",
        isCurrentUser ? "ml-auto flex-row-reverse" : ""
      )}
    >
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback className="text-xs bg-blue-500/10 text-primary-foreground">
          {message.author.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "flex flex-col gap-1",
          isCurrentUser ? "items-end" : "items-start"
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-black">
            {message.author.username}
          </span>
          <span className="text-xs text-muted-foreground/70">
            {message.createdAt}
          </span>
        </div>

        <div
          className={cn(
            "px-4 py-2 rounded-2xl shadow-sm max-w-full break-words",
            isCurrentUser
              ? "bg-blue-500 text-primary-foreground"
              : "bg-blue-200 text-black border border-border/50"
          )}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
};
