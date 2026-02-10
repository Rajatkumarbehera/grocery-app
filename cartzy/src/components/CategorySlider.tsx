import React from "react";

export default function CategorySlider() {
  const categories = ["Fruits & Vegetables", "Dairy & Eggs", "Personal Care"];

  return (
    <div className="text-center">
      <h2>Category Slider</h2>
      <div className="flex items-center justify-evenly">
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </div>
    </div>
  );
}
