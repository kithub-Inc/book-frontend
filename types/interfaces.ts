export interface ISession {
    user_id: string;
    user_name: string;
}

export interface IBook extends ISession {
    node_id: number;
    book_name: string;
    book_author: string;
}

export interface IItem {
    node_id: number;
    target: number;
    item_image: string;
    item_type: string;
    item_tags: string;
    item_title: string;
    item_difficulty: string;
    item_qrcode: string;
    item_author: string;
    item_created_at: string;
    item_page: number;
    item_subcontent: string;
    item_content: string;
    item_index: string;
}

export interface ILink extends IBook {
    target: number;
    link_bookname: string;
    link_content: string;
}