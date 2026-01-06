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

  const pages = useMemo(() => {
    const range = [];
    const delta = 2;

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    range.push(1);

    if (left > 2) range.push("...");

    for (let i = left; i <= right; i++) range.push(i);

    if (right < totalPages - 1) range.push("...");

    if (totalPages > 1) range.push(totalPages);

    return range;
  }, [currentPage, totalPages]);

  const goToPage = (page) => {
    if (page === "..." || page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 border-t bg-white">
      
      {/* MOBILE */}
      <div className="flex justify-between w-full sm:hidden">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded-md text-sm"
        >
          Previous
        </button>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded-md text-sm"
        >
          Next
        </button>
      </div>

      {/* DESKTOP */}
      <div className="hidden sm:flex w-full items-center justify-between">
        <p className="text-sm text-gray-700">
          Showing <b>{startItem}</b> to <b>{endItem}</b> of <b>{totalItems}</b>
        </p>

        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-2 border rounded-l-md"
          >
            <ChevronLeft size={16} />
          </button>

          {pages.map((page, idx) => (
            <button
              key={idx}
              disabled={page === "..."}
              onClick={() => goToPage(page)}
              className={`px-4 py-2 border text-sm ${
                page === currentPage
                  ? "bg-emerald-600 text-white"
                  : page === "..."
                  ? "cursor-default text-gray-400"
                  : "hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-2 border rounded-r-md"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
