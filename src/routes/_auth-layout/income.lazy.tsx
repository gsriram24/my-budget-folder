import AddEditIncomeDrawer from "@/components/custom/income/add-edit-income-drawer";
import ErrorMessage from "@/components/custom/error-message";
import IncomeCard from "@/components/custom/income/income-card";
import LoaderCard from "@/components/custom/loader-card";
import { useFetchIncome } from "@/services/useIncome";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createLazyFileRoute("/_auth-layout/income")({
  component: Income,
});

function Income() {
  const { data, isError, error, isFetching } = useFetchIncome();
  const [open, setOpen] = useState(false);
  const handleOpen = (open: boolean) => {
    setOpen(open);
  };
  return (
    <>
      <h1 className="font-semibold text-3xl">Income</h1>
      <p className="text-gray-500 mt-2">
        Add all your income sources here! Make sure to add one-time income (that
        you got just once) and recurring income (income that repeats every
        month).
      </p>
      <div className="grid grid-cols-12 gap-6 lg:gap-12 w-full mt-8">
        <div className="xl:col-span-4 md:col-span-6 col-span-12">
          <AddEditIncomeDrawer handleOpen={handleOpen} open={open} />
        </div>
        {isFetching &&
          [1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="xl:col-span-4 md:col-span-6 col-span-12"
            >
              <LoaderCard />
            </div>
          ))}
        {isError && (
          <div className="col-span-9">
            <ErrorMessage
              title="Error fetching income"
              message={error?.message}
            />
          </div>
        )}
        {data?.map((income) => (
          <div
            key={income.id}
            className="xl:col-span-4 md:col-span-6 col-span-12"
          >
            <IncomeCard income={income} />
          </div>
        ))}
      </div>
    </>
  );
}
