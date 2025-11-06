import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../../components/ui/Button/Button';
import { useAuth } from '../../../context/AuthContext';

const PanelSwitch: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    if (!user || user.role !== 'admin') {
        return null;
    }

    const isAdminPanel = window.location.pathname.startsWith('/admin');

    const handleSwitch = () => {
        navigate(isAdminPanel ? '/' : '/admin');
    };

    return (
        <Button onClick={handleSwitch}>
            {isAdminPanel ? 'Перейти до панелі користувача' : ' Перейти до адмін-панель'}
        </Button>
    );
};

export default PanelSwitch;
