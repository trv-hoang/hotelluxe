import React, { useState } from 'react';
import { Search } from 'lucide-react';
import AdminInput from './AdminInput';
import AdminSelectSimple from './AdminSelectSimple';

interface TableColumn<T> {
    key: keyof T | string;
    title: string;
    render?: (value: unknown, item: T) => React.ReactNode;
    sortable?: boolean;
    width?: string;
}

interface AdminDataTableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    searchPlaceholder?: string;
    searchKey?: keyof T;
    filterOptions?: {
        key: keyof T;
        label: string;
        options: { value: string | number; label: string }[];
    };
    onRowClick?: (item: T) => void;
    loading?: boolean;
    emptyMessage?: string;
}

function AdminDataTable<T extends Record<string, unknown>>({
    data,
    columns,
    searchPlaceholder = "Tìm kiếm...",
    searchKey,
    filterOptions,
    onRowClick,
    loading = false,
    emptyMessage = "Không có dữ liệu"
}: AdminDataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterValue, setFilterValue] = useState<string | number>('all');

    // Filter and search data
    const filteredData = React.useMemo(() => {
        let filtered = data;

        // Apply search
        if (searchTerm && searchKey) {
            filtered = filtered.filter(item =>
                String(item[searchKey]).toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply filter
        if (filterOptions && filterValue !== 'all') {
            filtered = filtered.filter(item => item[filterOptions.key] === filterValue);
        }

        return filtered;
    }, [data, searchTerm, filterValue, searchKey, filterOptions]);

    if (loading) {
        return (
            <div 
                className="rounded-lg shadow-sm p-6"
                style={{ background: 'var(--admin-bg-primary)' }}
            >
                <div className="animate-pulse">
                    <div 
                        className="h-4 rounded w-1/4 mb-4"
                        style={{ backgroundColor: 'var(--admin-bg-secondary)' }}
                    ></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div 
                                key={i} 
                                className="h-4 rounded"
                                style={{ backgroundColor: 'var(--admin-bg-secondary)' }}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-table" style={{ background: 'var(--admin-bg-primary)', borderRadius: '0.75rem', overflow: 'hidden' }}>
            {/* Search and Filter */}
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--admin-border-primary)' }}>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    {/* Search */}
                    {searchKey && (
                        <div className="relative flex-1 max-w-md">
                            <Search 
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" 
                                style={{ color: 'var(--admin-text-secondary)' }}
                            />
                            <AdminInput
                                type="text"
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ paddingLeft: '2.5rem' }}
                            />
                        </div>
                    )}
                    
                    {/* Filter */}
                    {filterOptions && (
                        <div className="min-w-[200px]">
                            <AdminSelectSimple
                                value={String(filterValue)}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterValue(e.target.value)}
                            >
                                <option value="all">Tất cả {filterOptions.label.toLowerCase()}</option>
                                {filterOptions.options.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </AdminSelectSimple>
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full admin-table">
                    <thead style={{ background: 'var(--admin-bg-secondary)' }}>
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                    style={{ 
                                        width: column.width,
                                        color: 'var(--admin-text-primary)',
                                        borderBottom: '1px solid var(--admin-border-primary)'
                                    }}
                                >
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody style={{ background: 'var(--admin-bg-primary)' }}>
                        {filteredData.length === 0 ? (
                            <tr>
                                <td 
                                    colSpan={columns.length} 
                                    className="px-6 py-12 text-center"
                                    style={{ 
                                        color: 'var(--admin-text-secondary)',
                                        borderBottom: '1px solid var(--admin-border-secondary)'
                                    }}
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((item, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    onClick={() => onRowClick?.(item)}
                                    className={`${onRowClick ? 'cursor-pointer' : ''}`}
                                    style={{ 
                                        transition: 'background-color 0.2s ease',
                                        borderBottom: '1px solid var(--admin-border-secondary)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'var(--admin-bg-hover)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'var(--admin-bg-primary)';
                                    }}
                                >
                                    {columns.map((column, colIndex) => (
                                        <td 
                                            key={colIndex} 
                                            className="px-6 py-4 whitespace-nowrap"
                                            style={{ color: 'var(--admin-text-primary)' }}
                                        >
                                            {column.render
                                                ? column.render(item[column.key as keyof T], item)
                                                : String(item[column.key as keyof T] || '-')
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Results count */}
            {filteredData.length > 0 && (
                <div 
                    className="px-6 py-3 text-sm"
                    style={{ 
                        background: 'var(--admin-bg-secondary)', 
                        borderTop: '1px solid var(--admin-border-primary)',
                        color: 'var(--admin-text-secondary)'
                    }}
                >
                    Hiển thị {filteredData.length} / {data.length} kết quả
                </div>
            )}
        </div>
    );
}

export default AdminDataTable;
