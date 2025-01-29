import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import DetailsGallery from "@/components/ProductDetails/DetailsGallery";
import styles from "./page.module.scss";
import ProductDetailsForm from "@/components/Form/ProductDetailsForm";

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
                <ProductDetailsForm
                    product={{
                        name: product.name,
                        id: product.id,
                        price: product.price,
                        categories: product.categories,
                        attributes: product.attributes,
                        brands: product.brands,
                        image: images[0].src,
                    }}
                />
            </div>
        </div>
    );
}

export default page;
