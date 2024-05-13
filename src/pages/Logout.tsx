import React from 'react';
import { Cookies } from 'react-cookie';

import { ISession } from '../../types/interfaces';

export const Logout = ({ session }: { session: ISession | null }) => {
    const cookies = new Cookies();
    cookies.remove(`:__tkn`);
    
    // eslint-disable-next-line no-restricted-globals
    location.href = `/`;

    return <></>;
}

export default Logout;