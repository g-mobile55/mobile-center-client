import { useEffect, useState, ChangeEvent, MouseEvent, useTransition } from "react";
import { axiosAPI } from "@/lib/helpers/axiosAPI";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setFilter, populateFilter } from "@/lib/redux/features/filterSlice";
import { setSearchParams } from "@/lib/redux/features/searchParamsSlice";
import { RootState } from "@/lib/redux/store";
import Dropdown from "./Dropdown";
import styles from "./header.module.scss";
import LoadingSpinner from "../Buttons/LoadingSpinner";

function Filter({ isFilterOpen }: { isFilterOpen: "close" | "open" }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const dispatch = useDispatch();
    const filterState = useSelector((state: RootState) => state.filter);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const payload = {
            name: e.target.name,
            value: e.target.value,
            checked: e.target.checked,
        };
        dispatch(setFilter(payload));
    };

    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);

    useEffect(() => {
        console.log("effect");
        axiosAPI
            .get("products/properties")
            .then((response) => {
                setBrands(response.data.brands);
                setCategories(response.data.categories);
                setAttributes(response.data.attributesTerms);

                // populate filterState attributes with empty arrays
                // so we will not get error while trying to set state
                // when checkbox for some attribute is checked
                const attributesOBJ: { [key: string]: [] } = {};

                response.data.attributesTerms.forEach((term: string) => {
                    attributesOBJ[term.parentAttribute] = [];
                });

                dispatch(populateFilter(attributesOBJ));
            })
            .catch((error) => console.log(error));
    }, []);

    const handleApply = (e: MouseEvent) => {
        const searchParams = new URLSearchParams();
        e.preventDefault();

        if (filterState.brands.length)
            searchParams.append(
                "brand",
                filterState.brands.map((brand: string) => brand.split(",")[1]).join(",")
            );

        if (filterState.categories.length)
            searchParams.append(
                "category",
                filterState.categories.map((category: string) => category.split(",")[1]).join(",")
            );

        for (const key in filterState.attributes) {
            if (filterState.attributes[key].length) {
                searchParams.append("attribute", key);
                searchParams.append(
                    "attribute_term",
                    filterState.attributes[key].map((term: string) => term.split(",")[1]).join(",")
                );
            }
        }

        dispatch(setSearchParams(searchParams.toString()));
        startTransition(() => {
            router.push(`/?${searchParams.toString()}`);
        });
    };

    return (
        <div className={`${styles["filter-wrapper"]} ${styles[isFilterOpen]}`}>
            <form className={styles["filter-inner"]}>
                <div>
                    {brands.length ? (
                        <Dropdown
                            title="Brands"
                            data={brands}
                            handleChange={handleChange}
                            forProperty="brands"
                        />
                    ) : (
                        <LoadingSpinner width={40} height={40} fill="#fff" />
                    )}
                </div>
                <div>
                    {categories.length ? (
                        <Dropdown
                            title="Categories"
                            data={categories}
                            handleChange={handleChange}
                            forProperty="categories"
                        />
                    ) : (
                        <LoadingSpinner width={40} height={40} fill="#fff" />
                    )}
                </div>
                <div>
                    {attributes.length ? (
                        // Remove filter later to get full filter
                        // remove it when custom php endpoint for attributes will be ready.
                        attributes
                            .filter((item) => item.parentAttribute === "pa_phone_brand")
                            .map((attribute) => {
                                return (
                                    <Dropdown
                                        title="Attributes"
                                        data={attribute}
                                        handleChange={handleChange}
                                        forProperty="attributes"
                                        key={attribute.parentAttribute}
                                    />
                                );
                            })
                    ) : (
                        <LoadingSpinner width={40} height={40} fill="#fff" />
                    )}
                </div>
                <div className={styles.information}>
                    <p>More filter options are coming soon.</p>
                </div>
            </form>
            <div className={styles["button-container"]}>
                <button
                    type="button"
                    className={styles.button}
                    onClick={handleApply}
                    disabled={isPending}
                >
                    {isPending ? <LoadingSpinner width={40} height={40} fill="#888888" /> : "Apply"}
                </button>
            </div>
        </div>
    );
}

export default Filter;
