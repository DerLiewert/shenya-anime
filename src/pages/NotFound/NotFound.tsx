import React from 'react';
import emptyIcon from '@/assets/empty.png';

import './NotFound.scss'

function NotFound() {
  return (
    <section className="not-found">
      <div className="container">
        <div className="not-found__inner">
            <img src={emptyIcon} alt="Not Found Icon" aria-hidden/>
            <h2 className="not-found__title title">Not Found Page</h2>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
