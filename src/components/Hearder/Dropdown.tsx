"use client";
import { MouseEvent, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import styles from "./header.module.scss";

function Dropdown({
    data,
    handleChange,
    forProperty,
    title,
}: {
    data: any;
    handleChange: any;
    forProperty: "brands" | "categories" | "attributes";
    title: "Brands" | "Categories" | "Attributes" | "Бренд" | "Категории";
}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState<"open" | "close">("close");

    const handleWrapperDropdown = (e: MouseEvent) => {
        e.preventDefault();
        setIsDropdownOpen((state) => (state === "close" ? "open" : "close"));
    };

    return (
        <div className={styles["dropdown-container"]}>
            <button className={styles["title-button"]} onClick={handleWrapperDropdown}>
                <h4>{title}</h4>
                <div className={`${styles["arrow-container"]} ${styles[isDropdownOpen]}`}>
                    <IoIosArrowUp />
                </div>
            </button>
            <div className={`${styles["dropdown-list"]} ${styles[isDropdownOpen]}`}>
                {data.parentAttributeName ? <h5>{data.parentAttributeName}</h5> : null}
                <ul>
                    {/* if we have terms means its for attributes */}
                    {data.terms
                        ? data.terms.map((term) => {
                              return (
                                  <li key={`${term.id} ${term.name}`}>
                                      <label htmlFor={term.name}>
                                          <input
                                              type="checkbox"
                                              name={`attributes-${data.parentAttribute}`}
                                              value={`${term.name},${term.id}`}
                                              id={term.name}
                                              onChange={handleChange}
                                          />
                                          {term.name}
                                      </label>
                                  </li>
                              );
                          })
                        : data.map((brand: any) => {
                              return (
                                  <li key={`${brand.name} ${brand.id}`}>
                                      <label htmlFor={brand.name}>
                                          <input
                                              type="checkbox"
                                              name={forProperty}
                                              value={`${brand.name},${brand.id}`}
                                              id={brand.name}
                                              onChange={handleChange}
                                          />
                                          {brand.name}
                                      </label>
                                  </li>
                              );
                          })}
                </ul>
            </div>
        </div>
    );
}

export default Dropdown;
