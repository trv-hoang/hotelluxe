import React from 'react';
import AdminButton from './AdminButton';

interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'date';
    placeholder?: string;
    required?: boolean;
    options?: { value: string | number; label: string }[];
    rows?: number; // for textarea
    validation?: (value: string | number) => string | null;
}

interface AdminFormProps {
    title?: string;
    fields: FormField[];
    data: Record<string, string | number>;
    onChange: (name: string, value: string | number) => void;
    onSubmit: () => void;
    onCancel: () => void;
    submitLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
    mode?: 'create' | 'edit' | 'view';
    errors?: Record<string, string>;
}

const AdminForm: React.FC<AdminFormProps> = ({
    title,
    fields,
    data,
    onChange,
    onSubmit,
    onCancel,
    submitLabel = 'Lưu',
    cancelLabel = 'Hủy',
    isLoading = false,
    mode = 'create',
    errors = {}
}) => {
    const isViewMode = mode === 'view';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isViewMode) {
            onSubmit();
        }
    };

    const renderField = (field: FormField) => {
        const value = data[field.name] || '';
        const error = errors[field.name];
        const commonProps = {
            disabled: isViewMode || isLoading,
            required: field.required && !isViewMode
        };

        switch (field.type) {
            case 'textarea':
                return (
                    <div key={field.name}>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--admin-text-primary)' }}>
                            {field.label}
                            {field.required && !isViewMode && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
                        </label>
                        <textarea
                            value={value}
                            onChange={(e) => onChange(field.name, e.target.value)}
                            placeholder={field.placeholder}
                            rows={field.rows || 3}
                            className="admin-input w-full px-3 py-2"
                            style={{
                                border: error ? '2px solid #ef4444' : '1px solid var(--admin-border-primary)',
                                minHeight: `${(field.rows || 3) * 1.5}rem`
                            }}
                            {...commonProps}
                        />
                        {error && (
                            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                                {error}
                            </p>
                        )}
                    </div>
                );

            case 'select':
                return (
                    <div key={field.name}>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--admin-text-primary)' }}>
                            {field.label}
                            {field.required && !isViewMode && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
                        </label>
                        <select
                            value={value}
                            onChange={(e) => onChange(field.name, e.target.value)}
                            className="admin-input w-full px-3 py-2"
                            style={{
                                border: error ? '2px solid #ef4444' : '1px solid var(--admin-border-primary)'
                            }}
                            {...commonProps}
                        >
                            <option value="">Chọn {field.label.toLowerCase()}</option>
                            {field.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {error && (
                            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                                {error}
                            </p>
                        )}
                    </div>
                );

            default:
                return (
                    <div key={field.name}>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--admin-text-primary)' }}>
                            {field.label}
                            {field.required && !isViewMode && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
                        </label>
                        <input
                            type={field.type}
                            value={value}
                            onChange={(e) => onChange(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                            placeholder={field.placeholder}
                            className="admin-input w-full px-3 py-2"
                            style={{
                                border: error ? '2px solid #ef4444' : '1px solid var(--admin-border-primary)'
                            }}
                            {...commonProps}
                        />
                        {error && (
                            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                                {error}
                            </p>
                        )}
                    </div>
                );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {title && (
                <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--admin-text-primary)' }}>
                    {title}
                </h3>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map(renderField)}
            </div>

            {!isViewMode && (
                <div className="flex justify-end space-x-3 pt-4 border-t" style={{ borderColor: 'var(--admin-border-primary)' }}>
                    <AdminButton
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </AdminButton>
                    <AdminButton
                        type="submit"
                        variant="primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang xử lý...' : submitLabel}
                    </AdminButton>
                </div>
            )}

            {isViewMode && (
                <div className="flex justify-end pt-4 border-t" style={{ borderColor: 'var(--admin-border-primary)' }}>
                    <AdminButton
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                    >
                        Đóng
                    </AdminButton>
                </div>
            )}
        </form>
    );
};

export default AdminForm;
