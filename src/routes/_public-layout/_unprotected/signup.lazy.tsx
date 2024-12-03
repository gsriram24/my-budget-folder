import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ErrorMessage from "@/components/custom/error-message";
import { Button } from "@/components/ui/button";
import supabase from "@/supabaseClient";
import currencyCode from "@/lib/currency.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useTitle } from "@/lib/utils";
export const Route = createLazyFileRoute("/_public-layout/_unprotected/signup")(
  {
    component: Signup,
  },
);
const currencyOptions = [
  "INR",
  ...Object.keys(currencyCode).filter((key) => key !== "INR"),
];

const formSchema = z
  .object({
    email: z.string().email(),
    name: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    currency: z.enum(["INR", ...currencyOptions.slice(1)]),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

function Signup() {
  useTitle("Signup");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      currency: "INR",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);
    setLoading(true);
    const { email, password, name, currency } = values;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          currency,
        },
      },
    });
    if (error) {
      setError(error.message);
    } else {
      setError(null);
      window.location.reload();
    }
    setLoading(false);
  };
  return (
    <div className="max-w-md w-full text-left">
      <h2 className="text-3xl font-semibold">Create account</h2>
      <p className="text-sm mt-4">
        Have an account?{" "}
        <Link className="text-blue-700" href="/login">
          Login
        </Link>
      </p>
      <Form {...form}>
        <form
          className="mt-8 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            form.handleSubmit(handleSubmit)();
          }}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-0">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-4">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-0">Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-4">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-0">Preferred Currency</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger>
                        {
                          currencyCode[field.value as keyof typeof currencyCode]
                            ?.name
                        }{" "}
                        - {field.value}
                      </SelectTrigger>
                      <SelectContent>
                        {currencyOptions.map((option) => (
                          <SelectItem value={option}>
                            {
                              currencyCode[option as keyof typeof currencyCode]
                                .name
                            }{" "}
                            - {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {error && <ErrorMessage title="Login Error" message={error} />}
          <Button loading={loading} className="mt-6 w-full" type="submit">
            Create account
          </Button>
        </form>
      </Form>
    </div>
  );
}
