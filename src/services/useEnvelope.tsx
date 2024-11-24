import { useToast } from "@/hooks/use-toast";
import { Envelope } from "@/lib/types";
import { getOneMonthAgo } from "@/lib/utils";
import supabase from "@/supabaseClient";
import {
  QueryClient,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export interface AddEnvelope {
  name: string;
  allocated_amount: number;
}

const invalidateQuery = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ["envelopes"] });
};

const addOrEditEnvelope = async (envelope: AddEnvelope) => {
  const { error } = await supabase.from("envelope").upsert(envelope).single();
  if (error) {
    throw error;
  }
};

export function useAddOrEditEnvelope(
  envelope: AddEnvelope,
  handleClose: () => void,
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => addOrEditEnvelope(envelope),
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
        description: "Envelope added!",
        variant: "success",
      });
      handleClose();
    },
    onSettled: () => invalidateQuery(queryClient),
  });
}

export const fetchEnvelopes = async () => {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const { data, error } = await supabase
    .from("envelope")
    .select(
      `id, name, allocated_amount, monthlySpend: expense ( amount.sum() )`,
    )
    .gte("expense.date", getOneMonthAgo().toISOString())
    .order("created_at");
  if (error) {
    throw error;
  }

  return data.map((envelope) => ({
    ...envelope,
    monthlySpend: envelope.monthlySpend?.[0]?.sum || 0,
  }));
};

export const fetchEnvelopeQueryOptions = queryOptions({
  queryKey: ["envelopes"],
  queryFn: () => fetchEnvelopes(),
  staleTime: 1000 * 60 * 5,
});
export function useFetchEnvelopes() {
  return useQuery(fetchEnvelopeQueryOptions);
}

const editEnvelope = async (
  envelope: AddEnvelope,
  existingEnvelope: Envelope,
) => {
  const { data: envelopeHistory, error: historyError } = await supabase
    .from("envelope_history")
    .select("created_at, allocated_amount")
    .eq("parent_id", existingEnvelope.id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (historyError) {
    throw historyError;
  }
  const envelopeHistoryData = envelopeHistory[0];
  if (!envelopeHistoryData) {
    const { error: insertError } = await supabase
      .from("envelope_history")
      .insert({
        ...existingEnvelope,
        parent_id: existingEnvelope.id,
        id: undefined,
        monthlySpend: undefined,
      });

    if (insertError) {
      throw insertError;
    }
  } else {
    const lastCreatedAt = new Date(envelopeHistoryData.created_at);

    if (
      lastCreatedAt < getOneMonthAgo() &&
      envelopeHistoryData.allocated_amount !== envelope.allocated_amount
    ) {
      const { error: insertError } = await supabase
        .from("envelope_history")
        .insert({
          ...existingEnvelope,
          parent_id: existingEnvelope.id,
          id: undefined,
          monthlySpend: undefined,
        });

      if (insertError) {
        throw insertError;
      }
    }
  }

  const { error } = await supabase
    .from("envelope")
    .upsert({ ...envelope, id: existingEnvelope.id })
    .single();
  if (error) {
    throw error;
  }
};
export function useEditEnvelope(
  existingEnvelope: Envelope,
  envelope: AddEnvelope,
  handleClose: () => void,
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => editEnvelope(envelope, existingEnvelope),
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
        description: `Envelope ${envelope.name} updated!`,
        variant: "success",
      });
      handleClose();
    },
    onSettled: () => invalidateQuery(queryClient),
  });
}

export const deleteEnvelope = async (id: string) => {
  const { error } = await supabase.from("envelope").delete().eq("id", id);
  if (error) {
    throw error;
  }
};
export function useDeleteEnvelope(handleClose: () => void) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEnvelope(id),
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
        description: "Envelope deleted!",
        variant: "success",
      });
      handleClose();
    },
    onSettled: () => invalidateQuery(queryClient),
  });
}
