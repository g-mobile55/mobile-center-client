import { useEffect, useState, ChangeEvent, MouseEvent, useTransition } from "react";
import { axiosAPI } from "@/lib/helpers/axiosAPI";
import LoadingCircle from "../Buttons/LoadingCircle";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setFilter, populateFilter } from "@/lib/redux/features/filterSlice";
import { RootState } from "@/lib/redux/store";
import styles from "./header.module.scss";
import Dropdown from "./Dropdown";

type FilterStateT = {
    brands: string[];
    categories: string[];
    attributes: { [key: string]: string[] };
};

function Filter({ isFilterOpen }: { isFilterOpen: "close" | "open" }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [filterState, setFilterState] = useState<FilterStateT>({
        brands: [],
        categories: [],
        attributes: {},
    });
    const dispatch = useDispatch();
    const reduxState = useSelector((state: RootState) => state.filter);

    // URLSearchParams.prototype.remove = function (key, value) {
    //     const entries = this.getAll(key);
    //     const newEntries = entries.filter((entry) => entry !== value);
    //     this.delete(key);
    //     newEntries.forEach((newEntry) => this.append(key, newEntry));
    // };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(reduxState);
        console.log(filterState);

        setFilterState((state) => {
            let newState;
            if (e.target.name.split("-")[0] === "attributes") {
                const attribute = e.target.name.split("-")[1];

                const isChecked = e.target.checked;
                if (isChecked) {
                    newState = {
                        ...state,
                        attributes: {
                            ...state.attributes,
                            [attribute]: [...state.attributes[attribute], e.target.value],
                        },
                    };
                } else {
                    newState = {
                        ...state,
                        attributes: {
                            ...state.attributes,
                            [attribute]: state.attributes[attribute].filter(
                                (item: any) => item !== e.target.value
                            ),
                        },
                    };
                }
            } else {
                const isChecked = e.target.checked;
                if (isChecked) {
                    newState = {
                        ...state,
                        [e.target.name]: [...state[e.target.name], e.target.value],
                    };
                } else {
                    newState = {
                        ...state,
                        [e.target.name]: state[e.target.name].filter(
                            (item: any) => item !== e.target.value
                        ),
                    };
                }
            }

            return newState;
        });
        // useRedux ------
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
        axiosAPI
            .get("products")
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
                setFilterState((state) => {
                    return { ...state, attributes: attributesOBJ };
                });
                // using redux -----
                dispatch(populateFilter(attributesOBJ));
            })
            .catch((error) => console.log(error));
    }, []);

    const handleApply = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
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

        console.log(filterState.attributes);
        console.log(searchParams.toString());
        startTransition(() => {
            router.push(`/?${searchParams.toString()}`);
        });
    };

    return (
        <div className={`${styles["filter-wrapper"]} ${styles[isFilterOpen]}`}>
            <form className={styles["filter-inner"]}>
                <div>
                    <h4>Brands</h4>
                    {brands.length ? (
                        <Dropdown data={brands} handleChange={handleChange} forProperty="brands" />
                    ) : (
                        <LoadingCircle />
                    )}
                </div>
                <div>
                    <h4>Categories</h4>
                    {categories.length ? (
                        <Dropdown
                            data={categories}
                            handleChange={handleChange}
                            forProperty="categories"
                        />
                    ) : (
                        <LoadingCircle />
                    )}
                </div>
                <div>
                    <h4>Attributes</h4>
                    {attributes.length ? (
                        // Remove filter later to get full filter
                        // remove it when custom php endpoint for attributes will be ready.
                        attributes
                            .filter((item) => item.parentAttribute === "pa_phone_brand")
                            .map((attribute) => {
                                return (
                                    <Dropdown
                                        data={attribute}
                                        handleChange={handleChange}
                                        forProperty="attributes"
                                        key={attribute.parentAttribute}
                                    />
                                    // <ul key={attribute.parentAttribute}>
                                    //     <h5>{attribute.parentAttributeName}</h5>
                                    //     {attribute.terms.map((term) => {
                                    //         return (
                                    //             <li key={`${term.id} ${term.name}`}>
                                    //                 <label htmlFor={term.name}>
                                    //                     <input
                                    //                         type="checkbox"
                                    //                         name={`attributes-${attribute.parentAttribute}`}
                                    //                         value={`${term.name},${term.id}`}
                                    //                         id={term.name}
                                    //                         onChange={handleChange}
                                    //                     />
                                    //                     {term.name}
                                    //                 </label>
                                    //             </li>
                                    //         );
                                    //     })}
                                    // </ul>
                                );
                            })
                    ) : (
                        <LoadingCircle />
                    )}
                </div>
            </form>
            <div className={styles["button-container"]}>
                <button
                    type="button"
                    className={styles.button}
                    onClick={handleApply}
                    disabled={isPending}
                >
                    {isPending ? <LoadingCircle /> : "Apply"}
                </button>
            </div>
        </div>
    );
}

export default Filter;
