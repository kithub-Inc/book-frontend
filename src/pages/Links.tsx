import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { ILink, ISession } from '../../types/interfaces';

export const Links = ({ session }: { session: ISession | null }) => {
    const navigate = useNavigate();

    const [links, setLinks] = useState<ILink[]>([]);

    useEffect(() => {
        (async () => {
            const fetched = await axios({
                method: `GET`,
                url: `https://port-0-book-backend-1ru12mlw1sms1u.sel5.cloudtype.app/api/links`
            });

            if (parseInt(fetched.data?.status) === 200) setLinks(fetched.data.links);
            else navigate(`/`);
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="links">
                <div className="container">
                    <p className="links-subtitle">🔗 LINKS</p>
                    <p className="links-title">교과 연계</p>

                    <div className="links-items">
                        {
                            links.map((link, idx) => 
                                <div className="links-item" onClick={() => navigate(`/books/${link.node_id}#item${link.target}`)} key={idx}>
                                    <div className="links-flex">
                                        <p className="links-author">{link.user_name}</p>
                                        <p className="links-name">{link.book_name}</p>
                                    </div>

                                    <p className="links-bookname">{link.link_bookname}</p>
                                    <p className="links-content">{link.link_content}</p>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default Links;