import AddEditEnvelopeDrawer from "@/components/custom/add-edit-envelope-drawer";
import AddCardDrawer from "@/components/custom/add-edit-envelope-drawer";
import EnvelopeCard from "@/components/custom/envelope-card";
import ErrorMessage from "@/components/custom/error-message";
import LoaderCard from "@/components/custom/loader-card";
import { useFetchEnvelopes } from "@/services/useEnvelope";

import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
export const Route = createLazyFileRoute("/_auth-layout/envelopes")({
  component: Envelope,
});

function Envelope() {
  const { data, isError, error, isFetching } = useFetchEnvelopes();
  const [open, setOpen] = useState(false);
  const handleOpen = (open: boolean) => {
    setOpen(open);
  };
  return (
    <>
      <h1 className="font-semibold text-3xl">Envelopes</h1>
      <p className="text-gray-500 mt-2">
        Use envelopes as categories and allocate a budget to keep track of your
        expenses
      </p>
      <div className="grid grid-cols-12 gap-6 lg:gap-12 w-full mt-8">
        <div className="lg:col-span-4 col-span-6">
          <AddEditEnvelopeDrawer handleOpen={handleOpen} open={open} />
        </div>
        {isFetching &&
          [1, 2, 3].map((_) => (
            <div className="lg:col-span-4 col-span-6">
              <LoaderCard />
            </div>
          ))}
        {isError && (
          <div className="col-span-9">
            <ErrorMessage
              title="Error fetching envelopes"
              message={error?.message}
            />
          </div>
        )}
        {data?.map((envelope) => (
          <div className="lg:col-span-4 col-span-6">
            <EnvelopeCard envelope={envelope} />
          </div>
        ))}
      </div>
    </>
  );
}