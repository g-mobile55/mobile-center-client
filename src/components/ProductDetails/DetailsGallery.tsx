"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./details.module.scss";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import type { ImagesT } from "@/lib/types/woo.types";

function DetailsGallery({ images }: { images: ImagesT }) {
    const [currentImage, setCurrentImage] = useState(images[0].src);

    return (
        <div className={styles.wrapper}>
            <div className={styles["side-images"]}>
                {images.map((image, index: number) => (
                    <button
                        className={styles["image-button"]}
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentImage(image.src);
                        }}
                        key={`${image.id} + ${index}`}
                    >
                        <Image
                            src={image.src}
                            alt=""
                            layout="fill"
                            objectFit="cover"
                            quality={25}
                            placeholder="blur"
                            blurDataURL="/imagesceleton.gif"
                        />
                    </button>
                ))}
            </div>
            <div className={styles["selected-image"]}>
                <Zoom>
                    <Image src={currentImage} alt="" layout="fill" objectFit="cover" />
                </Zoom>
            </div>
        </div>
    );
}

export default DetailsGallery;
