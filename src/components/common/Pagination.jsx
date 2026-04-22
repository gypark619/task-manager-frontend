import { getPagination } from "../../utils/paginationUtils";

const Pagination = ({ currentPage, totalPages, onChangePage }) => {
    const { startPage, endPage, pageNumbers } = getPagination(
        currentPage,
        totalPages,
        5
    );
    
    if (totalPages === 0) return null;

    return (
        <div className="pagination">
            <button
                disabled={startPage === 0}
                onClick={() => onChangePage(startPage - 1)}
            >
                이전
            </button>

            {pageNumbers.map((page) => (
                <button
                    key={page}
                    onClick={() => onChangePage(page)}
                    className={currentPage === page ? "active" : ""}
                >
                    {page + 1}
                </button>
            ))}

            <button
                disabled={endPage >= totalPages}
                onClick={() => onChangePage(endPage)}
            >
                다음
            </button>
        </div>
    );
};

export default Pagination;