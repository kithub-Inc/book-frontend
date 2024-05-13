import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { IBook, IItem } from '../../types/interfaces';

export const BookComponent = ({ book }: { book: IBook }) => {
    const navigate = useNavigate();

    const [items, setItems] = useState<IItem[]>([]);

    useEffect(() => {
        (async () => {
            const fetched = await axios({
                method: `GET`,
                url: `https://port-0-book-backend-1ru12mlw1sms1u.sel5.cloudtype.app/api/books/${book.node_id}`
            });

            if (parseInt(fetched.data?.status) === 200) setItems(fetched.data.items);
            else navigate(`/`);
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="books-item" onClick={() => navigate(`/books/${book.node_id}`)}>
                <div className="books-preview">
                    <div className="books-subitem" key={items[0]?.node_id}>
                        <p className='books-sub-tags'>{items[0]?.item_tags?.substring(0, 15)}...</p>

                        <div className='books-sub-flex'>
                            <div className='books-sub-flex2'>
                                <p className='books-sub-created_at'>{new Date(items[0]?.item_created_at).getMonth()}. {new Date(items[0]?.item_created_at).getDate()}.</p>
                                <p className='books-sub-author'>{items[0]?.item_author}</p>
                            </div>

                            <p className='books-sub-difficulty'>
                                {
                                    Array(Number(items[0]?.item_difficulty || 0)).fill(0).map((_, i1) => 
                                        <svg key={i1} xmlns="http://www.w3.org/2000/svg" id="Filled" viewBox="0 0 24 24" width="512" height="512"><path d="M1.327,12.4,4.887,15,3.535,19.187A3.178,3.178,0,0,0,4.719,22.8a3.177,3.177,0,0,0,3.8-.019L12,20.219l3.482,2.559a3.227,3.227,0,0,0,4.983-3.591L19.113,15l3.56-2.6a3.227,3.227,0,0,0-1.9-5.832H16.4L15.073,2.432a3.227,3.227,0,0,0-6.146,0L7.6,6.568H3.231a3.227,3.227,0,0,0-1.9,5.832Z"/></svg>
                                    )
                                }

                                {
                                    Array(3 - Number(items[0]?.item_difficulty || 0)).fill(0).map((_, i2) => 
                                        <svg key={i2} xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M23.836,8.794a3.179,3.179,0,0,0-3.067-2.226H16.4L15.073,2.432a3.227,3.227,0,0,0-6.146,0L7.6,6.568H3.231a3.227,3.227,0,0,0-1.9,5.832L4.887,15,3.535,19.187A3.178,3.178,0,0,0,4.719,22.8a3.177,3.177,0,0,0,3.8-.019L12,20.219l3.482,2.559a3.227,3.227,0,0,0,4.983-3.591L19.113,15l3.56-2.6A3.177,3.177,0,0,0,23.836,8.794Zm-2.343,1.991-4.144,3.029a1,1,0,0,0-.362,1.116L18.562,19.8a1.227,1.227,0,0,1-1.895,1.365l-4.075-3a1,1,0,0,0-1.184,0l-4.075,3a1.227,1.227,0,0,1-1.9-1.365L7.013,14.93a1,1,0,0,0-.362-1.116L2.507,10.785a1.227,1.227,0,0,1,.724-2.217h5.1a1,1,0,0,0,.952-.694l1.55-4.831a1.227,1.227,0,0,1,2.336,0l1.55,4.831a1,1,0,0,0,.952.694h5.1a1.227,1.227,0,0,1,.724,2.217Z"/></svg>
                                    )
                                }
                            </p>
                        </div>

                        <p className='books-sub-title'>{items[0]?.item_title?.substring(0, 15)}...</p>
                        <p className='books-sub-content'>{items[0]?.item_content?.substring(0, 20)}...</p>
                    </div>
                </div>

                <div className="books-content">
                    <p className="books-name">{book.book_name}</p>
                    <p className="books-author">{book.user_name}</p>
                </div>
            </div>
        </>
    );
}

export default BookComponent;