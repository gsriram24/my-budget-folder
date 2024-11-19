import { createContext, useContext, useEffect, useState } from "react";

import { Session } from "@supabase/supabase-js";
import supabase from "@/supabaseClient";
export interface SessionContext {
	session: Session | null;
}
const SessionContext = createContext<SessionContext>({
	session: null,
});

export const useSession = () => {
	const context = useContext(SessionContext);
	if (!context) {
		throw new Error("useSession must be used within a SessionProvider");
	}
	return context;
};

type Props = { children: React.ReactNode };
export const SessionProvider = ({ children }: Props) => {
	const [session, setSession] = useState<Session | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		const authStateListener = supabase.auth.onAuthStateChange(
			async (_, session: Session | null) => {
				setTimeout(async () => {
					console.log(session);
					setSession(session);
					setIsLoading(false);
				}, 0);
			}
		);

		return () => {
			authStateListener.data.subscription.unsubscribe();
		};
	}, []);

	return (
		<SessionContext.Provider value={{ session }}>
			{isLoading ? <h1>Loading</h1> : children}
		</SessionContext.Provider>
	);
};
