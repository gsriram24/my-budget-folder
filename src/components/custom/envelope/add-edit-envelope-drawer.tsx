import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import AddCard from "../add-card";
import { Button } from "../../ui/button";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../ui/input";
import { useAddOrEditEnvelope, useEditEnvelope } from "@/services/useEnvelope";
import { Envelope } from "@/lib/types";

const formSchema = z.object({
  name: z.string().max(255).min(1, "Name is required"),
  allocated_amount: z.coerce
    .number()
    .int()
    .min(0, "Budget must be greater than 0"),
});
interface AddEditEnvelopeDrawerProps {
  envelope?: Envelope;
  isEdit?: boolean;
  open: boolean;
  handleOpen: (open: boolean) => void;
}

function AddEditEnvelopeDrawer({
  envelope,
  isEdit,
  open,
  handleOpen,
}: AddEditEnvelopeDrawerProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: envelope?.name || "",
      allocated_amount: envelope?.allocated_amount || 0,
    },
  });

  const handleChange = () => {
    form.reset({
      name: envelope?.name || "",
      allocated_amount: envelope?.allocated_amount || 0,
    });
    handleOpen(!open);
  };

  const { isPending, mutate } = useAddOrEditEnvelope(
    form.getValues(),
    handleChange,
  );
  const { isPending: isEditPending, mutate: editMutate } = useEditEnvelope(
    envelope!,
    form.getValues(),
    handleChange,
  );

  const handleSubmit = async () => {
    if (isEdit) editMutate();
    else mutate();
  };

  const text = {
    title: isEdit ? `Edit ${envelope?.name}` : "New envelope",
    description: isEdit
      ? "Ran out of budget? Edit the envelope to increase or decrease your budget."
      : "Create a new envelope with specified budget to start tracking your new expense. You can add upto 30 envelopes.",
  };

  const pending = isEditPending || isPending;

  return (
    <Drawer open={open} onOpenChange={handleChange} direction="right">
      {!isEdit && (
        <DrawerTrigger className="w-full">
          <AddCard label="New envelope" />
        </DrawerTrigger>
      )}
      <DrawerContent className="rounded-none">
        <DrawerHeader>
          <DrawerTitle>{text.title}</DrawerTitle>
          <DrawerDescription>{text.description}</DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form
            id="create-envelope"
            className="mt-4 max-w-md"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Eg: Rent" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4">
              <FormField
                control={form.control}
                name="allocated_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allocated budget</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Eg: $5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DrawerFooter>
          <DrawerClose>
            <Button disabled={pending} variant="outline">
              Cancel
            </Button>
          </DrawerClose>
          <Button loading={pending} type="submit" form="create-envelope">
            Submit
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default AddEditEnvelopeDrawer;
