import { buttonVariants } from "@/components/ui/button";
import { useSession } from "@/context/SessionContext";
import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_public-layout/")({
	component: Index,
});

function Index() {
	const { session } = useSession();
	return (
		<div className="max-w-3xl">
			<h1 className="font-extrabold 2xl:text-5xl text-4xl">
				Plan your monthly finances before you make the expense
			</h1>
			<p className="2xl:text-2xl text-xl text-neutral-500 max-w-2xl font-medium mt-8">
				Using digital “envelopes”, allocate budgets for your expenses
				before you make them, to be smart with your expenditure.
			</p>

			<Link
				className={buttonVariants({
					variant: "default",
					className: "mt-8",
					size: "lg",
				})}
				href={session ? "/dashboard" : "/login"}
			>
				{session ? "Go to Dashboard" : "Get Started"}
			</Link>
		</div>
	);
}
