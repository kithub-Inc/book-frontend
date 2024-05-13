import React from 'react';
import { Link } from 'react-router-dom';

import { ISession } from '../../types/interfaces';

export const Header = ({ session }: { session: ISession | null }) => {
    return (
        <>
            <div className='header'>
                <div className="container">
                    <div className="header-items">
                        <div className="header-item"><Link to='/'>:_book_:</Link></div>
                        <div className="header-item"><Link to='/'>홈</Link></div>
                        <div className="header-item"><Link to='/introduction'>소개</Link></div>
                        <div className="header-item"><Link to='/books'>책들</Link></div>
                        <div className="header-item"><Link to='/links'>교과 연계</Link></div>
                    </div>

                    <div className="header-items">
                        {
                            session ?
                            <>
                                <div className="header-item"><Link to='/'>{session.user_name}</Link></div>
                                <div className="header-item"><Link to='/logout'>로그아웃</Link></div>
                            </>
                            :
                            <>
                                <div className="header-item"><Link to='/login'>로그인</Link></div>
                                <div className="header-item"><Link to='/signup'>회원가입</Link></div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;