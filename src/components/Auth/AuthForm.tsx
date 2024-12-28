import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

const authSchema = z.object({
  identifier: z.string().min(1, "Required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormProps = {
  isSignUp: boolean;
  authMethod: "email" | "phone";
  isLoading: boolean;
  onSubmit: (values: z.infer<typeof authSchema>) => Promise<void>;
};

export const AuthForm = ({ isSignUp, authMethod, isLoading, onSubmit }: AuthFormProps) => {
  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{authMethod === "email" ? "Email" : "Phone"}</FormLabel>
              <FormControl>
                <Input
                  type={authMethod === "email" ? "email" : "tel"}
                  placeholder={authMethod === "email" ? "Enter your email" : "Enter your phone number"}
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            isSignUp ? "Create account" : "Sign in"
          )}
        </Button>
      </form>
    </Form>
  );
};