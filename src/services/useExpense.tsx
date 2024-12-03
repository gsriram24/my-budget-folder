import { useToast } from "@/hooks/use-toast";
import { Expense } from "@/lib/types";
import supabase from "@/supabaseClient";
import {
  keepPreviousData,
  QueryClient,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export interface AddExpense {
  title: string;
  amount: number;
  envelope: string;
  date: Date;
}

const invalidateQuery = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ["expenses"] });
  queryClient.invalidateQueries({ queryKey: ["envelopes"] });
};

const addExpense = async (expense: AddExpense) => {
  const date = expense.date.toLocaleDateString();
  const { error } = await supabase
    .from("expense")
    .insert({ ...expense, date })
    .single();
  if (error) {
    throw error;
  }
};

export function useAddExpense(expense: AddExpense, handleClose: () => void) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => addExpense(expense),
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Epxense added!",
        variant: "success",
      });
      handleClose();
    },
    onSettled: () => invalidateQuery(queryClient),
  });
}

export const fetchExpenses = async (
  page: number,
  offset: number,
  filter: string,
  sortValue: string,
  sortOrder: string,
) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  switch (filter) {
    case "week":
      date.setDate(date.getDate() - 7);
      break;
    case "month":
      date.setDate(1);
      break;
    case "2-month":
      date.setDate(1);
      date.setMonth(date.getMonth() - 2);
      break;
    case "3-month":
      date.setMonth(date.getMonth() - 3);
      break;
    case "6-month":
      date.setMonth(date.getMonth() - 6);
      break;
    case "year":
      date.setFullYear(date.getFullYear() - 1);
      break;
    case "all":
      date.setFullYear(date.getFullYear() - 100);
      break;
    default:
      break;
  }

  const from = page * offset;
  const to = from + offset;

  const { data, error, count } = await supabase
    .from("expense")
    .select(
      "id, title, envelope, amount, date, ...envelope ( envelopeName:name )",
      {
        count: "exact",
      },
    )
    .gte("date", date.toLocaleString())
    .order(sortValue, { ascending: sortOrder === "asc" })
    .range(from, to - 1);

  if (error) {
    throw error;
  }
  return { data, count };
};

export function useFetchExpense(
  page: number,
  offset: number,
  filter: string = "month",
  sortValue: string = "date",
  sortOrder: string = "desc",
) {
  const fetchExpenseQueryOptions = queryOptions({
    queryKey: ["expenses", page, offset, filter, sortValue, sortOrder],
    queryFn: () => fetchExpenses(page, offset, filter, sortValue, sortOrder),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
  return useQuery(fetchExpenseQueryOptions);
}

const editExpense = async (expense: AddExpense, exisitngExpense: Expense) => {
  const { error } = await supabase
    .from("expense")
    .upsert({ ...expense, id: exisitngExpense.id })
    .single();
  if (error) {
    throw error;
  }
};
export function useEditExpense(
  exisitngExpense: Expense,
  expense: AddExpense,
  handleClose: () => void,
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => editExpense(expense, exisitngExpense),
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Expense ${expense.title} updated!`,
        variant: "success",
      });
      handleClose();
    },
    onSettled: () => invalidateQuery(queryClient),
  });
}

export const deleteExpense = async (id: string) => {
  const { error } = await supabase.from("expense").delete().eq("id", id);
  if (error) {
    throw error;
  }
};
export function useDeleteExpense(handleClose: () => void) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Expense deleted!",
        variant: "success",
      });
      handleClose();
    },
    onSettled: () => invalidateQuery(queryClient),
  });
}
