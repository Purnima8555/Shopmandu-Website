import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import Selecter from "../../../components/ui/Selecter";

const AdminPagination = ({  metadata,  page,  setPage,  limit,  setLimit,  refreshData,  pageSizeOptions = [10, 20, 50, 100],}) => {
  const totalResults = metadata?.totalResults || 0; /// how many data or documents or resultes.

  const start = totalResults === 0 ? 0 : (page - 1) * limit + 1; /// page data start from
  /**
   * if page=1, limit=10, totalResults= 34
   *  (1 - 1) * 10 + 1
   *  0 * 10 + 1
   * 0 + 1
   * 1
   */

  const end = totalResults === 0 ? 0 : Math.min(page * limit, totalResults); /// page data end.
  /**
   * Math.min(1 * 10, 34)
   * Math.min(10, 34)
   * 10
   */

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
      <div className="flex items-center gap-3">
        <span className="text-xs whitespace-nowrap text-text-secondary">
          Rows
        </span>

        <Selecter
          size="sm"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="w-24"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </Selecter>

        <span className="text-xs font-medium whitespace-nowrap text-text-secondary">
          {start}-{end} of {totalResults}
        </span>

        {refreshData && (
          <button
            onClick={refreshData}
            className="rounded-lg p-2 text-text-secondary transition hover:bg-bg-main hover:text-primary"
          >
            <RefreshCw size={16} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={!metadata?.hasPrevPage}
          className="rounded-lg border border-border p-2 transition hover:bg-bg-main disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="min-w-22.5 text-center text-xs font-semibold text-text-secondary">
          Page {metadata?.currentPage || 1} of {metadata?.totalPages || 1}
        </div>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!metadata?.hasNextPage}
          className="rounded-lg border border-border p-2 transition hover:bg-bg-main disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
export default AdminPagination;
