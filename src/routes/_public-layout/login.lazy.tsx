import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import supabase from "@/supabaseClient";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import React, { useState } from "react";

export const Route = createLazyFileRoute("/_public-layout/login")({
	component: Login,
});

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
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
			<form className="mt-8 w-full" onSubmit={handleLogin}>
				<Label>
					Email
					<Input
						type="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
					/>
				</Label>
				<div className="mt-4">
					<Label>
						Password
						<Input
							type="password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
						/>
					</Label>
				</div>
				{error && <ErrorMessage title="Login Error" message={error} />}
				<Button loading={loading} className="mt-6 w-full" type="submit">
					Login
				</Button>
			</form>
		</div>
	);
}
