import React from "react";
import ProductCard from "./ProductCard";
import styles from "./productCard.module.scss";
import { wooAPI } from "@/lib/helpers/wooAPI";

async function Products({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const sParams = (await searchParams) as {
        brand: string | undefined;
        category: string | undefined;
        attribute: string | string[] | undefined;
        attribute_term: string | string[] | undefined;
        page: string | undefined;
    };

    const urlSearchParams = new URLSearchParams();

    if (sParams.brand) urlSearchParams.append("brand", sParams.brand);

    if (sParams.category) urlSearchParams.append("category", sParams.category);

    if (sParams.attribute && sParams.attribute_term) {
        if (typeof sParams.attribute === "string" && typeof sParams.attribute_term === "string") {
            urlSearchParams.append("attribute", sParams.attribute);
            urlSearchParams.append("attribute_term", sParams.attribute_term);
        } else {
            for (let i = 0; i < sParams.attribute.length; i++) {
                urlSearchParams.append("attribute", sParams.attribute[i]);
                urlSearchParams.append("attribute_term", sParams.attribute_term[i]);
            }
        }
    }

    if (sParams.page) {
        urlSearchParams.append("page", sParams.page);
    }

    urlSearchParams.append("per_page", "2");

    console.log(urlSearchParams.toString());

    // const url = Object.keys(sParams).length
    //     ? `products/?${urlSearchParams.toString()}`
    //     : "products";
    const url = `products/?${urlSearchParams.toString()}`;

    // console.log(url);
    // const response = await wooAPI.get("products", {
    //     // brand: 19,
    //     // category: "20,22",
    //     attribute: "pa_color", // Specify the material attribute
    //     attribute_term: "25",
    // });
    const response = await wooAPI.get(url);

    // console.log(response.data);

    return (
        <div className={styles["card-container"]}>
            {response.data.map((product: any) => (
                <ProductCard
                    key={product.id}
                    image={product.images[0].src}
                    brands={
                        // product.attributes.filter(
                        //     (attribute: any) => attribute.name === "Phone Brand"
                        // )[0]?.options
                        product.brands
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
