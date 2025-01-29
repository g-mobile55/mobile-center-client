export type ImageT = {
    id: number;
    date_created: string;
    date_created_gmt: string;
    date_modified: string;
    date_modified_gmt: string;
    src: string;
    name: string;
    alt: string;
};

export type ImagesT = ImageT[];

export type ProductT = {
    id: string;
    name: string;
    price: string;
    image: string;
    attributes: { id: number; name: string; slug: string; position: number; options: string }[];
    brands: { id: number; name: string; slug: string }[];
    categories: { id: number; name: string; slug: string }[];
    quantity: number;
};
