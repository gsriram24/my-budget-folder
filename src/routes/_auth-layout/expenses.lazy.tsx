import ExpensesTable from "@/components/custom/expenses-table";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth-layout/expenses")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ExpensesTable />;
}
