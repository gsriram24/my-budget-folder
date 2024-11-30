import EnvelopeProgressBar from "@/components/custom/dashboard/envelope-progress-bar";
import { EnvelopeSpendingCard } from "@/components/custom/dashboard/envelope-spending-chart";

import { useFetchEnvelopes } from "@/services/useEnvelope";
import { useFetchExpense } from "@/services/useExpense";
import { useFetchIncome } from "@/services/useIncome";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createLazyFileRoute("/_auth-layout/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  // const {
  //   data: incomeData,
  //   isError: isIncomeError,
  //   error: incomeError,
  //   isFetching: isIncomeFetching,
  // } = useFetchIncome();

  // const {
  //   data: expenseData,
  //   isError: isExpenseError,
  //   error: expenseError,
  //   isFetching: isExpenseFetching,
  // } = useFetchExpense(0, 999, "month", "date", "desc");

  const {
    data: envelopeData,
    isError: isEnvelopeError,
    error: envelopeError,
    isFetching: isEnvelopeFetching,
  } = useFetchEnvelopes();

  return (
    <>
      <h1 className="text-3xl font-semibold">Overview</h1>
      <div className="grid grid-cols-12 gap-6 xl:gap-8 mt-8  auto-rows-min">
        <div className="xl:col-span-4 lg:col-span-6 col-span-12">
          {envelopeData && <EnvelopeSpendingCard envelopeData={envelopeData} />}
        </div>
        <div className="2xl:col-span-4 xl:col-span-8 lg:col-span-6 col-span-12">
          {envelopeData && <EnvelopeProgressBar envelopeData={envelopeData} />}
        </div>
      </div>
    </>
  );
}
