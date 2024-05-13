import React from 'react';
import { Link } from 'react-router-dom';

import { ISession } from '../../types/interfaces';

export const Home = ({ session }: { session: ISession | null }) => {
    return (
        <>
            <div className="visual">
                <p className='visual-title'>:_book_:</p>
                <p className='visual-title2'>Register and take care of your books!</p>
                <p className='visual-title3'>책을 등록하고 관리하세요!</p>

                <div className="visual-buttons">
                    <Link to='/books' className="global-button active">
                        <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="512" height="512"><path d="M24,4c0-2.206-1.794-4-4-4s-4,1.794-4,4c0,1.86,1.277,3.428,3,3.873v.127c0,1.654-1.346,3-3,3H8c-1.125,0-2.164,.374-3,1.002V7.873c1.723-.445,3-2.013,3-3.873C8,1.794,6.206,0,4,0S0,1.794,0,4c0,1.86,1.277,3.428,3,3.873v8.253c-1.723,.445-3,2.013-3,3.873,0,2.206,1.794,4,4,4s4-1.794,4-4c0-1.86-1.277-3.428-3-3.873v-.127c0-1.654,1.346-3,3-3h8c2.757,0,5-2.243,5-5v-.127c1.723-.445,3-2.013,3-3.873ZM2,4c0-1.103,.897-2,2-2s2,.897,2,2-.897,2-2,2-2-.897-2-2ZM6,20c0,1.103-.897,2-2,2s-2-.897-2-2,.897-2,2-2,2,.897,2,2ZM20,6c-1.103,0-2-.897-2-2s.897-2,2-2,2,.897,2,2-.897,2-2,2Z"/></svg>
                        시작하기
                    </Link>

                    <Link to='/introduction' className="global-button">
                        <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24"><path d="m19.5,15h-2.5v-6h2.5c2.481,0,4.5-2.019,4.5-4.5S21.981,0,19.5,0s-4.5,2.019-4.5,4.5v2.5h-6v-2.5C9,2.019,6.981,0,4.5,0S0,2.019,0,4.5s2.019,4.5,4.5,4.5h2.5v6h-2.5c-2.481,0-4.5,2.019-4.5,4.5s2.019,4.5,4.5,4.5,4.5-2.019,4.5-4.5v-2.5h6v2.5c0,2.481,2.019,4.5,4.5,4.5s4.5-2.019,4.5-4.5-2.019-4.5-4.5-4.5Zm-2.5-10.5c0-1.378,1.121-2.5,2.5-2.5s2.5,1.122,2.5,2.5-1.121,2.5-2.5,2.5h-2.5v-2.5Zm-12.5,2.5c-1.379,0-2.5-1.122-2.5-2.5s1.121-2.5,2.5-2.5,2.5,1.122,2.5,2.5v2.5h-2.5Zm2.5,12.5c0,1.378-1.121,2.5-2.5,2.5s-2.5-1.122-2.5-2.5,1.121-2.5,2.5-2.5h2.5v2.5Zm2-4.5v-6h6v6h-6Zm10.5,7c-1.379,0-2.5-1.122-2.5-2.5v-2.5h2.5c1.379,0,2.5,1.122,2.5,2.5s-1.121,2.5-2.5,2.5Z"/></svg>
                        소개
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Home;