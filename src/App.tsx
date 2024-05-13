import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';

import Home from './pages/Home';
import Introduction from './pages/Introduction';
import Books from './pages/Books';
import Book from './pages/Book';
import Links from './pages/Links';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Logout from './pages/Logout';

import Header from './components/Header';
import Footer from './components/Footer';

import { ISession } from '../types/interfaces';

export const App = () => {
    const cookies = new Cookies();

    const [session, setSession] = useState<ISession | null>(null);

    useEffect(() => {
        if (cookies.get(`:__tkn`)) {
            (async () => {
                const fetched = await axios({
                    method: `POST`,
                    url: `https://port-0-book-backend-1ru12mlw1sms1u.sel5.cloudtype.app/api/oauth/token`,
                    data: { token: cookies.get(`:__tkn`) }
                });
            
                if (parseInt(fetched.data?.status) === 200) {
                    const { user_id, user_name } = fetched.data;
                    setSession({ user_id, user_name });
                } else cookies.remove(`:__tkn`);
            })();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Header session={session} />

            <Routes>
                <Route path='/' Component={() => <Home session={session} />} />
                <Route path='/introduction' Component={() => <Introduction session={session} />} />
                <Route path='/books' Component={() => <Books session={session} />} />
                <Route path='/books/:node_id' Component={() => <Book session={session} />} />
                <Route path='/links' Component={() => <Links session={session} />} />

                <Route path='/login' Component={() => <Login session={session} />} />
                <Route path='/signup' Component={() => <Signup session={session} />} />
                <Route path='/logout' Component={() => <Logout session={session} />} />
            </Routes>

            <Footer session={session} />
        </>
    );
}

export default App;