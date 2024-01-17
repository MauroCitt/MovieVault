import React, { useState } from "react";

export default function MultiSelectDropdown({ formFieldName, options }) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleCheckboxChange = (value) => {
    const updatedOptions = [...selectedOptions];
    if (updatedOptions.includes(value)) {
      updatedOptions.splice(updatedOptions.indexOf(value), 1);
    } else {
      updatedOptions.push(value);
    }
    setSelectedOptions(updatedOptions);
  };

  return (
    <div className="relative">
      <input type="checkbox" className="hidden peer" />

      <div className="absolute bg-white border transition-opacity opacity-100 pointer-events-auto rounded">
        <ul>
          {options.map((option, i) => (
            <li key={option}>
              <label className="flex whitespace-nowrap cursor-pointer py-1 transition-colors hover:bg-blue-100">
                <input
                  type="checkbox"
                  name={formFieldName}
                  value={option}
                  className="cursor-pointer"
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                />
                <span className="ml-1">{option}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
