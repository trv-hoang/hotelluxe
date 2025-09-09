import React from 'react';

export interface TableColumn {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface AdminTableProps {
    columns: TableColumn[];
    data: Record<string, unknown>[];
    onSort?: (key: string) => void;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    loading?: boolean;
    emptyMessage?: string;
    selectable?: boolean;
    selectedRows?: Record<string, unknown>[];
    onSelectRow?: (row: Record<string, unknown>) => void;
    onSelectAll?: (selected: boolean) => void;
}

const AdminTable: React.FC<AdminTableProps> = ({
    columns,
    data,
    onSort,
    sortBy,
    sortOrder,
    loading = false,
    emptyMessage = 'No data found.',
    selectable = false,
    selectedRows = [],
    onSelectRow,
    onSelectAll
}) => {
    const handleSort = (key: string) => {
        if (onSort) {
            onSort(key);
        }
    };

    const isSelected = (row: Record<string, unknown>) => {
        return selectedRows.some(selected => selected.id === row.id);
    };

    const isAllSelected = data.length > 0 && selectedRows.length === data.length;

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse', 
                marginTop: '1rem', 
                minWidth: '600px',
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <thead>
                    <tr style={{ background: '#f8fafc' }}>
                        {selectable && (
                            <th style={{ 
                                borderBottom: '1px solid #e2e8f0', 
                                textAlign: 'left', 
                                padding: '12px',
                                width: '50px'
                            }}>
                                <input 
                                    type='checkbox' 
                                    className='custom-checkbox'
                                    checked={isAllSelected}
                                    onChange={(e) => onSelectAll?.(e.target.checked)}
                                />
                            </th>
                        )}
                        {columns.map(column => (
                            <th 
                                key={column.key}
                                style={{ 
                                    borderBottom: '1px solid #e2e8f0', 
                                    textAlign: 'left', 
                                    padding: '12px',
                                    fontWeight: 600,
                                    color: '#374151',
                                    cursor: column.sortable ? 'pointer' : 'default',
                                    userSelect: 'none'
                                }}
                                onClick={() => column.sortable && handleSort(column.key)}
                            >
                                {column.label}
                                {column.sortable && sortBy === column.key && (
                                    <span style={{ marginLeft: '4px' }}>
                                        {sortOrder === 'asc' ? '▲' : '▼'}
                                    </span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td 
                                colSpan={columns.length + (selectable ? 1 : 0)} 
                                style={{ 
                                    textAlign: 'center', 
                                    padding: '2rem',
                                    color: '#6b7280'
                                }}
                            >
                                Loading...
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td 
                                colSpan={columns.length + (selectable ? 1 : 0)} 
                                style={{ 
                                    textAlign: 'center', 
                                    padding: '2rem',
                                    color: '#6b7280'
                                }}
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, index) => (
                            <tr 
                                key={String(row.id) || index}
                                style={{
                                    borderBottom: '1px solid #f1f5f9',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#f8fafc';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                {selectable && (
                                    <td style={{ padding: '12px' }}>
                                        <input 
                                            type='checkbox' 
                                            className='custom-checkbox'
                                            checked={isSelected(row)}
                                            onChange={() => onSelectRow?.(row)}
                                        />
                                    </td>
                                )}
                                {columns.map(column => (
                                    <td 
                                        key={column.key}
                                        style={{ 
                                            padding: '12px',
                                            color: '#374151',
                                            borderBottom: '1px solid #f1f5f9'
                                        }}
                                    >
                                        {column.render 
                                            ? column.render(row[column.key], row)
                                            : String(row[column.key] ?? '')
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminTable;
