import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/_public-layout/_unprotected")({
	beforeLoad: ({ context, location }) => {
		if (context.session) {
			throw redirect({
				to: "/dashboard",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: Unprotected,
});

function Unprotected() {
	return <Outlet />;
}
