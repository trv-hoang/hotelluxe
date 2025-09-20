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
import VerifyOTPPage from '@/pages/VerifyOTPPage.tsx';
import ResetPasswordPage from '@/pages/ResetPasswordPage.tsx';
import { Toaster } from 'react-hot-toast';
import StayPage from '@/pages/StayPage.tsx';
import Footer from '@/components/Footer.tsx';
import ScrollToTop from '@/hooks/ScrollToTop.ts';
import StayDetailPage from '@/pages/StayDetail.tsx';
import CartPage from '@/pages/CartPage.tsx';
import ErrorPage from '@/pages/ErrorPage.tsx';
import AboutPage from '@/pages/admin/AboutPage.tsx';
import MyBookingPage from '@/pages/MyBookingPage.tsx';

function App() {
    return (
        <AdminAuthProvider>
            <BrowserRouter>
                <ScrollToTop />
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
    const hideNavbar = [
        '/login',
        '/register',
        '/reset-password',
        '/verify-otp',
    ].some(
        (path) =>
            location.pathname === path ||
            location.pathname.startsWith('/reset-password/') ||
            location.pathname.startsWith('/verify-otp'),
    );

    return (
        <div className='min-h-screen mx-auto'>
            {!hideNavbar && <Navbar />}
            <main className='py-0'>
                <Routes>
                    {/* Client routes */}
                    <Route path='/' element={<HomePage />} />
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/register' element={<RegisterPage />} />
                    <Route path='/profile' element={<ProfileUserPage />} />
                    <Route path='/my-bookings' element={<MyBookingPage />} />
                    <Route
                        path='/forgot-password'
                        element={<ForgotPasswordPage />}
                    />
                    <Route path='/verify-otp' element={<VerifyOTPPage />} />
                    <Route
                        path='/reset-password/:token'
                        element={<ResetPasswordPage />}
                    />
                    <Route
                        path='/reset-password'
                        element={<ResetPasswordPage />}
                    />
                    <Route path='/hotels' element={<StayPage />} />
                    <Route path='/hotels/:id' element={<StayDetailPage />} />
                    <Route
                        path='/test/:id'
                        element={
                            <div
                                style={{ padding: '50px', textAlign: 'center' }}
                            >
                                <h1>Test Route Works!</h1>
                                <p>
                                    ID:{' '}
                                    {window.location.pathname.split('/').pop()}
                                </p>
                            </div>
                        }
                    />
                    <Route path='/cart' element={<CartPage />} />
                    <Route path='/error' element={<ErrorPage />} />
                    <Route path='/about' element={<AboutPage />} />
                </Routes>
            </main>
            <footer className='mx-auto sx:px-0 p-4 sm:max-x-xl md:max-w-7xl lg:max-w-7xl xl:min-w-[1480px]'>
                <Footer />
            </footer>
            <BackToTop />
            <Toaster position='top-center' />
        </div>
    );
}

export default App;
