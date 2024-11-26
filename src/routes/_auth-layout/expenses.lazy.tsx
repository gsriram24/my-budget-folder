import AddEditExpenseDrawer from "@/components/custom/expense/add-expense-drawer";
import ExpensesTable from "@/components/custom/expense/expenses-table";

import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createLazyFileRoute("/_auth-layout/expenses")({
  component: RouteComponent,
});

function RouteComponent() {
  const [open, setOpen] = useState(false);
  const handleOpen = (open: boolean) => {
    setOpen(open);
  };
  return (
    <>
      <h1 className="font-semibold text-3xl">Expenses</h1>
      <p className="text-gray-500 mt-2">
        Had a recent expenditure? Spent something? Manage all your expenses
        here!
      </p>
      <div className="flex gap-2 justify-end mt-6 mb-4">
        <AddEditExpenseDrawer open={open} handleOpen={handleOpen} />
      </div>
      <ExpensesTable />
    </>
  );
}
