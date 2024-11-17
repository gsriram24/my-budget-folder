import { createFileRoute, Outlet } from "@tanstack/react-router";
import envelopeImg from "@/assets/envelope.png";
export const Route = createFileRoute("/_public-layout")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex">
			<div className="lg:w-3/5 p-12 w-full flex h-screen flex-col items-center justify-center">
				<Outlet />
			</div>

			<img
				className="object-cover h-screen w-2/5 hidden lg:block"
				src={envelopeImg}
			/>
		</div>
	);
}
