import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./index.css";
import { useSession } from "@/context/SessionContext";

// Create a new router instance
const router = createRouter({
	routeTree,
	defaultPreload: "intent",
	context: {
		session: undefined!, // This will be set after we wrap the app in an AuthProvider
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
	return <RouterProvider router={router} context={{ session }} />;
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<InnerApp />
		</StrictMode>
	);
}
