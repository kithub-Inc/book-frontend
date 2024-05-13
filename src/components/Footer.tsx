import React from 'react';

import { ISession } from '../../types/interfaces';

export const Footer = ({ session }: { session: ISession | null }) => {
    return (
        <>
            <div className='footer'>
                <div className="container">
                    <p className="footer-text">:_book_:</p>
                    <p className="footer-text">CopyRight (c) Reserved By ICe1</p>
                </div>
            </div>
        </>
    );
}

export default Footer;