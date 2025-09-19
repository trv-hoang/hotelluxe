// import __authors from './jsons/__authors.json';
// import avatar1 from '@/assets/avatars/image-1.jpg';
// import avatar2 from '@/assets/avatars/image-2.jpg';
// import avatar3 from '@/assets/avatars/image-3.jpg';
// import avatar4 from '@/assets/avatars/image-4.jpg';
// import avatar5 from '@/assets/avatars/image-5.jpg';
// import avatar6 from '@/assets/avatars/image-6.jpg';
// import avatar7 from '@/assets/avatars/image-7.jpg';
// import avatar8 from '@/assets/avatars/image-8.jpg';
// import avatar9 from '@/assets/avatars/image-9.jpg';
// import avatar10 from '@/assets/avatars/image-10.jpg';
// import avatar11 from '@/assets/avatars/image-11.jpg';
// import avatar12 from '@/assets/avatars/image-12.jpg';
// import avatar13 from '@/assets/avatars/image-13.jpg';
// import avatar14 from '@/assets/avatars/image-14.jpg';
// import avatar15 from '@/assets/avatars/image-15.jpg';
// import avatar16 from '@/assets/avatars/image-16.jpg';
// import avatar17 from '@/assets/avatars/image-17.jpg';
// import avatar18 from '@/assets/avatars/image-18.jpg';
// import avatar19 from '@/assets/avatars/image-19.jpg';
// import avatar20 from '@/assets/avatars/image-20.jpg';
// import type { AuthorType } from '@/types/stay';
// const imgs = [
//     avatar1,
//     avatar2,
//     avatar3,
//     avatar4,
//     avatar5,
//     avatar6,
//     avatar7,
//     avatar8,
//     avatar9,
//     avatar10,
//     avatar11,
//     avatar12,
//     avatar13,
//     avatar14,
//     avatar15,
//     avatar16,
//     avatar17,
//     avatar18,
//     avatar19,
//     avatar20,
// ];

// const DEMO_AUTHORS: AuthorType[] = __authors.map((item, index) => ({
//     ...item,
//     avatar: imgs[index] || item.avatar,
//     href: item.href,
// }));

// export { DEMO_AUTHORS };
// import authorsJson from '@/data/jsons/__authors.json';

import api from '@/api/axios';
import { useEffect, useState } from 'react';

export interface Author {
    id: number;
    firstName: string;
    lastName: string;
    displayName: string;
    email: string;
    gender: string;
    avatar: string;
    count: number;
    href: string;
    desc: string;
    jobName: string;
    address: string;
    createdAt: string;
}
export default function useAuthors() {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/authors')
            .then((res) => setAuthors(res.data.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return { authors, loading };
}

// export const DEMO_AUTHORS: Author[] = authorsJson as Author[];
