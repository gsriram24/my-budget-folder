import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./index.css";
import { SessionProvider, useSession } from "@/context/SessionContext";
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({
	routeTree,
	defaultPreload: "intent",
	context: {
		auth: undefined!,
		queryClient,
	},
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

function InnerApp() {
	const session = useSession();
	return <RouterProvider router={router} context={{ auth: session }} />;
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<SessionProvider>
				<QueryClientProvider client={queryClient}>
					<InnerApp />
				</QueryClientProvider>
				<Toaster />
			</SessionProvider>
		</StrictMode>
	);
}
