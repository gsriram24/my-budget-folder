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
import AddCard from "./add-card";
import { Button } from "../ui/button";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import useAddOrEditEnvelope from "@/services/useEnvelope";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().max(255).min(1, "Name is required"),
  allocated_amount: z.coerce
    .number()
    .int()
    .min(0, "Budget must be greater than 0"),
});

function AddCardDrawer() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      allocated_amount: 0,
    },
  });

  const handleClose = () => {
    form.reset();
    setOpen(false);
  };

  const { isPending, mutate } = useAddOrEditEnvelope(
    form.getValues(),
    handleClose,
  );

  const handleSubmit = async () => {
    mutate();
  };
  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger className="w-full">
        <AddCard label="New envelope" />
      </DrawerTrigger>
      <DrawerContent className="rounded-none">
        <DrawerHeader>
          <DrawerTitle>New envelope</DrawerTitle>
          <DrawerDescription>
            Create a new envelope with specified budget to start tracking your
            new expense. You can add upto 30 envelopes.
          </DrawerDescription>
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
            <Button disabled={isPending} variant="outline">
              Cancel
            </Button>
          </DrawerClose>
          <Button loading={isPending} type="submit" form="create-envelope">
            Submit
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default AddCardDrawer;
