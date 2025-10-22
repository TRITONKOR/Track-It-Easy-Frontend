import styles from './button.module.scss';

interface ButtonProps {
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    children?: React.ReactNode;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    type = 'button',
    className,
}) => {
    return (
        <button className={`${styles.button} ${className}`} onClick={onClick} type={type}>
            {children}
        </button>
    );
};
