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
import { Expense } from "@/lib/types";
import { useAddExpense, useEditExpense } from "@/services/useExpense";
import { Loader2, PlusIcon } from "lucide-react";
import {
  SelectValue,
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
} from "@/components/ui/select";
import { useFetchEnvelopes } from "@/services/useEnvelope";
import ErrorMessage from "../error-message";
import { DatePicker } from "../date-picker";
import { useCallback, useEffect } from "react";

const formSchema = z.object({
  title: z.string().max(255).min(1, "Name is required"),
  amount: z.coerce.number().int().min(0, "Expense must be greater than 0"),
  date: z.coerce.date(),
  envelope: z.string({ required_error: "Please select an envelope!" }),
});

interface AddEditExpenseDrawerProps {
  expense?: Expense;
  isEdit?: boolean;
  open: boolean;
  handleOpen: (open: boolean) => void;
}

function AddEditExpenseDrawer({
  expense,
  isEdit,
  open,
  handleOpen,
}: AddEditExpenseDrawerProps) {
  const {
    data: envelopeData,
    isError: isEnvelopeError,
    error: envelopeError,
    isFetching,
  } = useFetchEnvelopes();
  const getDefaultValues = useCallback(() => {
    return {
      title: expense?.title || "",
      amount: expense?.amount || 0,
      date: new Date(),
      envelope: expense?.envelope || "",
    };
  }, [expense]);

  useEffect(() => {
    if (expense) {
      form.reset(getDefaultValues());
    }
  }, [expense]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  });

  const handleChange = () => {
    form.reset(getDefaultValues());
    handleOpen(!open);
  };

  const { isPending, mutate } = useAddExpense(form.getValues(), handleChange);
  const { isPending: isEditPending, mutate: editMutate } = useEditExpense(
    expense!,
    form.getValues(),
    handleChange,
  );

  const handleSubmit = async () => {
    if (isEdit) editMutate();
    else mutate();
  };

  const text = {
    title: isEdit ? `Edit ${expense?.title}` : "New expense",
    description: isEdit
      ? "Made a mistake? Edit the expense"
      : "Spent money? Create a new expense under an envelope by entering the title, amount spent and the date in which this expense was incurred",
  };

  const pending = isEditPending || isPending;

  return (
    <Drawer open={open} onOpenChange={handleChange} direction="right">
      {!isEdit && (
        <DrawerTrigger asChild>
          <Button>
            <PlusIcon size={24} strokeWidth={4} /> Add expense
          </Button>
        </DrawerTrigger>
      )}
      <DrawerContent className="rounded-none">
        <DrawerHeader>
          <DrawerTitle>{text.title}</DrawerTitle>
          <DrawerDescription>{text.description}</DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form
            id="create-expense"
            className="mt-4 max-w-md"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="title"
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount spent</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Eg: $5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-4">
              <FormField
                control={form.control}
                name="envelope"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-0">Envelope</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select an envelope"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {isFetching && (
                            <Loader2 className="animate-spin w-full flex my-4 justify-center" />
                          )}
                          {isEnvelopeError && (
                            <ErrorMessage message={envelopeError.message} />
                          )}
                          {envelopeData?.map((envelope) => (
                            <SelectItem key={envelope.id} value={envelope.id}>
                              {envelope.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-0">Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        selectDate={field.onChange}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button disabled={pending} variant="outline">
              Cancel
            </Button>
          </DrawerClose>
          <Button loading={pending} type="submit" form="create-expense">
            Submit
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default AddEditExpenseDrawer;
