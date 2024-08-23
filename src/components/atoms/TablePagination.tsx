import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../@/components/ui/pagination";

interface PaginationTableProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
}

export function PaginationTable({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationTableProps) {
  const maxPageNumbers = 8;
  const half = Math.floor(maxPageNumbers / 2);

  // Calculate the range of pages to display
  let startPage = Math.max(1, currentPage! - half);
  let endPage = Math.min(totalPages!, currentPage! + half);

  // Adjust the start and end page if there are fewer pages than maxPageNumbers
  if (endPage - startPage < maxPageNumbers - 1) {
    if (startPage > 1) {
      startPage = Math.max(1, endPage - maxPageNumbers + 1);
    } else {
      endPage = Math.min(totalPages!, startPage + maxPageNumbers - 1);
    }
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage! > 1) {
                onPageChange(currentPage! - 1);
              }
            }}
          />
        </PaginationItem>

        {/* Display page numbers */}
        {startPage > 1 && (
          <>
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(1);
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>
            {startPage > 2 && <PaginationEllipsis />}
          </>
        )}

        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={page === currentPage}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(page);
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {endPage < totalPages! && (
          <>
            {endPage < totalPages! - 1 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(totalPages!);
                }}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage! < totalPages!) {
                onPageChange(currentPage! + 1);
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
