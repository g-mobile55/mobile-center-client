import styles from "./buttons.module.scss";

function AddToCartBtn({
    handleClick,
    btnType,
}: {
    handleClick: any;
    btnType: "button" | "submit" | "reset";
}) {
    return (
        <div className={styles["button-container"]}>
            <button className={styles.button} onClick={handleClick} type={btnType}>
                Add To Cart
            </button>
        </div>
    );
}

export default AddToCartBtn;
