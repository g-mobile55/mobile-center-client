import LoadingSpinner from "@/components/Buttons/LoadingSpinner";

import styles from "./page.module.scss";

function loading() {
    return (
        <div className={styles["loading-page"]}>
            <LoadingSpinner width={100} height={100} />
        </div>
    );
}

export default loading;
