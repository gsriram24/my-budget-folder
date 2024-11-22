import { useToast } from "@/hooks/use-toast";
import supabase from "@/supabaseClient";
import { useMutation } from "@tanstack/react-query";

interface AddEnvelope {
  name: string;
  allocated_amount: number;
}

const addOrEditEnvelope = async (envelope: AddEnvelope) => {
  const { error } = await supabase.from("envelope").upsert(envelope).single();
  if (error) {
    throw error;
  }
};
export default function useAddOrEditEnvelope(
  envelope: AddEnvelope,
  handleClose: () => void,
) {
  const { toast } = useToast();

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
  });
}
