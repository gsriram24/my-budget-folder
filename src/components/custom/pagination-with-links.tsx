import { type ReactNode, useCallback } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
export interface PaginationWithLinksProps {
  pageSizeOptions: number[];
  totalCount: number;
  pageSize: number;
  page: number;
  pageSearchParam?: string;
}

export function PaginationWithLinks({
  pageSizeOptions,
  pageSize,
  totalCount,
  page,
}: PaginationWithLinksProps) {
  const totalPageCount = Math.ceil(totalCount / pageSize);

  const navigate = useNavigate({
    from: "/expenses",
  });

  const getPageSearch = useCallback((prev: any, page: number) => {
    return { ...prev, page };
  }, []);

  const navToPageSize = useCallback((newPageSize: number) => {
    navigate({
      search: (prev) => ({ ...prev, pageSize: newPageSize }),
    });
  }, []);

  const renderPageNumbers = useCallback(() => {
    const items: ReactNode[] = [];
    const maxVisiblePages = 5;

    if (totalPageCount <= maxVisiblePages) {
      for (let i = 1; i <= totalPageCount; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              search={(prev) => getPageSearch(prev, i)}
              isActive={page === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            search={(prev) => getPageSearch(prev, 1)}
            isActive={page === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );

      if (page > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPageCount - 1, page + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              search={(prev) => getPageSearch(prev, i)}
              isActive={page === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }

      if (page < totalPageCount - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      items.push(
        <PaginationItem key={totalPageCount}>
          <PaginationLink
            search={(prev) => getPageSearch(prev, totalPageCount)}
            isActive={page === totalPageCount}
          >
            {totalPageCount}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  }, [page, totalPageCount]);

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full">
      <div className="flex flex-col gap-4 flex-1">
        <SelectRowsPerPage
          options={pageSizeOptions}
          setPageSize={navToPageSize}
          pageSize={pageSize}
        />
      </div>

      <Pagination className={cn({ "md:justify-end": pageSizeOptions })}>
        <PaginationContent className="max-sm:gap-0">
          <PaginationItem>
            <PaginationPrevious
              search={(prev) => getPageSearch(prev, Math.max(page - 1, 1))}
              aria-disabled={page === 1}
              tabIndex={page === 1 ? -1 : undefined}
              className={
                page === 1 ? "pointer-events-none opacity-50" : undefined
              }
            />
          </PaginationItem>
          {renderPageNumbers()}
          <PaginationItem>
            <PaginationNext
              search={(prev) =>
                getPageSearch(prev, Math.min(page + 1, totalPageCount))
              }
              aria-disabled={page === totalPageCount}
              tabIndex={page === totalPageCount ? -1 : undefined}
              className={
                page === totalPageCount
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function SelectRowsPerPage({
  options,
  setPageSize,
  pageSize,
}: {
  options: number[];
  setPageSize: (newSize: number) => void;
  pageSize: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="whitespace-nowrap text-sm">Rows per page</span>

      <Select
        value={String(pageSize)}
        onValueChange={(value) => setPageSize(Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select page size">
            {String(pageSize)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
