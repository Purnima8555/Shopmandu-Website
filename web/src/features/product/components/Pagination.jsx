import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export const Pagination = ({ currentPage, totalPages, goToPage }) => {
  const getPages = () => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Beginning
    if (currentPage <= 2) {
      return [1, 2, 3, "...", totalPages];
    }

    // End
    if (currentPage >= totalPages - 1) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }

    // Middle
    return [currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const pages = getPages();

  return (
    <nav className="flex items-center justify-center gap-2 mt-10">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
        className={`flex items-center justify-center w-9 h-9 rounded-[calc(var(--radius)*0.6)] border border-border bg-card text-foreground ${
          currentPage <= 1 ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <FiChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((page, index) =>
        page === "..." ? (
          <span
            key={`dots-${index}`}
            className="flex items-center justify-center w-9 h-9"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => goToPage(page)}
            className={`flex items-center justify-center w-9 h-9 rounded-[calc(var(--radius)*0.6)] text-sm font-medium border ${
              page === currentPage
                ? "bg-primary border-primary text-white"
                : "bg-card border-border text-foreground"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
        className={`flex items-center justify-center w-9 h-9 rounded-[calc(var(--radius)*0.6)] border border-border bg-card text-foreground ${
          currentPage >= totalPages ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <FiChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};