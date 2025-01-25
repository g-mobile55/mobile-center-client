import { RxDividerVertical } from "react-icons/rx";
import { IoCartOutline } from "react-icons/io5";
import { MdOutlineMenuOpen } from "react-icons/md";
import styles from "./footer.module.scss";

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles["btn-container"]}>
                <MdOutlineMenuOpen style={{ fontSize: "1.3rem" }} />
            </div>
            <div className={styles["btn-container"]}>
                <RxDividerVertical />
            </div>
            <div className={styles["btn-container"]}>
                <IoCartOutline style={{ fontSize: "1.3rem" }} />
            </div>
        </footer>
    );
}

export default Footer;
