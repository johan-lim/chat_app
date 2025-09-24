import { MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/20 via-blue-800 to-indigo-200/20 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8 inline-flex items-center justify-center w-20 h-20 bg-primary rounded-3xl">
          <MessageCircle className="w-10 h-10 text-primary-foreground" />
        </div>

        <h1 className="mb-6 text-5xl font-bold text-white">
          Welcome to ChatApp
        </h1>

        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          Connect, collaborate, and communicate with your team in real-time.
          Organize conversations in threads and never miss important messages.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="bg-blue-900 items-center justify-center flex p-3 rounded-full hover:bg-blue-700 text-white font-semibold px-8"
          >
            Login
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-card-foreground">
              Organized Threads
            </h3>
            <p className="text-sm text-muted-foreground">
              Keep conversations organized with dedicated threads for different
              topics
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="font-semibold text-card-foreground">
              Real-time Chat
            </h3>
            <p className="text-sm text-muted-foreground">
              Instant messaging with live updates and notifications
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h3 className="font-semibold text-card-foreground">
              Team Collaboration
            </h3>
            <p className="text-sm text-muted-foreground">
              Work together seamlessly with your team members
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
