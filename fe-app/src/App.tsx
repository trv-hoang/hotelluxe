import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import HomePage from '@/pages/HomePage.tsx';
import Navbar from '@/components/NavBar.tsx';
import BackToTop from '@/components/BackToTop.tsx';                                                                   import AdminDashboardPage from "./pages/admin/AdminDashboardPage.tsx";
import UsersPage from "./pages/admin/UsersPage.tsx";
import BookingsPage from "./pages/admin/BookingsPage.tsx";
import SettingsPage from "./pages/admin/SettingsPage.tsx";




function App() {
    const isAdminRoute = location.pathname.startsWith('/admin');
    const hideNavbar = ['/login', '/register'].includes(location.pathname) || isAdminRoute;

    return (
        <BrowserRouter>
            <div className='min-h-screen mx-auto '>
                {!hideNavbar && <Navbar />}
                <main className={isAdminRoute ? '' : 'py-12'}>
                    <Routes>
                        <Route path='/' element={<HomePage />} />
                        <Route path='/login' element={<LoginPage />} />
                        <Route path='/register' element={<RegisterPage />} />
                        <Route path='/profile' element={<ProfilePage />} />
                        <Route path='/admin/dashboard' element={<AdminDashboardPage />} />
                        <Route path='/admin/users' element={<UsersPage />} />
                        <Route path='/admin/bookings' element={<BookingsPage />} />
                        <Route path='/admin/settings' element={<SettingsPage />} />
                    </Routes>
                </main>
                <BackToTop />
            </div>
        </BrowserRouter>
    );
}

export default App;
