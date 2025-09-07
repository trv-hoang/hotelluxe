import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import HomePage from '@/pages/HomePage.tsx';
import Navbar from '@/components/NavBar.tsx';
import BackToTop from '@/components/BackToTop.tsx';
function App() {
    const hideNavbar = ['/login', '/register'].includes(location.pathname);
    return (
        <BrowserRouter>
            <div className='min-h-screen mx-auto '>
                {!hideNavbar && <Navbar />}
                <main className='py-12'>
                    <Routes>
                        <Route path='/' element={<HomePage />} />
                        <Route path='/login' element={<LoginPage />} />
                        <Route path='/register' element={<RegisterPage />} />
                        <Route path='/profile' element={<ProfilePage />} />
                    </Routes>
                </main>
                <BackToTop />
            </div>
        </BrowserRouter>
    );
}

export default App;
