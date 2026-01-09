import React, { useContext } from "react"
import { ThemeContext } from "../context/ThemeContext.jsx";

export default function Filters({ filters = {}, setFilters, close }) {
   const { theme } = useContext(ThemeContext);
   const resetFilters = () => {
     setFilters({
       category: "",
       color: "",
       size: "",
       maxPrice: "",
       minDiscount: "",
     })
   }

  const handleNumericInput = (e, field) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) { 
      setFilters((f) => ({ ...f, [field]: value }))
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 backdrop-blur-sm bg-white/30"
        onClick={close}
      ></div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg z-50 w-11/12 max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Filters</h2>

        <div className="grid grid-cols-2 gap-3">

          <select
            value={filters.category || ""}
            onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
            className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          >
            <option value="">All categories</option>
            <option value="shirts">Shirts</option>
            <option value="pants">Pants</option>
            <option value="shoes">Shoes</option>
            <option value="jackets">Jackets</option>
          </select>

          <select
            value={filters.color || ""}
            onChange={(e) => setFilters((f) => ({ ...f, color: e.target.value }))}
            className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          >
            <option value="">Any color</option>
            <option value="blue">Blue</option>
            <option value="black">Black</option>
            <option value="white">White</option>
            <option value="red">Red</option>
          </select>

          <select
            value={filters.size || ""}
            onChange={(e) => setFilters((f) => ({ ...f, size: e.target.value }))}
            className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          >
            <option value="">Any size</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="40">40</option>
            <option value="41">41</option>
            <option value="42">42</option>
          </select>

          <input
            type="text"
            inputMode="numeric"
            placeholder="Max price"
            value={filters.maxPrice || ""}
            onChange={(e) => handleNumericInput(e, "maxPrice")}
            className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />

          <input
            type="text"
            inputMode="numeric"
            placeholder="Min discount %"
            value={filters.minDiscount || ""}
            onChange={(e) => handleNumericInput(e, "minDiscount")}
            className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div className="flex justify-between mt-4">
          <button
            className={`${
              theme === 'dark'
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-white text-red-500 hover:bg-red-600"
            } px-4 py-2 rounded`}
            onClick={resetFilters}
          >
            Reset
          </button>

          <button
            className={`${
              theme === 'dark'
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-white text-gray-800 hover:bg-gray-700"
            } px-4 py-2 rounded`}
            onClick={close}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
