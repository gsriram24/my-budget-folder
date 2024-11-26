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
import AddCard from "@/components/custom/add-card";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Income } from "@/lib/types";
import { useAddIncome, useEditIncome } from "@/services/useIncome";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

const formSchema = z.object({
  name: z.string().max(255).min(1, "Name is required"),
  amount: z.coerce.number().int().min(0, "Budget must be greater than 0"),
  recurring: z.boolean(),
});
interface AddEditIncomeDrawerProps {
  income?: Income;
  isEdit?: boolean;
  open: boolean;
  handleOpen: (open: boolean) => void;
}

function AddEditIncomeDrawer({
  income,
  isEdit,
  open,
  handleOpen,
}: AddEditIncomeDrawerProps) {
  const defaultValues = {
    name: income?.name || "",
    amount: income?.amount || 0,
    recurring: income?.recurring ?? true,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleChange = () => {
    form.reset(defaultValues);
    handleOpen(!open);
  };

  const { isPending, mutate } = useAddIncome(form.getValues(), handleChange);
  const { isPending: isEditPending, mutate: editMutate } = useEditIncome(
    income!,
    form.getValues(),
    handleChange,
  );

  const handleSubmit = async () => {
    if (isEdit) editMutate();
    else mutate();
  };

  const text = {
    title: isEdit ? `Edit ${income?.name}` : "New income",
    description: isEdit
      ? "Got a salary hike? Edit the income source to increase or decrease your income amount."
      : "Create a new income source with specified budget to start tracking your new expense. You can add upto 30 income sources.",
  };

  const pending = isEditPending || isPending;

  return (
    <Drawer open={open} onOpenChange={handleChange} direction="right">
      {!isEdit && (
        <DrawerTrigger className="w-full">
          <AddCard label="New income" />
        </DrawerTrigger>
      )}
      <DrawerContent className="rounded-none">
        <DrawerHeader>
          <DrawerTitle>{text.title}</DrawerTitle>
          <DrawerDescription>{text.description}</DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form
            id="create-income"
            className="mt-4 max-w-md"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Eg: Freelance for XYZ Studios"
                      {...field}
                    />
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
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Eg: $5000" {...field} />
                    </FormControl>
                    {form.getValues().recurring && (
                      <FormDescription>
                        Please enter your monthly income amount. If the income
                        is of a different frequency, please convert it to
                        monthly amount.
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-4">
              <FormField
                control={form.control}
                name="recurring"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Recurring{" "}
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon size={14} className="text-neutral-500" />
                          </TooltipTrigger>
                          <TooltipContent
                            className="max-w-72 font-normal text-neutral-600"
                            side="right"
                          >
                            <div className="p-2">
                              Does this income source repeat every month or
                              every few months? Or is it just something you got
                              once?
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3  mt-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={true} />
                          </FormControl>
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={false} />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
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
          <Button loading={pending} type="submit" form="create-income">
            Submit
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default AddEditIncomeDrawer;
