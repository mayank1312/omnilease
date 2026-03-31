import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.left}>
          <span className={styles.logo}>OmniLease</span>
          <p>© {currentYear} All rights reserved</p>
        </div>
        
        <div className={styles.right}>
          <p>Built with <span className={styles.stack}>MERN Stack</span></p>
          <p className={styles.author}>Designed by <span>Mayank Dhingra</span></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;