import React from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Pagination = ({
  totalItems,
  currentPage,
  itemsPerPage = 15,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const startItem =
    (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(
    currentPage * itemsPerPage,
    totalItems
  );

  /* -------- PAGE NUMBER LOGIC (1 2 3 ... 64) -------- */
  const getPages = () => {
    const pages = [];
    const maxVisible = 3;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage > maxVisible) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4">

      {/* SHOWING TEXT */}
      <div className="text-sm text-gray-600">
        Showing <b>{startItem}</b> to <b>{endItem}</b> of{" "}
        <b>{totalItems}</b> results
      </div>

      {/* PAGINATION BUTTONS */}
      <div className="flex items-center gap-1 bg-white border rounded-lg shadow-sm">

        {/* PREVIOUS */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 border-r disabled:opacity-40 hover:bg-gray-100"
        >
          <ChevronLeft size={18} />
        </button>

        {/* PAGE NUMBERS */}
        {getPages().map((page, index) =>
          page === "..." ? (
            <span
              key={index}
              className="px-3 py-2 text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 font-semibold ${
                page === currentPage
                  ? "bg-emerald-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* NEXT */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 border-l disabled:opacity-40 hover:bg-gray-100"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
