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
                    imgPath={product.images[0].src}
                    phoneModel={
                        product.attributes.filter(
                            (attribute: any) => attribute.name === "Phone Brand"
                        )[0]?.options
                    }
                    productName={product.name}
                    productPrice={product.price}
                    productID={product.id}
                />
            ))}
            {/* <ProductCard
                imgPath="/6822815843.webp"
                productName="Aurora Elite MagSafe Case"
                phoneModel="iPhone 15 Pro"
                productPrice="1950"
            />
            <ProductCard
                imgPath="/7038553042.webp"
                productName="Air Grip MagSafe Case"
                phoneModel="iPhone 15 Pro Max"
                productPrice="1350"
            />
            <ProductCard
                imgPath="/7038726579.webp"
                productName="Air Grip MagSafe Case"
                phoneModel="S24 Ultra"
                productPrice="2020"
            /> */}
        </div>
    );
}

export default Products;
