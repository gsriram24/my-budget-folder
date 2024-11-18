import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import supabase from "@/supabaseClient";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

export const Route = createLazyFileRoute("/_public-layout/login")({
	component: Login,
});

const formSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

function Login() {
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleLogin = async (values: z.infer<typeof formSchema>) => {
		setError(null);
		setLoading(true);
		const { email, password } = values;
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) {
			setError(error.message);
		} else {
			setError(null);
			// Redirect or perform other actions on successful login
		}
		setLoading(false);
	};

	return (
		<div className="max-w-md w-full text-left">
			<h2 className="text-3xl font-semibold">Login</h2>
			<p className="text-sm mt-4">
				Don't have an account?{" "}
				<Link className="text-blue-700" href="/signup">
					Create one
				</Link>
			</p>
			<Form {...form}>
				<form
					className="mt-8 w-full"
					onSubmit={e => {
						e.preventDefault();
						setError(null);
						form.handleSubmit(handleLogin)();
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
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="mb-0">
										Password
									</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{error && (
						<ErrorMessage title="Login Error" message={error} />
					)}
					<Button
						loading={loading}
						className="mt-6 w-full"
						type="submit"
					>
						Login
					</Button>
				</form>
			</Form>
		</div>
	);
}
