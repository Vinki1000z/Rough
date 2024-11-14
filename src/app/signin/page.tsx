"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Create schema with validation for email and password
const signInSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function SignInPage() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const response = await axios.post('/api/auth/signIn', data);
      if (response.data && typeof response.data === 'object' && 'token' in response.data) {
        const token = (response.data as { token: string }).token;
        if (!token) throw new Error("Token not found in the response");
        sessionStorage.setItem('token', token);
      }  
      const storedToken = sessionStorage.getItem('token');
      if (storedToken) {
        console.log("Token stored successfully:", storedToken);
      } else {
        console.error("Failed to store token");
      }
  
      // Store token in sessionStorage (or localStorage if persistence is desired)
      console.log('User signed in successfully:', response.data);
      toast.success('Sign-in successful! Redirecting...');
      router.push('/dashboard/home');
      
      // Handle success, redirect or show a success message
    } catch (error) {
      console.error('Error signing in:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      // Handle error (show error message to the user)
    }
  };

  return (
    <div className="flex justify-center py-20" style={{ alignItems: "center" }}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 shadow-custom p-4 rounded-lg">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@email.com" {...field} />
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
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Sign In</Button>
        </form>
      </Form>
    </div>
  );
}
