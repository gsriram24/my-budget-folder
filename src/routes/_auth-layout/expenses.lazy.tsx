import ExpensesTable from "@/components/custom/expense/expenses-table";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth-layout/expenses")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <h1 className="font-semibold text-3xl">Expenses</h1>
      <p className="text-gray-500 mt-2">
        Had a recent expenditure? Spent something? Manage all your expenses
        here!
      </p>
      <div className="flex gap-2 justify-end"></div>
      <ExpensesTable />
    </>
  );
}
