import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth-layout/income")({
	component: RouteComponent,
});

function RouteComponent() {
	return "Hello /_auth-layout/income!";
}
