import { SessionContext } from "@/context/SessionContext";
import { QueryClient } from "@tanstack/react-query";

import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

interface MyRouterContext {
	auth: SessionContext;
	queryClient: QueryClient;
}
export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: RootComponent,
});

function RootComponent() {
	return (
		<>
			<Outlet />
			{/* <TanStackRouterDevtools position="top-right" /> */}
		</>
	);
}
