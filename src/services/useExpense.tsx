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
};

const addExpense = async (expense: AddExpense) => {
  const { error } = await supabase.from("expense").insert(expense).single();
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

export const fetchExpenses = async (page: number, offset: number) => {
  const { data, error, count } = await supabase
    .from("expense")
    .select(
      "id, title, envelope, amount, date, ...envelope ( envelopeName:name )",
      {
        count: "exact",
      },
    )
    .order("date", { ascending: false })
    .range(page, page + offset - 1);

  if (error) {
    throw error;
  }
  return { data, count };
};

export function useFetchExpense(page: number, offset: number) {
  const fetchExpenseQueryOptions = queryOptions({
    queryKey: ["expenses", page, offset],
    queryFn: () => fetchExpenses(page, offset),
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
