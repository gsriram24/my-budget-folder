import { useSession } from "@/context/SessionContext";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

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
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return oneMonthAgo;
}

export function useCurrencyHelper() {
  const { session } = useSession();
  const currency = session?.user?.user_metadata?.currency || "INR";
  return {
    format: (amount: number) => formatCurrency(currency, amount),
  };
}

export function formatDate(date: Date | string) {
  return format(date, "do MMM yyyy");
}
