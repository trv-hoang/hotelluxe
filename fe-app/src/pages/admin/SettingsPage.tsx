import React, { useState } from 'react';
import AdminCard from '../../components/admin/AdminCard';
import AdminButton from '../../components/admin/AdminButton';
import AdminInput from '../../components/admin/AdminInput';
import AdminSelect from '../../components/admin/AdminSelect';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const SettingsPage: React.FC = () => {
    const [settings, setSettings] = useState({
        siteName: 'Luxe Hotel',
        siteEmail: 'admin@luxehotel.com',
        currency: 'VND',
        timezone: 'Asia/Ho_Chi_Minh'
    });

    const handleSave = () => {
        // Save settings logic here
        alert('Settings saved successfully!');
    };

    const currencyOptions = [
        { value: 'VND', label: 'Vietnamese Dong (VND)' },
        { value: 'USD', label: 'US Dollar (USD)' },
        { value: 'EUR', label: 'Euro (EUR)' }
    ];

    const timezoneOptions = [
        { value: 'Asia/Ho_Chi_Minh', label: 'Ho Chi Minh City' },
        { value: 'Asia/Bangkok', label: 'Bangkok' },
        { value: 'UTC', label: 'UTC' }
    ];

    return (
        <div>
            <AdminPageHeader
                title="Admin Settings"
                description="Configure your application settings and preferences"
                breadcrumb="Settings"
            >
                <AdminButton variant="primary" onClick={handleSave}>Save Changes</AdminButton>
                <AdminButton variant="secondary">Reset to Default</AdminButton>
                <AdminButton variant="danger">Clear Cache</AdminButton>
            </AdminPageHeader>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <AdminCard
                    title="System Status"
                    value="Online"
                    description="All systems operational"
                    color="#4caf50"
                />
                
                <AdminCard
                    title="Database Size"
                    value="2.4 GB"
                    description="Total database usage"
                    color="#2196f3"
                />
                
                <AdminCard
                    title="Active Sessions"
                    value="42"
                    description="Current user sessions"
                    color="#ff9800"
                />
            </div>
            
            <div className="admin-card" style={{
                borderRadius: 8,
                padding: '2rem',
                marginBottom: '2rem'
            }}>
                <h2 style={{ 
                    margin: '0 0 1.5rem 0', 
                    color: 'var(--admin-text-primary)', 
                    fontSize: 20, 
                    fontWeight: 600 
                }}>General Settings</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <AdminInput
                        label="Site Name"
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                    />
                    
                    <AdminInput
                        label="Admin Email"
                        type="email"
                        value={settings.siteEmail}
                        onChange={(e) => setSettings({...settings, siteEmail: e.target.value})}
                    />
                    
                    <AdminSelect
                        label="Currency"
                        value={settings.currency}
                        onChange={(e) => setSettings({...settings, currency: e.target.value})}
                        options={currencyOptions}
                    />
                    
                    <AdminSelect
                        label="Timezone"
                        value={settings.timezone}
                        onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                        options={timezoneOptions}
                    />
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
