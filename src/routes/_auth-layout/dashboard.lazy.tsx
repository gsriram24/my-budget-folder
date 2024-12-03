import EnvelopeProgressBar from "@/components/custom/dashboard/envelope-progress-bar";
import { EnvelopeSpendingCard } from "@/components/custom/dashboard/envelope-spending-chart";
import { ExpenseStackedChart } from "@/components/custom/dashboard/expense-stacked-chart";
import ErrorMessage from "@/components/custom/error-message";
import { useTitle } from "@/lib/utils";

import { useFetchEnvelopes } from "@/services/useEnvelope";
import { useFetchExpense } from "@/services/useExpense";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

export const Route = createLazyFileRoute("/_auth-layout/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  useTitle("Dashboard");

  const {
    data: expenseData,
    isError: isExpenseError,
    error: expenseError,
    isFetching: isExpenseFetching,
  } = useFetchExpense(0, 999, "2-month", "date", "asc");

  const {
    data: envelopeData,
    isError: isEnvelopeError,
    error: envelopeError,
    isFetching: isEnvelopeFetching,
  } = useFetchEnvelopes();

  const loading = isExpenseFetching || isEnvelopeFetching;

  return (
    <div>
      <h1 className="text-3xl font-semibold">Overview</h1>
      {loading && (
        <div className="flex w-full my-64 items-center justify-center">
          <Loader2 size={64} className="animate-spin text-blue-800" />
        </div>
      )}

      {isEnvelopeError ? (
        <ErrorMessage
          message={envelopeError.message}
          title="Error fetching envelope data"
        />
      ) : (
        !loading && (
          <div className="grid grid-cols-12 gap-6 xl:gap-8 mt-8  auto-rows-min">
            <div className="xl:col-span-4 lg:col-span-6 col-span-12">
              {envelopeData && (
                <EnvelopeSpendingCard envelopeData={envelopeData} />
              )}
            </div>
            <div className="2xl:col-span-4 xl:col-span-8 lg:col-span-6 col-span-12">
              {envelopeData && (
                <EnvelopeProgressBar envelopeData={envelopeData} />
              )}
            </div>
          </div>
        )
      )}
      {isExpenseError ? (
        <ErrorMessage
          message={expenseError.message}
          title="Error fetching expenses"
        />
      ) : (
        !loading && (
          <div className="grid grid-cols-12 gap-6 xl:gap-8 mt-8">
            <div className="xl:col-span-8 col-span-12">
              {expenseData && (
                <ExpenseStackedChart
                  currentAndLastMonthExpenses={expenseData?.data!}
                />
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
