import React from 'react';
import AdminButton from './AdminButton';

interface AdminPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showInfo?: boolean;
    totalItems?: number;
    itemsPerPage?: number;
}

const AdminPagination: React.FC<AdminPaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    showInfo = false,
    totalItems = 0,
    itemsPerPage = 10
}) => {
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
        }}>
            {showInfo && (
                <div style={{
                    color: '#6b7280',
                    fontSize: '14px'
                }}>
                    Showing {startItem} to {endItem} of {totalItems} results
                </div>
            )}
            
            <div style={{
                display: 'flex',
                gap: '4px',
                alignItems: 'center'
            }}>
                <AdminButton
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className={`bg-slate-200 hover:bg-slate-400 text-slate-700 font-bold px-4 py-1 rounded shadow-md transition-all duration-200 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    size="small"
                >
                    Prev
                </AdminButton>
                
                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span
                            key={`ellipsis-${index}`}
                            className="px-2 text-slate-400 font-bold"
                        >
                            ...
                        </span>
                    ) : (
                        <AdminButton
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            className={
                                currentPage === page
                                    ? "bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-4 py-1 rounded shadow-md transition-all duration-200"
                                    : "bg-purple-200 hover:bg-purple-400 text-purple-700 font-bold px-4 py-1 rounded shadow-md transition-all duration-200"
                            }
                            size="small"
                            style={{ minWidth: '36px', justifyContent: 'center' }}
                        >
                            {page}
                        </AdminButton>
                    )
                ))}
                
                <AdminButton
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className={`bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-1 rounded shadow-md transition-all duration-200 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    size="small"
                >
                    Next
                </AdminButton>
            </div>
        </div>
    );
};

export default AdminPagination;
