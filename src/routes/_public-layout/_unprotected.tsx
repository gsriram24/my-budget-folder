import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/_public-layout/_unprotected")({
	beforeLoad: ({ context }) => {
		if (context.auth.session) {
			throw redirect({
				to: "/dashboard",
			});
		}
	},
	component: Unprotected,
});

function Unprotected() {
	return <Outlet />;
}
