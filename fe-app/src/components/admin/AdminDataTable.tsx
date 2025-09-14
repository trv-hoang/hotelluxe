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
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Search and Filter */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    {/* Search */}
                    {searchKey && (
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
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
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    style={{ width: column.width }}
                                >
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((item, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    onClick={() => onRowClick?.(item)}
                                    className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                                >
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
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
                <div className="px-6 py-3 bg-gray-50 border-t text-sm text-gray-600">
                    Hiển thị {filteredData.length} / {data.length} kết quả
                </div>
            )}
        </div>
    );
}

export default AdminDataTable;
