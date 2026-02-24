"use client";

import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

const categories = ["Fruits & Vegetables", "Dairy & Eggs", "Personal Care"];
const units = ["kg", "g", "liter", "ml", "piece"];

export default function AddGrocery() {
  const router = useRouter();
  const imageRef = useRef(null);
  const [groceryName, setGroceryName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", groceryName);
      formData.append("category", category);
      formData.append("unit", unit);
      formData.append("price", price.toString());
      if (imageFile) {
        formData.append("image", imageFile);
      }
      const result = await axios.post("/api/admin/add-grocery", formData);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-green-50 to-yellow-50 p-6 relative">
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 flex items-center gap-1 text-green-700 hover:text-green-900 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="outline"
          placeholder="Grocery name"
          value={groceryName}
          onChange={(e) => setGroceryName(e.target.value)}
        />
        <div>
          <select
            name="categories"
            id="categories"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          >
            <option value="">Select category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            name="units"
            id="units"
            onChange={(e) => setUnit(e.target.value)}
            value={unit}
          >
            <option value="">Select unit</option>
            {units.map((unit, index) => (
              <option key={index} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
        <input
          min="0"
          type="number"
          className="outline"
          placeholder="price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <div>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <Image
              src={imagePreview}
              alt="preview"
              height={32}
              width={32}
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 mt-4 rounded-lg transition-all duration-200 shadow-md"
        >
          Add
        </button>
      </form>
    </div>
  );
}
