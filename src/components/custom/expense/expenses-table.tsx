import { useMemo, useState } from "react";
import EditDeleteDropdown from "@/components/custom/edit-delete-dropdown";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@/components/ui/table";
import { Expense } from "@/lib/types";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatDate, useCurrencyHelper } from "@/lib/utils";
import { useDeleteExpense, useFetchExpense } from "@/services/useExpense";
import { PaginationWithLinks } from "../pagination-with-links";
import { useSearch } from "@tanstack/react-router";
import { Skeleton } from "../../ui/skeleton";
import ErrorMessage from "../error-message";
import AddEditExpenseDrawer from "./add-expense-drawer";
import { DeleteDialog } from "../delete-dialog";

function ExpensesTable() {
  // Edit expense states
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [open, setOpen] = useState(false);
  const handleOpen = (open: boolean) => {
    setOpen(open);
  };
  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    handleOpen(true);
  };

  // Delete expense states

  const [deleteOpen, setDeleteOpen] = useState(false);
  const handleDeleteOpen = (open: boolean) => {
    setDeleteOpen(open);
  };
  const handleDelete = (expense: Expense) => {
    setSelectedExpense(expense);
    handleDeleteOpen(true);
  };
  const { mutate, isPending } = useDeleteExpense(() => handleDeleteOpen(false));

  // Get all page state from the URL
  const {
    pageSize: pageSizeQuery,
    page: pageFromQuery,
    filter,
    sortValue,
    sortOrder,
  } = useSearch({
    strict: false,
  }) as any;

  const pageSize = pageSizeQuery || 10;
  const page = pageFromQuery || 1;

  // Fetch expenses data
  const { data, error, isLoading } = useFetchExpense(
    page - 1,
    pageSize,
    filter,
    sortValue,
    sortOrder,
  );
  const { data: expenses, count } = useMemo(
    () => data || { data: [], count: 0 },
    [data],
  );

  const { format } = useCurrencyHelper();

  const columns: ColumnDef<Expense>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Expense",
        minWidth: 200,
      },

      {
        accessorKey: "amount",
        header: "Amount Spent",
        cell: ({ row }) => format(row.original.amount),
      },
      {
        accessorKey: "envelopeName",
        header: "Envelope",
      },

      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => formatDate(row.original.date),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex justify-end max-w-32">
            <EditDeleteDropdown
              handleDeleteOpen={() => handleDelete(row.original)}
              handleEditOpen={() => {
                handleEdit(row.original);
              }}
            />
          </div>
        ),
        size: 60,
      },
    ],
    [],
  );

  const table = useReactTable({
    data: expenses,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(count ?? 1 / pageSize),
    rowCount: pageSize,
  });

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    style={{
                      minWidth: header.getSize() ? header.getSize() : 0,
                    }}
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                <Skeleton className="w-full h-4" />
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                <ErrorMessage message={error.message} />
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="mt-4">
        <PaginationWithLinks
          pageSize={pageSize}
          page={page}
          totalCount={count!}
          pageSizeOptions={[5, 10, 20, 30, 50]}
        />
      </div>
      <AddEditExpenseDrawer
        open={open}
        handleOpen={handleOpen}
        expense={selectedExpense!}
        isEdit
      />
      <DeleteDialog
        keyText="expense"
        handleClose={handleDeleteOpen}
        onDelete={() => mutate(selectedExpense?.id!)}
        open={deleteOpen}
        isPending={isPending}
      />
    </>
  );
}

export default ExpensesTable;
