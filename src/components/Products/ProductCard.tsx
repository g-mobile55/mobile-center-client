import Image from "next/image";
import Link from "next/link";
import AddToCartBtn from "../Buttons/AddToCartBtn";
import styles from "./productCard.module.scss";

function ProductCard({
    imgPath,
    productName,
    phoneModel,
    productPrice,
    productID,
}: {
    imgPath: string;
    productName: string;
    phoneModel: string[];
    productPrice: string;
    productID: string;
}) {
    return (
        <div className={styles.card}>
            <Link href={`/product/${productID}`} className={styles["image-container"]}>
                <Image
                    src={imgPath}
                    alt="product image"
                    className={styles.image}
                    layout="fill"
                    objectFit="cover"
                    placeholder="blur"
                    blurDataURL="/imagesceleton.gif"
                />
            </Link>
            <div className={styles.content}>
                <p>
                    {productName}
                    {/* for{" "}
                    {phoneModel ? phoneModel.map((model) => <p key={model}>{model}</p>) : null} */}
                </p>
            </div>
            <div className={styles["price-wrapper"]}>
                <div className={styles.price}>
                    <p>{productPrice}&#8381;</p>
                </div>
                <Link href={`/product/${productID}`}>More</Link>
            </div>
            <AddToCartBtn />
        </div>
    );
}

export default ProductCard;
