import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth-layout/envelopes")({
	component: RouteComponent,
});

function RouteComponent() {
	return "Hello /_auth-layout/envelopes!";
}