import { wooAPI } from "@/lib/helpers/wooAPI";
import DetailsGallery from "@/components/ProductDetails/DetailsGallery";
import styles from "./page.module.scss";
import ProductDetailsForm from "@/components/ProductDetails/ProductDetailsForm";

import type { ImagesT } from "@/lib/types/woo.types";

async function page({ params }: { params: { productID: string } }) {
    const { productID } = await params;

    const response = await wooAPI.get(`products/${productID}`);
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
