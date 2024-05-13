import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import QRCode from 'qrcode.react';
import generate, { Margin } from 'react-to-pdf';

import { ISession, IItem, ILink } from '../../types/interfaces';

export const Book = ({ session }: { session: ISession | null }) => {
    const navigate = useNavigate();

    const { node_id } = useParams();

    const [items, setItems] = useState<IItem[]>([]);
    const [links, setLinks] = useState<ILink[]>([]);
    const [info, setInfo] = useState({ name: ``, author: ``, user_name: `` });

    const [edit, setEdit] = useState({ item_links: [{ name: ``, content: `` }, { name: ``, content: `` }], item_type: ``, item_tags: ``, item_title: ``, item_difficulty: ``, item_qrcode: ``, item_author: ``, item_created_at: ``, item_page: ``, item_subcontent: ``, item_content: ``, item_index: `` });

    const [image, setImage] = useState<File>();
    const [base64, setBase64] = useState<any>();

    const [isSaving, setIsSaving] = useState(false);
    const [isItemSaving, setIsItemSaving] = useState(false);

    const target = useRef(null);

    useEffect(() => {
        (async () => {
            const fetched = await axios({
                method: `GET`,
                url: `https://port-0-book-backend-1ru12mlw1sms1u.sel5.cloudtype.app/api/books/${node_id}`
            });

            if (parseInt(fetched.data?.status) === 200) {
                const { name, author, user_name, items, links } = fetched.data;
                setItems(items);
                setLinks(links);
                setInfo({ name, author, user_name });
            } else navigate(`/`);
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const imageHandler = (e: any) => {
        setImage(e.target?.files?.[0]);

        const reader = new FileReader();
        reader.onloadend = () => setBase64(reader.result);
        reader.readAsDataURL(e.target?.files?.[0]);
    }

    const saveHandler = async (type: string) => {
        setIsSaving(true);
        
        if (type === `sql`) {
            const fetched = await axios({
                method: `GET`,
                url: `https://port-0-book-backend-1ru12mlw1sms1u.sel5.cloudtype.app/api/books/${node_id}/save`
            });

            if (parseInt(fetched.data?.status) !== 200) alert(fetched.data.message);
        } else if (type === `local`) generate(target, { filename: `${info.name}.pdf`, page: { margin: Margin.MEDIUM } });

        setIsSaving(false);
    }

    const saveItemHandler = async () => {
        setIsItemSaving(true);

        const formdata = new FormData();

        Object.keys(edit).forEach((key, idx) => {
            const value = Object.values(edit)[idx];
            if (typeof value === `object`) formdata.set(key, JSON.stringify(value));
            else formdata.set(key, value);
        });

        if (image) formdata.set(`item_image`, image);

        await axios({
            method: `POST`,
            url: `https://port-0-book-backend-1ru12mlw1sms1u.sel5.cloudtype.app/api/books/${node_id}/create`,
            data: formdata
        });

        setIsItemSaving(false);

        navigate(0);
    }

    const removeItemHandler = async (target: number) => {
        await axios({
            method: `GET`,
            url: `https://port-0-book-backend-1ru12mlw1sms1u.sel5.cloudtype.app/api/books/${node_id}/${target}/remove`
        });

        navigate(0);
    }

    const removeBookHandler = async () => {
        await axios({
            method: `GET`,
            url: `https://port-0-book-backend-1ru12mlw1sms1u.sel5.cloudtype.app/api/books/${node_id}/remove`
        });

        navigate(`/books`);
    }

    return (
        <>
            <div className="book-editor">
                <div className="container">
                    <p className="book-editor-author">{info.author} · {info.user_name}</p>
                    <p className="book-editor-name">{info.name}</p>

                    {
                        session &&
                        <div className="book-editor-flex">
                            { isSaving && <div className="global-loader"><svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M12,24A12,12,0,1,1,22.714,6.59a1,1,0,1,1-1.785.9,10,10,0,1,0-.011,9.038,1,1,0,0,1,1.781.908A11.955,11.955,0,0,1,12,24Z"/></svg></div> }
    
                            <button className="global-button mini active" onClick={() => saveHandler(`sql`)}>
                                <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M12,10a4,4,0,1,0,4,4A4,4,0,0,0,12,10Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,16Z"/><path d="M22.536,4.122,19.878,1.464A4.966,4.966,0,0,0,16.343,0H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V7.657A4.966,4.966,0,0,0,22.536,4.122ZM17,2.08V3a3,3,0,0,1-3,3H10A3,3,0,0,1,7,3V2h9.343A2.953,2.953,0,0,1,17,2.08ZM22,19a3,3,0,0,1-3,3H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2V3a5.006,5.006,0,0,0,5,5h4a4.991,4.991,0,0,0,4.962-4.624l2.16,2.16A3.02,3.02,0,0,1,22,7.657Z"/></svg>
                                저장
                            </button>
    
                            <button className="global-button mini" onClick={() => saveHandler(`local`)}>
                                <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="512" height="512"><path d="M17.974,7.146c-.332-.066-.603-.273-.742-.569-1.552-3.271-5.143-5.1-8.735-4.438-3.272,.6-5.837,3.212-6.384,6.501-.162,.971-.15,1.943,.033,2.89,.06,.309-.073,.653-.346,.901-1.145,1.041-1.801,2.524-1.801,4.07,0,3.032,2.467,5.5,5.5,5.5h11c4.136,0,7.5-3.364,7.5-7.5,0-3.565-2.534-6.658-6.026-7.354Zm-1.474,12.854H5.5c-1.93,0-3.5-1.57-3.5-3.5,0-.983,.418-1.928,1.146-2.59,.786-.715,1.155-1.773,.963-2.763-.138-.712-.146-1.445-.024-2.181,.403-2.422,2.365-4.421,4.771-4.862,.385-.07,.768-.104,1.145-.104,2.312,0,4.406,1.289,5.422,3.434,.414,.872,1.2,1.481,2.158,1.673,2.559,.511,4.417,2.778,4.417,5.394,0,3.032-2.467,5.5-5.5,5.5Zm-1.379-6.707c.391,.391,.391,1.023,0,1.414l-2.707,2.707c-.387,.387-.896,.582-1.405,.584l-.009,.002-.009-.002c-.509-.002-1.018-.197-1.405-.584l-2.707-2.707c-.391-.391-.391-1.023,0-1.414s1.023-.391,1.414,0l1.707,1.707v-5c0-.553,.448-1,1-1s1,.447,1,1v5l1.707-1.707c.391-.391,1.023-.391,1.414,0Z"/></svg>
                                로컬 저장
                            </button>
    
                            <button className="global-button mini global-button-warning" onClick={removeBookHandler}>
                                <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24"><path d="m15.707,11.707l-2.293,2.293,2.293,2.293c.391.391.391,1.023,0,1.414-.195.195-.451.293-.707.293s-.512-.098-.707-.293l-2.293-2.293-2.293,2.293c-.195.195-.451.293-.707.293s-.512-.098-.707-.293c-.391-.391-.391-1.023,0-1.414l2.293-2.293-2.293-2.293c-.391-.391-.391-1.023,0-1.414s1.023-.391,1.414,0l2.293,2.293,2.293-2.293c.391-.391,1.023-.391,1.414,0s.391,1.023,0,1.414Zm7.293-6.707c0,.553-.448,1-1,1h-.885l-1.276,13.472c-.245,2.581-2.385,4.528-4.978,4.528h-5.727c-2.589,0-4.729-1.943-4.977-4.521l-1.296-13.479h-.86c-.552,0-1-.447-1-1s.448-1,1-1h4.101c.465-2.279,2.485-4,4.899-4h2c2.414,0,4.435,1.721,4.899,4h4.101c.552,0,1,.447,1,1Zm-14.828-1h7.656c-.413-1.164-1.524-2-2.828-2h-2c-1.304,0-2.415.836-2.828,2Zm10.934,2H4.87l1.278,13.287c.148,1.547,1.432,2.713,2.986,2.713h5.727c1.556,0,2.84-1.168,2.987-2.718l1.258-13.282Z"/></svg>
                                책 삭제
                            </button>
                        </div>
                    }

                    <div className="editor" ref={target}>
                        {
                            items.map(item => 
                                <>
                                    {
                                        session &&
                                        <div className="book-editor-flex">
                                            <button className="global-button mini global-button-warning" onClick={() => removeItemHandler(item.node_id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24"><path d="m15.707,11.707l-2.293,2.293,2.293,2.293c.391.391.391,1.023,0,1.414-.195.195-.451.293-.707.293s-.512-.098-.707-.293l-2.293-2.293-2.293,2.293c-.195.195-.451.293-.707.293s-.512-.098-.707-.293c-.391-.391-.391-1.023,0-1.414l2.293-2.293-2.293-2.293c-.391-.391-.391-1.023,0-1.414s1.023-.391,1.414,0l2.293,2.293,2.293-2.293c.391-.391,1.023-.391,1.414,0s.391,1.023,0,1.414Zm7.293-6.707c0,.553-.448,1-1,1h-.885l-1.276,13.472c-.245,2.581-2.385,4.528-4.978,4.528h-5.727c-2.589,0-4.729-1.943-4.977-4.521l-1.296-13.479h-.86c-.552,0-1-.447-1-1s.448-1,1-1h4.101c.465-2.279,2.485-4,4.899-4h2c2.414,0,4.435,1.721,4.899,4h4.101c.552,0,1,.447,1,1Zm-14.828-1h7.656c-.413-1.164-1.524-2-2.828-2h-2c-1.304,0-2.415.836-2.828,2Zm10.934,2H4.87l1.278,13.287c.148,1.547,1.432,2.713,2.986,2.713h5.727c1.556,0,2.84-1.168,2.987-2.718l1.258-13.282Z"/></svg>
                                                삭제
                                            </button>
                                        </div>
                                    }

                                    <div id={`item${item.node_id}`} className='editor-item' key={item.node_id}>
                                        <div>
                                            <div>
                                                <div className="editor-image-wrap">
                                                    <img src={item.item_image} alt="editor_image" />
                                                </div>

                                                <div className="editor-links">
                                                    <p className="editor-links-title">교과 연계</p>

                                                    {
                                                        links.map((link, idx) => {
                                                            if (link.target === item.node_id) {
                                                                return <div className="editor-link" key={idx}>
                                                                    <p className="editor-link-bookname">{link.link_bookname}</p>
                                                                    <p className="editor-link-content">{link.link_content}</p>
                                                                </div>
                                                            } else return <></>;
                                                        })
                                                    }
                                                </div>
                                            </div>

                                            <div className='editor-wrap'>
                                                <div className="editor-flex2">
                                                    <p className="editor-type">{item.item_type}</p>
                                                    <p className="editor-tags">{item.item_tags}</p>
                                                </div>

                                                <div className="editor-line"></div>

                                                <div className="editor-flex3">
                                                    <div>
                                                        <p className="editor-title">{item.item_title}</p>

                                                        <div className="editor-flex">
                                                            <p className="editor-author">{item.item_author}</p>
                                                            <p className="editor-date">{new Date(item.item_created_at).getFullYear()}-{new Date(item.item_created_at).getMonth() < 10 ? `0${new Date(item.item_created_at).getMonth()}` : new Date(item.item_created_at).getMonth()}-{new Date(item.item_created_at).getDate() < 10 ? `0${new Date(item.item_created_at).getDate()}` : new Date(item.item_created_at).getDate()}</p>
                                                            <p className="editor-page">{item.item_page}쪽</p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="editor-difficulty">
                                                            <span>읽기 난이도</span>
                                                            
                                                            {
                                                                Array(Number(item.item_difficulty)).fill(0).map((_, i1) => 
                                                                    <svg key={i1} xmlns="http://www.w3.org/2000/svg" id="Filled" viewBox="0 0 24 24" width="512" height="512"><path d="M1.327,12.4,4.887,15,3.535,19.187A3.178,3.178,0,0,0,4.719,22.8a3.177,3.177,0,0,0,3.8-.019L12,20.219l3.482,2.559a3.227,3.227,0,0,0,4.983-3.591L19.113,15l3.56-2.6a3.227,3.227,0,0,0-1.9-5.832H16.4L15.073,2.432a3.227,3.227,0,0,0-6.146,0L7.6,6.568H3.231a3.227,3.227,0,0,0-1.9,5.832Z"/></svg>
                                                                )
                                                            }

                                                            {
                                                                Array(3 - Number(item.item_difficulty)).fill(0).map((_, i2) => 
                                                                    <svg key={i2} xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M23.836,8.794a3.179,3.179,0,0,0-3.067-2.226H16.4L15.073,2.432a3.227,3.227,0,0,0-6.146,0L7.6,6.568H3.231a3.227,3.227,0,0,0-1.9,5.832L4.887,15,3.535,19.187A3.178,3.178,0,0,0,4.719,22.8a3.177,3.177,0,0,0,3.8-.019L12,20.219l3.482,2.559a3.227,3.227,0,0,0,4.983-3.591L19.113,15l3.56-2.6A3.177,3.177,0,0,0,23.836,8.794Zm-2.343,1.991-4.144,3.029a1,1,0,0,0-.362,1.116L18.562,19.8a1.227,1.227,0,0,1-1.895,1.365l-4.075-3a1,1,0,0,0-1.184,0l-4.075,3a1.227,1.227,0,0,1-1.9-1.365L7.013,14.93a1,1,0,0,0-.362-1.116L2.507,10.785a1.227,1.227,0,0,1,.724-2.217h5.1a1,1,0,0,0,.952-.694l1.55-4.831a1.227,1.227,0,0,1,2.336,0l1.55,4.831a1,1,0,0,0,.952.694h5.1a1.227,1.227,0,0,1,.724,2.217Z"/></svg>
                                                                )
                                                            }
                                                        </div>

                                                        <p className="editor-qrcode-content">독서 활동 자료 내려받기 ▶</p>
                                                    </div>
                                                </div>

                                                {item.item_subcontent && <p className="editor-subcontent"><svg xmlns="http://www.w3.org/2000/svg" id="Filled" viewBox="0 0 24 24" width="512" height="512"><path d="M1.327,12.4,4.887,15,3.535,19.187A3.178,3.178,0,0,0,4.719,22.8a3.177,3.177,0,0,0,3.8-.019L12,20.219l3.482,2.559a3.227,3.227,0,0,0,4.983-3.591L19.113,15l3.56-2.6a3.227,3.227,0,0,0-1.9-5.832H16.4L15.073,2.432a3.227,3.227,0,0,0-6.146,0L7.6,6.568H3.231a3.227,3.227,0,0,0-1.9,5.832Z"/></svg>{item.item_subcontent}</p>}
                                                <p className="editor-content">{item.item_content}</p>

                                                <div className="editor-index">
                                                    <div className="editor-index-left">
                                                        <p className="editor-index-left-title">목차</p>
                                                    </div>

                                                    <p className="editor-index-content">{item.item_index}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <QRCode value={`http://localhost:3000/books/${item.node_id}`} />
                                    </div>
                                </>
                            )
                        }

                        {
                            session &&
                            <div className='editor-item'>
                                <div>
                                    <div>
                                        <input type="file" id="image" name='item_image' accept="image/*" onChange={imageHandler} hidden />
                                        <label htmlFor="image" className="editor-image-wrap">
                                            { base64 && <img src={base64} alt="preview" /> }
                                        </label>

                                        <div className="editor-links">
                                            <p className="editor-links-title">교과 연계</p>

                                            <div className="editor-link">
                                                <p className="editor-link-bookname"><input type="text" className="global-input mini mini2 global-input-white" placeholder='이름' onChange={e => setEdit({ ...edit, item_links: [{ ...edit.item_links[0], name: e.target.value }, { ...edit.item_links[1] }] })} defaultValue={edit.item_links[0].name} /></p>
                                                <p className="editor-link-content"><input type="text" className="global-input mini mini2 global-input-black" placeholder='내용' onChange={e => setEdit({ ...edit, item_links: [{ ...edit.item_links[0], content: e.target.value }, { ...edit.item_links[1] }] })} defaultValue={edit.item_links[0].content} /></p>
                                            </div>

                                            <div className="editor-link">
                                                <p className="editor-link-bookname"><input type="text" className="global-input mini mini2 global-input-white" placeholder='이름' onChange={e => setEdit({ ...edit, item_links: [{ ...edit.item_links[0] }, { ...edit.item_links[1], name: e.target.value }] })} defaultValue={edit.item_links[1].name} /></p>
                                                <p className="editor-link-content"><input type="text" className="global-input mini mini2 global-input-black" placeholder='내용' onChange={e => setEdit({ ...edit, item_links: [{ ...edit.item_links[0] }, { ...edit.item_links[1], content: e.target.value }] })} defaultValue={edit.item_links[1].content} /></p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='editor-wrap'>
                                        <div className="editor-flex2">
                                            <p className="editor-type"><input type="text" className="global-input mini" placeholder='부제목' onChange={e => setEdit({ ...edit, item_type: e.target.value })} defaultValue={edit.item_type} /></p>
                                            <p className="editor-tags"><input type="text" className="global-input mini" placeholder='태그' onChange={e => setEdit({ ...edit, item_tags: e.target.value })} defaultValue={edit.item_tags} /></p>
                                        </div>

                                        <div className="editor-line"></div>

                                        <div className="editor-flex3">
                                            <div>
                                                <p className="editor-title"><input type="text" className="global-input mini" placeholder='제목' onChange={e => setEdit({ ...edit, item_title: e.target.value })} defaultValue={edit.item_title} /></p>

                                                <div className="editor-flex">
                                                    <p className="editor-author"><input type="text" className="global-input mini mini2" placeholder='이름' onChange={e => setEdit({ ...edit, item_author: e.target.value })} defaultValue={edit.item_author} /></p>
                                                    <p className="editor-date"><input type="date" className="global-input mini" onChange={e => setEdit({ ...edit, item_created_at: e.target.value })} defaultValue={edit.item_created_at} /></p>
                                                    <p className="editor-page"><input type="number" className="global-input mini mini2" placeholder='페이지' onChange={e => setEdit({ ...edit, item_page: e.target.value })} defaultValue={edit.item_page} />쪽</p>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="editor-difficulty">
                                                    <span>읽기 난이도</span>
                                                    
                                                    <svg xmlns="http://www.w3.org/2000/svg" id="Filled" viewBox="0 0 24 24" width="512" height="512"><path d="M1.327,12.4,4.887,15,3.535,19.187A3.178,3.178,0,0,0,4.719,22.8a3.177,3.177,0,0,0,3.8-.019L12,20.219l3.482,2.559a3.227,3.227,0,0,0,4.983-3.591L19.113,15l3.56-2.6a3.227,3.227,0,0,0-1.9-5.832H16.4L15.073,2.432a3.227,3.227,0,0,0-6.146,0L7.6,6.568H3.231a3.227,3.227,0,0,0-1.9,5.832Z"/></svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" id="Filled" viewBox="0 0 24 24" width="512" height="512"><path d="M1.327,12.4,4.887,15,3.535,19.187A3.178,3.178,0,0,0,4.719,22.8a3.177,3.177,0,0,0,3.8-.019L12,20.219l3.482,2.559a3.227,3.227,0,0,0,4.983-3.591L19.113,15l3.56-2.6a3.227,3.227,0,0,0-1.9-5.832H16.4L15.073,2.432a3.227,3.227,0,0,0-6.146,0L7.6,6.568H3.231a3.227,3.227,0,0,0-1.9,5.832Z"/></svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M23.836,8.794a3.179,3.179,0,0,0-3.067-2.226H16.4L15.073,2.432a3.227,3.227,0,0,0-6.146,0L7.6,6.568H3.231a3.227,3.227,0,0,0-1.9,5.832L4.887,15,3.535,19.187A3.178,3.178,0,0,0,4.719,22.8a3.177,3.177,0,0,0,3.8-.019L12,20.219l3.482,2.559a3.227,3.227,0,0,0,4.983-3.591L19.113,15l3.56-2.6A3.177,3.177,0,0,0,23.836,8.794Zm-2.343,1.991-4.144,3.029a1,1,0,0,0-.362,1.116L18.562,19.8a1.227,1.227,0,0,1-1.895,1.365l-4.075-3a1,1,0,0,0-1.184,0l-4.075,3a1.227,1.227,0,0,1-1.9-1.365L7.013,14.93a1,1,0,0,0-.362-1.116L2.507,10.785a1.227,1.227,0,0,1,.724-2.217h5.1a1,1,0,0,0,.952-.694l1.55-4.831a1.227,1.227,0,0,1,2.336,0l1.55,4.831a1,1,0,0,0,.952.694h5.1a1.227,1.227,0,0,1,.724,2.217Z"/></svg>
                                                </div>

                                                <p className="editor-qrcode-content">독서 활동 자료 내려받기 ▶</p>
                                            </div>
                                        </div>

                                        <p className="editor-subcontent">
                                            <svg xmlns="http://www.w3.org/2000/svg" id="Filled" viewBox="0 0 24 24" width="512" height="512"><path d="M1.327,12.4,4.887,15,3.535,19.187A3.178,3.178,0,0,0,4.719,22.8a3.177,3.177,0,0,0,3.8-.019L12,20.219l3.482,2.559a3.227,3.227,0,0,0,4.983-3.591L19.113,15l3.56-2.6a3.227,3.227,0,0,0-1.9-5.832H16.4L15.073,2.432a3.227,3.227,0,0,0-6.146,0L7.6,6.568H3.231a3.227,3.227,0,0,0-1.9,5.832Z"/></svg>
                                            <input type="text" className="global-input mini" placeholder='관련 내용' onChange={e => setEdit({ ...edit, item_subcontent: e.target.value })} defaultValue={edit.item_subcontent} />
                                        </p>
                                        <p className="editor-content"><textarea rows={5} className="global-input mini" placeholder='내용' onChange={e => setEdit({ ...edit, item_content: e.target.value })} defaultValue={edit.item_content}></textarea></p>

                                        <div className="editor-index">
                                            <div className="editor-index-left">
                                                <p className="editor-index-left-title">목차</p>
                                            </div>

                                            <p className="editor-index-content"><textarea className="global-input mini" placeholder='목차' onChange={e => setEdit({ ...edit, item_index: e.target.value })} defaultValue={edit.item_index}></textarea></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                    {
                        session &&
                        <div className="book-editor-flex">
                            { isItemSaving && <div className="global-loader"><svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M12,24A12,12,0,1,1,22.714,6.59a1,1,0,1,1-1.785.9,10,10,0,1,0-.011,9.038,1,1,0,0,1,1.781.908A11.955,11.955,0,0,1,12,24Z"/></svg></div> }
    
                            <button className="global-button mini active" onClick={saveItemHandler}>
                                <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M12,10a4,4,0,1,0,4,4A4,4,0,0,0,12,10Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,16Z"/><path d="M22.536,4.122,19.878,1.464A4.966,4.966,0,0,0,16.343,0H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V7.657A4.966,4.966,0,0,0,22.536,4.122ZM17,2.08V3a3,3,0,0,1-3,3H10A3,3,0,0,1,7,3V2h9.343A2.953,2.953,0,0,1,17,2.08ZM22,19a3,3,0,0,1-3,3H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2V3a5.006,5.006,0,0,0,5,5h4a4.991,4.991,0,0,0,4.962-4.624l2.16,2.16A3.02,3.02,0,0,1,22,7.657Z"/></svg>
                                등록
                            </button>
    
                            <button className="global-button mini" onClick={saveItemHandler}>
                                <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24"><path d="m15.707,11.707l-2.293,2.293,2.293,2.293c.391.391.391,1.023,0,1.414-.195.195-.451.293-.707.293s-.512-.098-.707-.293l-2.293-2.293-2.293,2.293c-.195.195-.451.293-.707.293s-.512-.098-.707-.293c-.391-.391-.391-1.023,0-1.414l2.293-2.293-2.293-2.293c-.391-.391-.391-1.023,0-1.414s1.023-.391,1.414,0l2.293,2.293,2.293-2.293c.391-.391,1.023-.391,1.414,0s.391,1.023,0,1.414Zm7.293-6.707c0,.553-.448,1-1,1h-.885l-1.276,13.472c-.245,2.581-2.385,4.528-4.978,4.528h-5.727c-2.589,0-4.729-1.943-4.977-4.521l-1.296-13.479h-.86c-.552,0-1-.447-1-1s.448-1,1-1h4.101c.465-2.279,2.485-4,4.899-4h2c2.414,0,4.435,1.721,4.899,4h4.101c.552,0,1,.447,1,1Zm-14.828-1h7.656c-.413-1.164-1.524-2-2.828-2h-2c-1.304,0-2.415.836-2.828,2Zm10.934,2H4.87l1.278,13.287c.148,1.547,1.432,2.713,2.986,2.713h5.727c1.556,0,2.84-1.168,2.987-2.718l1.258-13.282Z"/></svg>
                                취소
                            </button>
                        </div>
                    }
                </div>
            </div>
        </>
    );
}

export default Book;