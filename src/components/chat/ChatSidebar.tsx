import { Plus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { ThreadSummary, User } from "@/api/api.schemas";
import { useCreateThread } from "@/api/api";
import { useState } from "react";

interface ChatSidebarProps {
  threads: ThreadSummary[];
  activeThreadId: number;
  currentUser: User | undefined;
  onThreadSelect: (threadId: number) => void;
  refetchThreads: () => void;
}

export function ChatSidebar({
  threads,
  activeThreadId,
  currentUser,
  onThreadSelect,
  refetchThreads,
}: ChatSidebarProps) {
  const [newThreadUser, setNewThreadUser] = useState<string>("");
  const { mutate: newThread } = useCreateThread();

  const handleNewThread = () => {
    newThread(
      { data: { username: newThreadUser } },
      {
        onSuccess: (data) => {
          if (data.id) refetchThreads();
        },
      }
    );
  };
  return (
    <Sidebar className="border-r bg-blue-200/50 backdrop-blur-sm min-w-[300px] max-w-[300px]">
      <SidebarHeader className="p-4 border-b bg-blue-500/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-primary-foreground" />
            <h2 className="font-semibold text-card-foreground">ChatApp</h2>
          </div>
          <SidebarTrigger />
        </div>
        <Input
          placeholder="Username"
          className="bg-white text-black"
          onChange={(e) => setNewThreadUser(e.target.value)}
        />
        <Button
          onClick={handleNewThread}
          disabled={newThreadUser === ""}
          className="w-full bg-blue-500 hover:bg-primary-hover text-primary-foreground mb-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Thread
        </Button>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <div className="space-y-1">
          {threads?.map((thread) => (
            <button
              key={thread.id}
              onClick={() => onThreadSelect(thread.id)}
              className={cn(
                "w-full p-3 rounded-lg text-left transition-all duration-200 bg-blue-400 hover:bg-chat-sidebar-hover",
                activeThreadId === thread.id && "bg-blue-700 shadow-sm"
              )}
            >
              <div className="flex items-start justify-between mb-1">
                <h3
                  className={cn(
                    "font-medium text-sm truncate flex-1",
                    "text-muted-foreground"
                  )}
                >
                  {
                    thread.participants.find(
                      (u) => u.username !== currentUser?.username
                    )?.username
                  }
                </h3>
                {thread.lastMessage?.createdAt && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2 mt-1" />
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate mb-1">
                {thread.lastMessage?.content}
              </p>
              <p className="text-xs text-muted-foreground/70">
                {thread.createdAt}
              </p>
            </button>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
