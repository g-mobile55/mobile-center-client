import { RxDividerVertical } from "react-icons/rx";
import { IoCartOutline } from "react-icons/io5";
import { MdOutlineMenuOpen } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { openKart } from "@/lib/redux/features/kartSlice";
import { RootState } from "@/lib/redux/store";
import styles from "./footer.module.scss";
import Link from "next/link";

function Footer() {
    const kart = useSelector((state: RootState) => state.kart);
    const dispatch = useDispatch();

    return (
        <footer className={styles.footer}>
            <div className={styles["btn-container"]}>
                <Link href="/">
                    <MdOutlineMenuOpen style={{ fontSize: "1.3rem" }} />
                </Link>
            </div>
            <div className={styles["btn-container"]}>
                <RxDividerVertical />
            </div>
            <div className={styles["btn-container"]}>
                <button
                    className={styles["kart-button"]}
                    onClick={(e) => {
                        e.preventDefault();
                        dispatch(openKart());
                    }}
                >
                    <IoCartOutline style={{ fontSize: "1.3rem" }} />
                </button>
                {kart.products.length ? (
                    <div className={styles["kart-quantity"]}>
                        <span>{kart.products.length}</span>
                    </div>
                ) : null}
            </div>
        </footer>
    );
}

export default Footer;
