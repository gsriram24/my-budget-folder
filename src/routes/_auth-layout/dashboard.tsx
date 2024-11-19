import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth-layout/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Dashboard</div>;
}
