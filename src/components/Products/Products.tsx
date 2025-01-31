import React from "react";
import ProductCard from "./ProductCard";
import styles from "./productCard.module.scss";
import { wooAPI } from "@/lib/helpers/wooAPI";

async function Products({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const sParams = await searchParams;
    const params = new URLSearchParams(sParams);
    params.append("attribute", "color");
    params.append("attribute", "material");

    const response = await wooAPI.get("products", {
        // brand: 19,
        // category: "20,22",
        // attribute: "pa_color", // Specify the material attribute
        // attribute_term: `27, 30, 31, 32`,
        // attribute_term: "pa_black",
    });
    // const response = await wooAPI.get("products", sParams);

    console.log(response.data[1]?.attributes);
    console.log(params.toString());

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
