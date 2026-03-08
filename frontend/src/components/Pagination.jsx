import { ChevronLeft, ChevronRight } from "lucide-react";

// Build visible page numbers: up to 5 pages centered around current page
function getPageNumbers(page, totalPages) {
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = start + maxVisible - 1;
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - maxVisible + 1);
  }
  const nums = [];
  for (let i = start; i <= end; i++) nums.push(i);
  return nums;
}

const btnBase =
  "w-9 h-9 flex items-center justify-center rounded-md border text-sm font-medium transition-colors cursor-pointer";
const btnDefault =
  "border-gray-300 bg-white text-gray-700 hover:bg-[#f5f6fd] hover:text-[#3749bb] hover:border-[#3749bb]";
const btnActive = "bg-[#3749bb] text-white border-[#3749bb]";
const btnNav =
  "border-gray-300 bg-white text-gray-600 hover:bg-[#f5f6fd] hover:text-[#3749bb] hover:border-[#3749bb] disabled:opacity-40 disabled:cursor-not-allowed";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="flex justify-center items-center gap-1.5 mt-2">
      {/* Previous */}
      <button
        className={`${btnBase} ${btnNav}`}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        title="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* First page + ellipsis */}
      {pageNumbers[0] > 1 && (
        <>
          <button
            className={`${btnBase} ${btnDefault}`}
            onClick={() => onPageChange(1)}
          >
            1
          </button>
          {pageNumbers[0] > 2 && (
            <span className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
              ...
            </span>
          )}
        </>
      )}

      {/* Page numbers */}
      {pageNumbers.map((n) => (
        <button
          key={n}
          className={`${btnBase} ${n === page ? btnActive : btnDefault}`}
          onClick={() => onPageChange(n)}
        >
          {n}
        </button>
      ))}

      {/* Last page + ellipsis */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
              ...
            </span>
          )}
          <button
            className={`${btnBase} ${btnDefault}`}
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        className={`${btnBase} ${btnNav}`}
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        title="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
