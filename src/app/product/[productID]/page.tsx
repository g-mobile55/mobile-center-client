import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import DetailsGallery from "@/components/ProductDetails/DetailsGallery";
import styles from "./page.module.scss";
import AddToCartBtn from "@/components/Buttons/AddToCartBtn";

import type { ImagesT } from "@/lib/types/woo.types";

const api = new WooCommerceRestApi({
    url: "http://mobile-center.gg",
    consumerKey: process.env.WOO_CONSUMER_KEY!,
    consumerSecret: process.env.WOO_CONSUMER_SECRET!,
    version: "wc/v3",
});

async function page({ params }: { params: { productID: string } }) {
    const { productID } = await params;

    const response = await api.get(`products/${productID}`);
    const product = response.data;
    const images = response.data.images as ImagesT;

    console.log(product);

    return (
        <div className={styles.page}>
            <DetailsGallery images={images} />
            <div className={styles.content}>
                <h1>{product.name}</h1>
                <p>{product.price}&#8381;</p>
                <p>{product.categories.name}</p>
                <ul>
                    {product.attributes.map((attribute, index: number) => {
                        return (
                            <li key={index}>
                                {attribute.name}:
                                <label htmlFor={attribute.name}>
                                    <select name={attribute.name}>
                                        {attribute.options.map((option: string) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </li>
                        );
                    })}
                </ul>
                <p>Category: {product.categories.map((category) => category.name)}</p>
                <p>Brand: {product.brands.map((brand) => brand.name)}</p>
                <AddToCartBtn />
            </div>
        </div>
    );
}

export default page;
