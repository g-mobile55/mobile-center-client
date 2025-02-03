import { AiOutlineLoading3Quarters } from "react-icons/ai";
import styles from "./loadingCircle.module.scss";

import React from "react";

function LoadingCircle() {
    return (
        <div className={styles.loading}>
            <AiOutlineLoading3Quarters />
        </div>
    );
}

export default LoadingCircle;
