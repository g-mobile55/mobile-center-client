import styles from "./buttons.module.scss";

function AddToCartBtn() {
    return (
        <div className={styles["button-container"]}>
            <button className={styles.button}>Add To Cart</button>
        </div>
    );
}

export default AddToCartBtn;
