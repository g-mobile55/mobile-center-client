import { useEffect, useState, ChangeEvent, MouseEvent, useTransition } from "react";
import { axiosAPI } from "@/lib/helpers/axiosAPI";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setFilter, populateFilter, setLastPage } from "@/lib/redux/features/filterSlice";
import { setSearchParams } from "@/lib/redux/features/searchParamsSlice";
import { RootState } from "@/lib/redux/store";
import Dropdown from "./Dropdown";
import styles from "./header.module.scss";
import LoadingSpinner from "../Buttons/LoadingSpinner";

const manualCategories = [
    { label: "Зашита на экран", name: "Screen Protector", id: "52" },
    { label: "Зашита на Камеру", name: "Camera Protector", id: "47" },
    { label: "Чехлы на телефоны", name: "Phone Case", id: "17" },
    { label: "Селфи палки", name: "Selfie Stick", id: "124" },
    { label: "Повербанки", name: "Power Bank", id: "95" },
    { label: "Зарядные устроиства", name: "Charger", id: "55" },
    { label: "Кабели - дата и зарядные", name: "Charging Cable", id: "57" },
];

function Filter({
    isFilterOpen,
    handleFilterClick,
}: {
    isFilterOpen: "close" | "open";
    handleFilterClick: (e: MouseEvent) => void;
}) {
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
        startTransition(async () => {
            router.push(`/?${searchParams.toString()}`);

            handleFilterClick(e);
            try {
                const url = new URLSearchParams(`${searchParams}`);

                const { data } = await axiosAPI.get(`products/headers?${url}`);
                dispatch(setLastPage(data["x-wp-totalpages"]));
            } catch (error) {
                console.log(error);
            }
        });
    };

    return (
        <div className={`${styles["filter-wrapper"]} ${styles[isFilterOpen]}`}>
            <form className={styles["filter-inner"]}>
                <div>
                    {brands.length ? (
                        <Dropdown
                            title="Бренд"
                            data={brands}
                            handleChange={handleChange}
                            forProperty="brands"
                            isManual={false}
                        />
                    ) : (
                        <LoadingSpinner width={40} height={40} fill="#fff" />
                    )}
                </div>
                <div>
                    {/* Automatically fetching (fetching happens on initial render of the component by the useEffect hook) 
                    all categories and they'r id's and placing them  on the websites filter*/}
                    {/* {categories.length ? (
                        <Dropdown
                            title="Категории"
                            data={categories}
                            handleChange={handleChange}
                            forProperty="categories"
                            isManual={false}
                        />
                    ) : (
                        <LoadingSpinner width={40} height={40} fill="#fff" />
                    )} */}
                    {
                        <Dropdown
                            title="Категории"
                            data={manualCategories}
                            handleChange={handleChange}
                            forProperty="categories"
                            isManual={true}
                        />
                    }
                </div>
                {/* <div>
                    {attributes.length ? (
                        // Remove filter later to get full filter
                        // remove it when custom php endpoint for attributes will be ready.
                        attributes
                            .filter((item) => item.parentAttribute === "pa_for_device")
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
                </div> */}
                <div className={styles.information}>
                    <p>Больше опций фильтрации в разработке и скоро будут доступны.</p>
                </div>
            </form>
            <div className={styles["button-container"]}>
                <button
                    type="button"
                    className={styles.button}
                    onClick={handleApply}
                    disabled={isPending}
                >
                    {isPending ? (
                        <LoadingSpinner width={40} height={40} fill="#888888" />
                    ) : (
                        "Применить"
                    )}
                </button>
            </div>
        </div>
    );
}

export default Filter;
