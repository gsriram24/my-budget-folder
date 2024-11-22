import AddCardDrawer from "@/components/custom/add-envelope-drawer";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth-layout/envelopes")({
	component: Envelope,
});

function Envelope() {
	return (
		<div className="grid grid-cols-12 gap-6 lg:gap-12 w-full">
			<div className="lg:col-span-4 col-span-6">
				<AddCardDrawer />
			</div>
			<div className="lg:col-span-4 col-span-6"></div>
			<div className="lg:col-span-4 col-span-6"></div>
		</div>
	);
}
