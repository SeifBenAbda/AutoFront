import React from 'react';

interface CustomPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    containerClassName?: string;
    previousButtonClassName?: string;
    nextButtonClassName?: string;
    activePageClassName?: string;
    inactivePageClassName?: string;
    dotClassName?: string;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    containerClassName = "flex items-center justify-center mt-4 space-x-2",
    previousButtonClassName = "px-3 py-1 bg-gray-300 text-gray-800 rounded disabled:opacity-50",
    nextButtonClassName = "px-3 py-1 bg-gray-300 text-gray-800 rounded disabled:opacity-50",
    activePageClassName = "bg-blue-500 text-white",
    inactivePageClassName = "bg-gray-200 text-gray-800",
    dotClassName = "px-3 py-1",
}) => {
    const delta = 2;
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        let left = currentPage - delta;
        let right = currentPage + delta;

        if (left < 2) {
            right = 1 + 2 * delta;
        }
        if (right > totalPages - 1) {
            left = totalPages - 2 * delta;
        }

        pages.push(1);
        if (left > 2) {
            pages.push('...');
        }

        for (let i = Math.max(left, 2); i <= Math.min(right, totalPages - 1); i++) {
            pages.push(i);
        }

        if (right < totalPages - 1) {
            pages.push('...');
        }

        pages.push(totalPages);
    }

    return (
        <div className={containerClassName}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={previousButtonClassName}
            >
                Précédent
            </button>

            {pages.map((p, index) => {
                if (typeof p === 'number') {
                    const isActive = p === currentPage;
                    return (
                        <button
                            key={index}
                            onClick={() => onPageChange(p)}
                            className={`px-3 py-1 rounded ${isActive ? activePageClassName : inactivePageClassName}`}
                        >
                            {p}
                        </button>
                    );
                }
                return (
                    <span key={index} className={dotClassName}>
                        {p}
                    </span>
                );
            })}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={nextButtonClassName}
            >
                Suivant
            </button>
        </div>
    );
};

export default CustomPagination;