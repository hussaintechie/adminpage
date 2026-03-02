import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalItems === 0 || totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // 🔥 Safe & Clean Pagination Logic
  const pages = useMemo(() => {
    const delta = 2;
    const range = [];

    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= start && i <= end)
      ) {
        range.push(i);
      } else if (i === start - 1 || i === end + 1) {
        range.push("...");
      }
    }

    return range;
  }, [currentPage, totalPages]);

  const goToPage = (page) => {
    if (page === "..." || page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-5 px-6 bg-white rounded-2xl shadow-sm border border-gray-100">
    
    {/* LEFT INFO */}
    <p className="text-sm text-gray-600">
      Showing{" "}
      <span className="font-semibold text-gray-900">{startItem}</span> to{" "}
      <span className="font-semibold text-gray-900">{endItem}</span> of{" "}
      <span className="font-semibold text-gray-900">{totalItems}</span>
    </p>

    {/* PAGINATION CONTROLS */}
    <div className="flex items-center gap-1 bg-gray-50 p-1.5 rounded-xl border border-gray-200 shadow-inner">

      {/* Previous */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg transition-all 
        disabled:opacity-40 disabled:cursor-not-allowed
        hover:bg-white hover:shadow-sm"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page Numbers */}
      {pages.map((page, index) => (
        <button
          key={page === "..." ? `ellipsis-${index}` : `page-${page}`}
          disabled={page === "..."}
          onClick={() => goToPage(page)}
          className={`min-w-[36px] h-9 px-3 text-sm font-medium rounded-lg transition-all duration-200
            ${
              page === currentPage
                ? "bg-emerald-600 text-white shadow-md"
                : page === "..."
                ? "cursor-default text-gray-400"
                : "text-gray-700 hover:bg-white hover:shadow-sm"
            }
          `}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-lg transition-all 
        disabled:opacity-40 disabled:cursor-not-allowed
        hover:bg-white hover:shadow-sm"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  </div>
);
};

export default Pagination;