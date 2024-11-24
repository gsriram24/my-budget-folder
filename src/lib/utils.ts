import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
