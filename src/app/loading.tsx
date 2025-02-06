import { AiOutlineLoading3Quarters } from "react-icons/ai";

import styles from "./page.module.scss";

function loading() {
    return (
        <div className={styles["loading-page"]}>
            <div className={styles.loading}>
                <AiOutlineLoading3Quarters />
            </div>
        </div>
    );
}

export default loading;
