import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export const Pagination = ({ currentPage, totalPages, goToPage }) => (
  <nav className="flex items-center justify-center gap-2 mt-10">
    <button
      type="button"
      disabled={currentPage <= 1}
      onClick={() => goToPage(currentPage - 1)}
      className={`flex items-center justify-center w-9 h-9 rounded-[calc(var(--radius)*0.6)] border border-border bg-card text-foreground ${
        currentPage <= 1 ? "opacity-50 pointer-events-none" : ""
      }`}
      aria-label="Previous page"
    >
      <FiChevronLeft className="w-4 h-4" />
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
      const active = page === currentPage;
      return (
        <button
          key={page}
          type="button"
          onClick={() => goToPage(page)}
          className={`flex items-center justify-center w-9 h-9 rounded-[calc(var(--radius)*0.6)] text-sm font-medium border ${
            active ? "bg-primary border-primary text-white" : "bg-card border-border text-foreground"
          }`}
        >
          {page}
        </button>
      );
    })}

    <button
      type="button"
      disabled={currentPage >= totalPages}
      onClick={() => goToPage(currentPage + 1)}
      className={`flex items-center justify-center w-9 h-9 rounded-[calc(var(--radius)*0.6)] border border-border bg-card text-foreground ${
        currentPage >= totalPages ? "opacity-50 pointer-events-none" : ""
      }`}
      aria-label="Next page"
    >
      <FiChevronRight className="w-4 h-4" />
    </button>
  </nav>
);