import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import {
  useGetMe,
  useListMessages,
  useListThreads,
  useSendMessage,
} from "@/api/api";
import { Message, ThreadSummary } from "@/api/api.schemas";
import { cn } from "@/lib/utils";

const Chat = () => {
  const [activeThreadId, setActiveThreadId] = useState<number>(0);

  const {
    data: threads,
    isLoading: isLoadingThreads,
    refetch: refetchThreads,
  } = useListThreads();
  const { data: me, isLoading: isLoadingCurrentUser } = useGetMe();
  const { mutate: sendMessage } = useSendMessage();
  const { data: currentThread, isLoading: isLoadingCurrentThread } =
    useListMessages(
      activeThreadId,
      {},
      {
        query: {
          refetchInterval: 1000,
        },
      }
    );

  const handleSendMessage = (content: string) => {
    sendMessage({
      threadId: activeThreadId,
      data: {
        content,
      },
    });
  };

  const isLoadingState =
    isLoadingCurrentThread || isLoadingCurrentUser || isLoadingThreads;

  return (
    <SidebarProvider defaultOpen={true}>
      <div
        className={cn(
          "h-screen flex w-full bg-blue-500",
          isLoadingState ? "opacity-50" : "opacity-100"
        )}
      >
        <ChatSidebar
          threads={threads as ThreadSummary[]}
          currentUser={me}
          activeThreadId={activeThreadId}
          onThreadSelect={setActiveThreadId}
          refetchThreads={refetchThreads}
        />
        <ChatArea
          messages={currentThread?.items as Message[]}
          currentUser={me}
          activeThread={threads?.find((t) => t.id === activeThreadId)}
          onSendMessage={handleSendMessage}
        />
      </div>
    </SidebarProvider>
  );
};

export default Chat;
