import AddEditExpenseDrawer from "@/components/custom/expense/add-expense-drawer";
import ExpensesTable from "@/components/custom/expense/expenses-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ArrowUpDownIcon, FilterIcon } from "lucide-react";
import { useState } from "react";

export const Route = createLazyFileRoute("/_auth-layout/expenses")({
  component: RouteComponent,
});

const filterKeysAndValues = [
  { key: "week", value: "Last Week" },
  { key: "month", value: "This Month" },
  { key: "3-month", value: "Last 3 months" },
  { key: "6-month", value: "Last 6 months" },
  { key: "year", value: "Last year" },
  { key: "all", value: "All" },
];

const sortOptions = [
  { key: "date-desc", value: "Most recent" },
  { key: "date-asc", value: "Oldest" },
  { key: "amount-desc", value: "Most spent" },
  { key: "amount-asc", value: "Least spent" },
];

function RouteComponent() {
  const [open, setOpen] = useState(false);
  const handleOpen = (open: boolean) => {
    setOpen(open);
  };
  const navigate = useNavigate({ from: "/expenses" });
  const handleFilter = (value: string) => {
    navigate({
      search: (old) => ({
        ...old,
        filter: value,
      }),
    });
  };
  const handleSort = (value: string) => {
    const [sort, order] = value.split("-");
    navigate({
      search: (old) => ({
        ...old,
        sortValue: sort,
        sortOrder: order,
      }),
    });
  };

  const { filter, sortValue, sortOrder } = useSearch({ strict: false }) as any;

  return (
    <>
      <h1 className="font-semibold text-3xl">Expenses</h1>
      <p className="text-gray-500 mt-2">
        Had a recent expenditure? Spent something? Manage all your expenses
        here!
      </p>
      <div className="flex gap-2 justify-between mt-6 mb-4">
        <div className="flex gap-4">
          <Select
            defaultValue="month"
            value={filter}
            onValueChange={handleFilter}
          >
            <SelectTrigger>
              <div className="flex gap-3 items-center w-32" role="button">
                <FilterIcon size={16} />
                <SelectValue placeholder="Filter"></SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent>
              {filterKeysAndValues.map((filter) => (
                <SelectItem key={filter.key} value={filter.key}>
                  {filter.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={`${sortValue ?? "date"}-${sortOrder ?? "desc"}`}
            onValueChange={handleSort}
          >
            <SelectTrigger>
              <div className="flex gap-3 items-center w-32">
                <ArrowUpDownIcon size={16} />{" "}
                <SelectValue placeholder="Sort"></SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((sort) => (
                <SelectItem key={sort.key} value={sort.key}>
                  {sort.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <AddEditExpenseDrawer open={open} handleOpen={handleOpen} />
      </div>
      <ExpensesTable />
    </>
  );
}
