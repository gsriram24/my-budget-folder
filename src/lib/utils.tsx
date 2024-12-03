import { useSession } from "@/context/SessionContext";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns-tz";
import { Expense } from "./types";
import { useEffect } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(currency: string, amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  });
}

export function getOneMonthAgo() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return startOfMonth;
}

export function useCurrencyHelper() {
  const { session } = useSession();
  const currency = session?.user?.user_metadata?.currency || "INR";
  return {
    format: (amount: number) => formatCurrency(currency, amount),
    getCurrency: () => currency,
  };
}

export function formatDate(date: Date | string) {
  return format(date, "do MMM yyyy", { timeZone: "UTC" });
}

export const generateCumulativeData = (
  expenses: Expense[],
): {
  date: string;
  label: string;
  thisMonthAmount?: number;
  prevMonthAmount?: number;
}[] => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const today = now.getDate();

  const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;

  // Helper: Format date and group expenses by date
  const expenseMap = expenses.reduce(
    (acc, expense) => {
      const date = formatDate(expense.date);
      acc[date] = (acc[date] || 0) + expense.amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Helper: Generate cumulative data for a month
  const generateMonthData = (
    year: number,
    month: number,
    days: number,
    limit?: number,
  ) => {
    let cumulativeSum = 0;
    return Array.from({ length: limit ?? days }, (_, i) => {
      const day = i + 1;
      const date = formatDate(new Date(year, month, day));
      const dailySum = expenseMap[date] || 0;
      cumulativeSum += dailySum;
      return { date, label: `Day ${day}`, amount: cumulativeSum };
    });
  };

  // Generate data for the current and previous months
  const daysInCurrentMonth = new Date(
    currentYear,
    currentMonth + 1,
    0,
  ).getDate();
  const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();

  const thisMonthData = generateMonthData(
    currentYear,
    currentMonth,
    daysInCurrentMonth,
    today,
  );
  const prevMonthData = generateMonthData(
    prevMonthYear,
    prevMonth,
    daysInPrevMonth,
  );

  // Combine data for both months
  const combinedData = Array.from(
    { length: Math.max(thisMonthData.length, prevMonthData.length) },
    (_, i) => {
      const thisMonthEntry = thisMonthData[i];
      const prevMonthEntry = prevMonthData[i];

      return {
        date: thisMonthEntry?.date || prevMonthEntry?.date || "",
        label: `Day ${i + 1}`,
        ...(thisMonthEntry ? { thisMonthAmount: thisMonthEntry.amount } : {}),
        ...(prevMonthEntry ? { prevMonthAmount: prevMonthEntry.amount } : {}),
      };
    },
  ).filter((entry) => entry.thisMonthAmount || entry.prevMonthAmount);

  return combinedData;
};

export const useTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} - Budget Folder`;
  }, [title]);
};
