import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button/Button';
import { useAuth } from '../../context/AuthContext';
import PanelSwitch from '../AdminPanel/PanelSwitch/PanelSwitch';
import styles from './header.module.scss';
import { HeaderProfile } from './HeaderProfile/HeaderProfile';

export const Header: React.FC = () => {
    const { isAuthenticated, loading, user } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return null;
    }

    return (
        <header className={styles['header']}>
            <div className={styles['header-container']}>
                <div className={styles['logo']}>
                    <img onClick={() => navigate('/')} width="250px" alt="logo" src="/logov2.png" />
                </div>
                <div className={styles['user-container']}>
                    <div className={styles['admin-panel']}>
                        <PanelSwitch />
                    </div>
                    <div className={styles['profile']}>
                        {isAuthenticated && user ? (
                            <HeaderProfile user={user} />
                        ) : (
                            <div className={styles['auth-buttons']}>
                                <Button
                                    className={styles['login-button']}
                                    onClick={() => navigate('/login')}
                                >
                                    Увійти
                                </Button>
                                <Button
                                    className={styles['register-button']}
                                    onClick={() => navigate('/register')}
                                >
                                    Зареєструватися
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
