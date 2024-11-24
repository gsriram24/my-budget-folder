import { useSession } from "@/context/SessionContext";
import { Card, CardContent } from "../ui/card";
import { formatCurrency } from "@/lib/utils";
import { Income } from "@/lib/types";
import EditDeleteDropdown from "./edit-delete-dropdown";
import { useState } from "react";
import { DeleteDialog } from "./delete-dialog";
import AddEditIncomeDrawer from "./add-edit-income-drawer";
import { useDeleteIncome } from "@/services/useIncome";

interface IncomeCardProps {
  income: Income;
}

export default function IncomeCard({ income }: IncomeCardProps) {
  // Edit delete drawer states
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEditOpen = (open: boolean) => {
    setOpen(open);
  };
  const handleDeleteOpen = (open: boolean) => {
    setDeleteOpen(open);
  };

  // User currency info
  const { session } = useSession();
  const currency = session?.user?.user_metadata?.currency || "INR";

  const { mutate, isPending } = useDeleteIncome(() => handleDeleteOpen(false));

  return (
    <div>
      <Card className="w-full min-h-56 flex items-center justify-start border-l-8 border-l-blue-500">
        <CardContent className="py-0 ">
          <p className="text-neutral-700 font-semibold text-3xl">
            {formatCurrency(currency, income.amount)}
          </p>
          <p className="text-neutral-700 text-regular">
            {income.recurring ? "Recurring" : "One-time"}
          </p>
        </CardContent>
      </Card>
      <div className="flex justify-between">
        <h3 className="text-left text-lg font-semibold mt-2">{income.name}</h3>
        <EditDeleteDropdown
          handleEditOpen={handleEditOpen}
          handleDeleteOpen={handleDeleteOpen}
        />
        <AddEditIncomeDrawer
          income={income}
          isEdit
          open={open}
          handleOpen={() => {
            setOpen((prevState) => !prevState);
          }}
        />
        <DeleteDialog
          keyText="income"
          handleClose={handleDeleteOpen}
          onDelete={() => mutate(income.id)}
          open={deleteOpen}
          isPending={isPending}
        />
      </div>
    </div>
  );
}
