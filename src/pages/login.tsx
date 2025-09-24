import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { useLogin } from "@/api/api";
import { useRouter } from "next/router";

const SignIn = () => {
  const { push } = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: loginUser } = useLogin();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(
      {
        data: {
          username,
          password,
        },
      },
      {
        onSuccess: () => {
          push("/chat");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/20 via-blue-800 to-indigo-200/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-semibold text-card-foreground">
            Welcome to ChatApp
          </CardTitle>
          <p className="text-muted-foreground">
            Sign in to continue your conversations
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="string"
                placeholder="Enter your email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-medium transition-colors"
            >
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
