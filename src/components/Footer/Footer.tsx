import React from 'react';
import styles from './footer.module.scss';

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <span className={styles.logo}>Track It Easy</span>
                <span className={styles.copyright}>
                    &copy; {new Date().getFullYear()} Track It Easy. All rights reserved.
                </span>
                <nav className={styles.links}>
                    <a href="/" className={styles.link}>
                        Головна
                    </a>
                    <a href="/api" className={styles.link}>
                        Для розробників
                    </a>
                </nav>
                <div className={styles.contacts}>
                    <span>Контакти:</span>
                    <a href="mailto:trackiteasymain@gmail.com" className={styles.contactLink}>
                        trackiteasymain@gmail.com
                    </a>
                    <a
                        href="https://github.com/TRITONKOR/Track-It-Easy-Backend"
                        className={styles.contactLink}
                    >
                        Репозиторій на GitHub
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
