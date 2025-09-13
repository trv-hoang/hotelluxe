import type { StayDataType } from '@/types/stay';
import { DEMO_AUTHORS } from './authors';
import __stayListing from './jsons/__homeStay.json';
import { DEMO_STAY_CATEGORIES } from '@/data/categories';

const DEMO_STAY_LISTINGS = __stayListing.map((post, index): StayDataType => {
    //Tìm category theo listingCategoryId
    const category =
        DEMO_STAY_CATEGORIES.find((cat) => cat.id === post.listingCategoryId) ||
        DEMO_STAY_CATEGORIES[0];

    return {
        ...post,
        id: post.id,
        saleOff: !index ? '-20% today' : post.saleOff,
        isAds: !index ? true : post.isAds,
        author:
            DEMO_AUTHORS.find((user) => user.id === post.authorId) ||
            DEMO_AUTHORS[0],
        category,
        href: post.href,
        description: post.description || 'Chưa có mô tả',
    };
});
export { DEMO_STAY_LISTINGS };
