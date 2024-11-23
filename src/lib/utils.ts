import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import currencyCode from "@/lib/currency.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrencySymbol(currency: string) {
  return (currencyCode as any)[currency]?.symbol ?? currency;
}

export function getOneMonthAgo() {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return oneMonthAgo;
}
