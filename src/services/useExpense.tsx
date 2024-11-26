import { useToast } from "@/hooks/use-toast";
import { Income } from "@/lib/types";
import { getOneMonthAgo } from "@/lib/utils";
import supabase from "@/supabaseClient";
import {
  keepPreviousData,
  QueryClient,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export interface AddIncome {
  name: string;
  amount: number;
  recurring: boolean;
}

const invalidateQuery = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ["income"] });
};

const addIncome = async (income: AddIncome) => {
  const { error } = await supabase.from("income").upsert(income).single();
  if (error) {
    throw error;
  }
};

export function useAddIncome(income: AddIncome, handleClose: () => void) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => addIncome(income),
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
        description: "Income source added!",
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
    .order("created_at")
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

const editIncome = async (income: AddIncome, existingIncome: Income) => {
  const { data: incomeHistory, error: historyError } = await supabase
    .from("income_history")
    .select("created_at, amount")
    .eq("parent_id", existingIncome.id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (historyError) {
    throw historyError;
  }
  const incomeHistoryData = incomeHistory[0];
  if (!incomeHistoryData) {
    const { error: insertError } = await supabase
      .from("income_history")
      .insert({
        ...existingIncome,
        parent_id: existingIncome.id,
        id: undefined,
        monthlySpend: undefined,
      });

    if (insertError) {
      throw insertError;
    }
  } else {
    const lastCreatedAt = new Date(incomeHistoryData.created_at);

    if (
      lastCreatedAt < getOneMonthAgo() &&
      incomeHistoryData.amount !== income.amount
    ) {
      const { error: insertError } = await supabase
        .from("income_history")
        .insert({
          ...existingIncome,
          parent_id: existingIncome.id,
          id: undefined,
          monthlySpend: undefined,
        });

      if (insertError) {
        throw insertError;
      }
    }
  }

  const { error } = await supabase
    .from("income")
    .upsert({ ...income, id: existingIncome.id })
    .single();
  if (error) {
    throw error;
  }
};
export function useEditIncome(
  existingIncome: Income,
  income: AddIncome,
  handleClose: () => void,
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => editIncome(income, existingIncome),
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
        description: `Income ${income.name} updated!`,
        variant: "success",
      });
      handleClose();
    },
    onSettled: () => invalidateQuery(queryClient),
  });
}

export const deleteIncome = async (id: string) => {
  const { error } = await supabase.from("income").delete().eq("id", id);
  if (error) {
    throw error;
  }
};
export function useDeleteIncome(handleClose: () => void) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteIncome(id),
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
        description: "Income deleted!",
        variant: "success",
      });
      handleClose();
    },
    onSettled: () => invalidateQuery(queryClient),
  });
}
