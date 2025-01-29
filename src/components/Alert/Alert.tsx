import styles from "./alert.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

function Alert() {
    const alert = useSelector((state: RootState) => state.alert);

    return (
        <div className={`${styles.alert} ${styles[alert.alertClassName]}`}>
            <p>The product has been added to your Kart.</p>
        </div>
    );
}

export default Alert;
