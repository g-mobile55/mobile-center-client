// import Image from "next/image";
import styles from "./page.module.scss";
import Products from "@/components/Products/Products";

export default function Home({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <div className={styles.page}>
            <main>
                <Products searchParams={searchParams} />
            </main>

            {/*                
                <a
                    href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
                    Go to nextjs.org →
                </a> */}
        </div>
    );
}
