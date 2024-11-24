import { useSession } from "@/context/SessionContext";
import { Card, CardContent } from "../ui/card";
import { getCurrencySymbol } from "@/lib/utils";
import { Envelope } from "@/lib/types";
import EditDeleteDropdown from "./edit-delete-dropdown";
import AddEditEnvelopeDrawer from "./add-edit-envelope-drawer";
import { useState } from "react";
import { DeleteDialog } from "./delete-dialog";
import { useDeleteEnvelope } from "@/services/useEnvelope";

interface EnvelopeCardProps {
  envelope: Envelope;
}

export default function EnvelopeCard({ envelope }: EnvelopeCardProps) {
  // Edit delete drawer states
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEditOpen = (open: boolean) => {
    setOpen(open);
  };
  const handleDeleteOpen = (open: boolean) => {
    setDeleteOpen(open);
  };

  // Text and style rendering computation
  const amountClass =
    envelope.allocated_amount > envelope.monthlySpend
      ? "text-green-600"
      : "text-red-600";
  const amount = envelope.allocated_amount - envelope.monthlySpend;
  const amountText = amount > 0 ? "remaining" : "exceeded";
  const borderColor = amount > 0 ? "border-l-blue-500" : "border-l-red-600";

  // User currency info
  const { session } = useSession();
  const currency = getCurrencySymbol(
    session?.user?.user_metadata?.currency || "INR",
  );

  const { mutate, isPending } = useDeleteEnvelope(() =>
    handleDeleteOpen(false),
  );

  return (
    <div>
      <Card
        className={`w-full min-h-56 flex items-center justify-start border-l-8 ${borderColor}`}
      >
        <CardContent className="py-0 ">
          <p className={`${amountClass} font-semibold text-2xl`}>
            {currency} {Math.abs(amount)}{" "}
            <span className="text-neutral-700">{amountText}</span>
          </p>
          <p className="text-neutral-700">
            {currency} {envelope.allocated_amount} allocated
          </p>
        </CardContent>
      </Card>
      <div className="flex justify-between">
        <h3 className="text-left text-lg font-semibold mt-2">
          {envelope.name}
        </h3>
        <EditDeleteDropdown
          handleEditOpen={handleEditOpen}
          handleDeleteOpen={handleDeleteOpen}
        />
        <AddEditEnvelopeDrawer
          envelope={envelope}
          isEdit
          open={open}
          handleOpen={() => {
            setOpen((prevState) => !prevState);
          }}
        />
        <DeleteDialog
          keyText="envelope"
          handleClose={handleDeleteOpen}
          onDelete={() => mutate(envelope.id)}
          open={deleteOpen}
          isPending={isPending}
        />
      </div>
    </div>
  );
}
