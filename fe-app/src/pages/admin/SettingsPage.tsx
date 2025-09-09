import React, { useState } from 'react';
import AdminCard from '../../components/admin/AdminCard';
import AdminButton from '../../components/admin/AdminButton';
import AdminInput from '../../components/admin/AdminInput';
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
                    icon="🟢"
                />
                
                <AdminCard
                    title="Database Size"
                    value="2.4 GB"
                    description="Total database usage"
                    color="#2196f3"
                    icon="💾"
                />
                
                <AdminCard
                    title="Active Sessions"
                    value="42"
                    description="Current user sessions"
                    color="#ff9800"
                    icon="👤"
                />
            </div>
            
            <div style={{
                background: '#fff',
                borderRadius: 8,
                padding: '2rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                marginBottom: '2rem'
            }}>
                <h2 style={{ margin: '0 0 1.5rem 0', color: '#222', fontSize: 20, fontWeight: 600 }}>General Settings</h2>
                
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
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>Currency:</label>
                        <select 
                            value={settings.currency}
                            onChange={(e) => setSettings({...settings, currency: e.target.value})}
                            style={{ 
                                width: '100%', 
                                padding: '0.75rem', 
                                borderRadius: '6px', 
                                border: '1px solid #d1d5db', 
                                background: '#fff', 
                                color: '#374151',
                                fontSize: '14px'
                            }}
                        >
                            <option value="VND">Vietnamese Dong (VND)</option>
                            <option value="USD">US Dollar (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                        </select>
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>Timezone:</label>
                        <select 
                            value={settings.timezone}
                            onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                            style={{ 
                                width: '100%', 
                                padding: '0.75rem', 
                                borderRadius: '6px', 
                                border: '1px solid #d1d5db', 
                                background: '#fff', 
                                color: '#374151',
                                fontSize: '14px'
                            }}
                        >
                            <option value="Asia/Ho_Chi_Minh">Ho Chi Minh City</option>
                            <option value="Asia/Bangkok">Bangkok</option>
                            <option value="UTC">UTC</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
