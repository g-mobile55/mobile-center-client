import React from "react";
import ProductCard from "./ProductCard";
import styles from "./productCard.module.scss";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
    url: "http://mobile-center.gg",
    consumerKey: process.env.WOO_CONSUMER_KEY!,
    consumerSecret: process.env.WOO_CONSUMER_SECRET!,
    version: "wc/v3",
});

async function Products() {
    const response = await api.get("products");

    return (
        <div className={styles["card-container"]}>
            {response.data.map((product: any) => (
                <ProductCard
                    key={product.id}
                    image={product.images[0].src}
                    brands={
                        product.attributes.filter(
                            (attribute: any) => attribute.name === "Phone Brand"
                        )[0]?.options
                    }
                    name={product.name}
                    price={product.price}
                    id={product.id}
                    attributes={product.attributes}
                    categories={product.categories}
                    quantity={0}
                />
            ))}
        </div>
    );
}

export default Products;
