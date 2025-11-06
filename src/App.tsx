import { Route, BrowserRouter as Router, Routes } from 'react-router';
import Footer from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { AuthProvider } from './context/AuthContext';
import { AdminPage } from './pages/AdminPage/AdminPage';
import ApiPage from './pages/ApiPage/ApiPage';
import { FollowedParcelsPage } from './pages/FollowedParcelsPage/FollowedParcelsPage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { MainPage } from './pages/MainPage/MainPage';
import { RegisterPage } from './pages/RegisterPage/RegisterPage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import './styles/app.scss';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="app-container">
                    <div className="app-header">
                        <Header />
                    </div>
                    <div className="app">
                        <Routes>
                            <Route path="*" element={<div>404 Not Found</div>} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route element={<ProtectedRoute adminOnly />}>
                                <Route path="/admin" element={<AdminPage />} />
                            </Route>
                            <Route path="/" element={<MainPage />} />
                            <Route path="/followed-parcels" element={<FollowedParcelsPage />} />
                            <Route path="/api" element={<ApiPage />} />
                        </Routes>
                    </div>
                    <div className="app-footer">
                        <Footer />
                    </div>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
