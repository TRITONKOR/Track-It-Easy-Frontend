import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../context/AuthContext';
import styles from './headerProfile.module.scss';

interface HeaderProfileProps {
    user: {
        id: string;
        username: string;
        email: string;
    };
}

export const HeaderProfile: React.FC<HeaderProfileProps> = ({ user }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const { logout } = useAuth();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleAPI = async () => {
        try {
            navigate('/api');
        } catch (error) {
            console.error('Error navigating to api page:', error);
        }
    };

    const handleLogout = async () => {
        try {
            logout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleFollowedParcels = () => {
        navigate('/followed-parcels');
        setIsDropdownOpen(false);
    };

    return (
        <div className={styles['header-profile-container']} ref={dropdownRef}>
            <div className={styles['profile-trigger']} onClick={toggleDropdown}>
                <div className={styles['header-profile-icon']}>
                    <img src="./user.png" alt="User Icon" />
                </div>
                <span className={styles['header-profile-name']}>
                    <span>{user.username}</span>
                </span>
            </div>

            <div
                className={`${styles['profile-dropdown']} ${isDropdownOpen ? styles['open'] : ''}`}
            >
                <div className={styles['dropdown-item']} onClick={handleFollowedParcels}>
                    Відстежувані посилки
                </div>
                <div className={styles['dropdown-item']} onClick={handleAPI}>
                    Для розробників
                </div>
                <div className={styles['dropdown-item']} onClick={handleLogout}>
                    Вийти з акаунту
                </div>
            </div>
        </div>
    );
};
