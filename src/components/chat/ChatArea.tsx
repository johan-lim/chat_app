import { useState, useRef, useEffect } from "react";
import { Send, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageComponent } from "./Message";
import { Message, ThreadSummary, User } from "@/api/api.schemas";

interface ChatAreaProps {
  messages: Message[];
  activeThread?: ThreadSummary;
  currentUser: User | undefined;
  onSendMessage: (content: string) => void;
}

export function ChatArea({
  messages,
  activeThread,
  currentUser,
  onSendMessage,
}: ChatAreaProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  if (!activeThread) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-200">
        <div className="text-center">
          <h3 className="text-lg font-medium text-black mb-2">
            No thread selected
          </h3>
          <p className="text-sm text-black">
            Select a thread to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-200">
      {/* Chat Header */}
      <div className="p-4 pl-16 border-b bg-blue-500/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-white">
              {activeThread?.lastMessage?.content}
            </h2>
            <p className="text-sm text-white">{messages?.length} messages</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message) => (
          <MessageComponent
            key={message.id}
            message={message}
            isCurrentUser={currentUser?.username === message.author.username}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-blue-500/50 backdrop-blur-sm ml-10">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Message ...`}
            className="flex-1 bg-white text-black border-border/50 focus:border-primary"
          />
          <Button
            type="submit"
            size="icon"
            className="bg-blue-300 hover:bg-primary-hover text-primary-foreground"
            disabled={!inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
