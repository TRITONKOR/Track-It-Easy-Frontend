import { useState } from 'react';
import styles from './input.module.scss';

interface InputProps {
    className?: string;
    label?: string;
    value?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    isRequired?: boolean;
    validate?: (value: string) => string | null;
}

export const Input: React.FC<InputProps> = ({
    value,
    onChange,
    placeholder,
    type = 'text',
    className,
    isRequired,
    label,
    validate,
}) => {
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e);
        if (validate) {
            setError(validate(e.target.value));
        }
    };

    return (
        <div>
            {label && <label className={styles.label}>{label}</label>}
            <input
                className={`${styles.input} ${className}`}
                type={type}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                required={isRequired}
            />
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
};
