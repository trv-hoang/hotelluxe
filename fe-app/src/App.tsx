import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
// import ProfilePage from './pages/ProfilePage.tsx';
import HomePage from '@/pages/HomePage.tsx';
import Navbar from '@/components/NavBar.tsx';
import BackToTop from '@/components/BackToTop.tsx';
import AdminApp from './AdminApp.tsx';
import AdminAuthProvider from '@/contexts/AdminAuthContext.tsx';
import ProfileUserPage from '@/pages/ProfileUserPage.tsx';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage.tsx';
import { Toaster } from 'react-hot-toast';
import StayPage from '@/pages/StayPage.tsx';

function App() {
    return (
        <AdminAuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Admin routes - sử dụng AdminApp độc lập */}
                    <Route path='/admin/*' element={<AdminApp />} />

                    {/* Client routes */}
                    <Route path='/*' element={<ClientApp />} />
                </Routes>
            </BrowserRouter>
        </AdminAuthProvider>
    );
}

// Component cho client routes
function ClientApp() {
    const location = useLocation();
    const hideNavbar = ['/login', '/register'].includes(location.pathname);

    return (
        <div className='min-h-screen mx-auto'>
            {!hideNavbar && <Navbar />}
            <main className='py-0'>
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/register' element={<RegisterPage />} />
                    <Route path='/profile' element={<ProfileUserPage />} />
                    <Route
                        path='/forgot-password'
                        element={<ForgotPasswordPage />}
                    />
                    <Route path='/stay' element={<StayPage />} />
                </Routes>
            </main>
            <BackToTop />
            <Toaster position='top-center' />
        </div>
    );
}

export default App;
