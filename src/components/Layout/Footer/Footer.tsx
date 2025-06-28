import React from 'react';
import './Footer.scss';

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer__text">
          ©{currentYear === 2025 ? currentYear : `2025 - ${currentYear}`} ShenyaAnime | Powered by <a className="footer__link" href="https://jikan.moe/" target='_blank'  rel="noopener noreferrer">Jikan API</a>
        </p>
        <p className="footer__text">
          Develeoped by{' '}
          <a className="footer__link footer__link--primary"  href="https://github.com/DerLiewert" target='_blank'  rel="noopener noreferrer">
            DerLiewert
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
