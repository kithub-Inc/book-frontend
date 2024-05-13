import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import BookComponent from '../components/Book';

import { ISession, IBook } from '../../types/interfaces';

export const Books = ({ session }: { session: ISession | null }) => {
    const navigate = useNavigate();

    const [books, setBooks] = useState<IBook[]>([]);

    useEffect(() => {
        (async () => {
            const fetched = await axios({
                method: `GET`,
                url: `https://port-0-book-backend-1ru12mlw1sms1u.sel5.cloudtype.app/api/books`
            });

            if (parseInt(fetched.data?.status) === 200) setBooks(fetched.data.books);
            else navigate(`/`);
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="books">
                <div className="container">
                    <p className="books-subtitle">💼 BOOKS</p>
                    <p className="books-title">책들</p>

                    <div className="books-items">
                        {books.map(book => <BookComponent key={book.node_id} book={book} />)}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Books;