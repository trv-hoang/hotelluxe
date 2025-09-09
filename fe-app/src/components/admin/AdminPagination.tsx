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
                    variant="secondary"
                    size="small"
                    style={{
                        opacity: currentPage === 1 ? 0.5 : 1,
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                    }}
                >
                    Previous
                </AdminButton>
                
                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span
                            key={`ellipsis-${index}`}
                            style={{
                                padding: '8px 4px',
                                color: '#6b7280'
                            }}
                        >
                            ...
                        </span>
                    ) : (
                        <AdminButton
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            variant={currentPage === page ? "primary" : "secondary"}
                            size="small"
                            style={{
                                minWidth: '36px',
                                justifyContent: 'center'
                            }}
                        >
                            {page}
                        </AdminButton>
                    )
                ))}
                
                <AdminButton
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    variant="secondary"
                    size="small"
                    style={{
                        opacity: currentPage === totalPages ? 0.5 : 1,
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                    }}
                >
                    Next
                </AdminButton>
            </div>
        </div>
    );
};

export default AdminPagination;
