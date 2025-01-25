import Image from "next/image";
import Link from "next/link";
import styles from "./productCard.module.scss";
import Zoom from "react-medium-image-zoom";

function ProductCard({
    imgPath,
    productName,
    phoneModel,
    productPrice,
}: {
    imgPath: string;
    productName: string;
    phoneModel: string;
    productPrice: string;
}) {
    return (
        <div className={styles.card}>
            <div className={styles["image-container"]}>
                <Image
                    src={imgPath}
                    alt="product image"
                    className={styles.image}
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <div className={styles.content}>
                <p>
                    {productName} for {phoneModel}
                </p>
            </div>
            <div className={styles["price-wrapper"]}>
                <div className={styles.price}>
                    <p>{productPrice}&#8381;</p>
                </div>
                <Link href="/product/1">More</Link>
            </div>
            <div className={styles["button-container"]}>
                <button className={styles.button}>Add To Cart</button>
            </div>
        </div>
    );
}

export default ProductCard;
