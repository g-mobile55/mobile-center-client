import React from "react";
import ProductCard from "./ProductCard";
import styles from "./productCard.module.scss";

function Products() {
    return (
        <div className={styles["card-container"]}>
            <ProductCard
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
            />
        </div>
    );
}

export default Products;
