import { useMemo } from "react";
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
import { useFetchExpense } from "@/services/useExpense";
import { PaginationWithLinks } from "./pagination-with-links";
import { useSearch } from "@tanstack/react-router";
import { Skeleton } from "../ui/skeleton";
import ErrorMessage from "./error-message";

function ExpensesTable() {
  const { pageSize: pageSizeQuery, page: pageFromQuery } = useSearch({
    strict: false,
  }) as any;

  const pageSize = pageSizeQuery || 5;
  const page = pageFromQuery || 1;

  const { data, error, isLoading } = useFetchExpense(page - 1, pageSize);
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
      },
      {
        accessorKey: "envelopeName",
        header: "Envelope",
      },
      {
        accessorKey: "amount",
        header: "Amount Spent",
        cell: ({ row }) => format(row.original.amount),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => formatDate(row.original.date),
      },
      {
        id: "actions",
        cell: () => (
          <EditDeleteDropdown
            handleDeleteOpen={() => {}}
            handleEditOpen={() => {}}
          />
        ),
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
      <Table className="mb-4">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
      <PaginationWithLinks
        pageSize={pageSize}
        page={page}
        totalCount={count!}
        pageSizeOptions={[1, 5, 10, 20, 30, 50]}
      />
    </>
  );
}

export default ExpensesTable;
