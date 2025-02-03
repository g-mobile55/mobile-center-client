"use client";
import { useState } from "react";

function Dropdown({
    data,
    handleChange,
    forProperty,
}: {
    data: any;
    handleChange: any;
    forProperty: "brands" | "categories" | "attributes";
}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState("close");

    return (
        <ul>
            {data.parentAttributeName ? <h5>{data.parentAttributeName}</h5> : null}
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
    );
}

export default Dropdown;
