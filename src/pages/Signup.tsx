import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { ISession } from '../../types/interfaces';

export const Signup = ({ session }: { session: ISession | null }) => {
    const navigate = useNavigate();

    const [id, setId] = useState(``);
    const [name, setName] = useState(``);
    const [password, setPassword] = useState(``);
    const [repassword, setRePassword] = useState(``);

    const [vaildId, setVaildId] = useState(false);
    const [vaildName, setVaildName] = useState(false);
    const [vaildPassword, setVaildPassword] = useState(false);
    const [vaildRepassword, setVaildRePassword] = useState(false);

    const [errtext, setErrtext] = useState(``);

    const submitHandler = async () => {
        if (!/^(?=.*[a-z].*)(?=.*[0-9].*)[a-z0-9]+$/.test(id) && id.length <= 20) {
            setVaildId(false);
            setTimeout(() => setVaildId(true));
            return;
        } else setVaildId(false);

        if (!/^[ㄱ-힣]+$/.test(name) && name.length <= 10) {
            setVaildName(false);
            setTimeout(() => setVaildName(true));
            return;
        } else setVaildName(false);

        if (!/^(.+){8}$/.test(password)) {
            setVaildPassword(false);
            setTimeout(() => setVaildPassword(true));
            return;
        } else setVaildPassword(false);

        if (password !== repassword) {
            setVaildRePassword(false);
            setTimeout(() => setVaildRePassword(true));
            return;
        } else setVaildRePassword(false);

        const fetched = await axios({
            method: `POST`,
            url: `https://port-0-book-backend-1ru12mlw1sms1u.sel5.cloudtype.app/api/oauth/create`,
            data: {
                user_id: id,
                user_name: name,
                user_password: password
            }
        });

        if (parseInt(fetched.data?.status) === 200) navigate(`/login`);
        else setErrtext(fetched.data.message);
    }
    
    return (
        <>
            <div className="oauth-wrap">
                <div className="oauth-form">
                    <div className="oauth-group">
                        <p className={`oauth-text ${vaildId ? `err` : ``}`}>ID · 아이디 (a-z, 0-9, 20자)</p>
                        <input type="text" className={`global-input ${vaildId ? `err` : ``}`} defaultValue={id} onChange={e => setId(e.target.value)} autoFocus />
                    </div>

                    <div className="oauth-group">
                        <p className={`oauth-text ${vaildName ? `err` : ``}`}>NAME · 이름 (ㄱ-힣, 10자)</p>
                        <input type="text" className={`global-input ${vaildName ? `err` : ``}`} defaultValue={name} onChange={e => setName(e.target.value)} />
                    </div>

                    <div className="oauth-group">
                        <p className={`oauth-text ${vaildPassword ? `err` : ``}`}>PASSWORD · 비밀번호 (8자 이상)</p>
                        <input type="password" className={`global-input ${vaildPassword ? `err` : ``}`} defaultValue={password} onChange={e => setPassword(e.target.value)} />
                    </div>

                    <div className="oauth-group">
                        <p className={`oauth-text ${vaildRepassword ? `err` : ``}`}>REENTER · 비밀번호 재입력</p>
                        <input type="password" className={`global-input ${vaildRepassword ? `err` : ``}`} defaultValue={repassword} onChange={e => setRePassword(e.target.value)} />
                    </div>

                    <p className="oauth-errtext">{errtext}</p>

                    <button className="global-button oauth-submit active" onClick={submitHandler}>
                        <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" height="512" viewBox="0 0 24 24" width="512" data-name="Layer 1"><path d="m18 9.064a3.049 3.049 0 0 0 -.9-2.164 3.139 3.139 0 0 0 -4.334 0l-11.866 11.869a3.064 3.064 0 0 0 4.33 4.331l11.87-11.869a3.047 3.047 0 0 0 .9-2.167zm-14.184 12.624a1.087 1.087 0 0 1 -1.5 0 1.062 1.062 0 0 1 0-1.5l7.769-7.77 1.505 1.505zm11.872-11.872-2.688 2.689-1.5-1.505 2.689-2.688a1.063 1.063 0 1 1 1.5 1.5zm-10.825-6.961 1.55-.442.442-1.55a1.191 1.191 0 0 1 2.29 0l.442 1.55 1.55.442a1.191 1.191 0 0 1 0 2.29l-1.55.442-.442 1.55a1.191 1.191 0 0 1 -2.29 0l-.442-1.55-1.55-.442a1.191 1.191 0 0 1 0-2.29zm18.274 14.29-1.55.442-.442 1.55a1.191 1.191 0 0 1 -2.29 0l-.442-1.55-1.55-.442a1.191 1.191 0 0 1 0-2.29l1.55-.442.442-1.55a1.191 1.191 0 0 1 2.29 0l.442 1.55 1.55.442a1.191 1.191 0 0 1 0 2.29zm-5.382-14.645 1.356-.387.389-1.358a1.042 1.042 0 0 1 2 0l.387 1.356 1.356.387a1.042 1.042 0 0 1 0 2l-1.356.387-.387 1.359a1.042 1.042 0 0 1 -2 0l-.387-1.355-1.358-.389a1.042 1.042 0 0 1 0-2z"/></svg>
                        회원가입
                    </button>
                </div>
            </div>
        </>
    );
}

export default Signup;