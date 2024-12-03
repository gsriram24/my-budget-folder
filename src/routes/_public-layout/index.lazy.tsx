import { Button, buttonVariants } from "@/components/ui/button";
import { useSession } from "@/context/SessionContext";
import supabase from "@/supabaseClient";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";

export const Route = createLazyFileRoute("/_public-layout/")({
  component: Index,
});

function Index() {
  const { session } = useSession();
  const logout = async () => {
    await supabase.auth.signOut();
  };
  const link = session ? "/dashboard" : "/login";
  return (
    <div className="max-w-3xl">
      <h1 className="font-extrabold 2xl:text-5xl text-4xl">
        Plan your monthly finances before you make the expense
      </h1>
      <p className=" text-xl text-neutral-500 max-w-2xl font-medium mt-8">
        Using digital “envelopes”, allocate budgets for your expenses before you
        make them, to be smart with your expenditure.
      </p>
      <div className="flex gap-2 items-center mt-8">
        <Link
          className={buttonVariants({
            variant: "default",
            size: "lg",
          })}
          to={link}
        >
          {session ? "Go to Dashboard" : "Get Started"}
        </Link>
        {session && (
          <Button
            variant="link"
            size="lg"
            onClick={logout}
            className="text-neutral-900"
          >
            <LogOutIcon /> Logout
          </Button>
        )}
      </div>
    </div>
  );
}
