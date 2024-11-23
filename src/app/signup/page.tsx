"use client";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { z } from "zod";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useRouter } from 'next/navigation'; // Use 'next/router' for pages directory in Next.js 12
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    toast.success("Welcome!!");
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "" ,
    },
  });

  useEffect(() => {
    form.setValue("username", "");
  }, [form]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      console.log(data);
      const response = await axios.post('/api/auth/signUP', data);
      console.log(response);
      toast.success("Account created successfully! You can now log in.");
      router.push("/signin");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex justify-center py-20" style={{ alignItems: "center" }}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 shadow-custom p-4 rounded-lg">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
