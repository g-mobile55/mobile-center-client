import { useEffect, useState, ChangeEvent } from "react";
import { axiosAPI } from "@/lib/helpers/axiosAPI";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import styles from "./header.module.scss";

function Filter({ isFilterOpen }: { isFilterOpen: "close" | "open" }) {
    const [url, setUrl] = useState();

    const [searchState, setSearchState] = useState<{ [key: string]: Set<unknown> | any }>({
        brands: [],
        categories: [],
        attributes: {},
    });

    const searchParams = new URLSearchParams();
    searchParams.delete();

    console.log(searchState);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchState((state) => {
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
                //
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

                // populate searchState attributes with empty arrays
                // so we will not get error while trying to set state
                // when checkbox for some attribute is checked
                const attributesOBJ = {};
                response.data.attributesTerms.forEach((term) => {
                    attributesOBJ[term.parrentAttribute] = [];
                });
                setSearchState((state) => {
                    return { ...state, attributes: attributesOBJ };
                });
            })
            .catch((error) => console.log(error));
    }, []);

    return (
        <div className={`${styles["filter-wrapper"]} ${styles[isFilterOpen]}`}>
            <form className={styles["filter-inner"]}>
                <div>
                    <h4>Brands</h4>
                    <ul>
                        {brands.length ? (
                            brands.map((brand: any) => {
                                return (
                                    <li key={`${brand.name} ${brand.id}`}>
                                        <label htmlFor={brand.name}>
                                            <input
                                                type="checkbox"
                                                name={"brands"}
                                                value={`${brand.name},${brand.id}`}
                                                id={brand.name}
                                                onChange={handleChange}
                                            />
                                            {brand.name}
                                        </label>
                                    </li>
                                );
                            })
                        ) : (
                            <div className={styles.loading}>
                                <AiOutlineLoading3Quarters />
                            </div>
                        )}
                    </ul>
                </div>
                <div>
                    <h4>Categories</h4>
                    <ul>
                        {categories.length ? (
                            categories.map((category: any) => {
                                return (
                                    <li key={`${category.name} ${category.id}`}>
                                        <label htmlFor={category.name}>
                                            <input
                                                type="checkbox"
                                                name={"categories"}
                                                value={`${category.name},${category.id}`}
                                                id={category.name}
                                                onChange={handleChange}
                                            />
                                            {category.name}
                                        </label>
                                    </li>
                                );
                            })
                        ) : (
                            <div className={styles.loading}>
                                <AiOutlineLoading3Quarters />
                            </div>
                        )}
                    </ul>
                </div>
                <div>
                    <h4>Attributes</h4>
                    {attributes.length ? (
                        attributes.map((attribute) => {
                            return (
                                <ul key={attribute.parrentAttribute}>
                                    <h5>{attribute.parrentAttribute}</h5>
                                    {attribute.terms.map((term) => {
                                        return (
                                            <li key={`${term.id} ${term.name}`}>
                                                <label htmlFor={term.name}>
                                                    <input
                                                        type="checkbox"
                                                        name={`attributes-${attribute.parrentAttribute}`}
                                                        value={`${term.name},${term.id}`}
                                                        id={term.name}
                                                        onChange={handleChange}
                                                    />
                                                    {term.name}
                                                </label>
                                            </li>
                                        );
                                    })}
                                </ul>
                            );
                        })
                    ) : (
                        <div className={styles.loading}>
                            <AiOutlineLoading3Quarters />
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}

export default Filter;
