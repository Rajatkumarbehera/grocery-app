"use client";

import axios from "axios";
import { Search, Upload, X } from "lucide-react";
import mongoose from "mongoose";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Grocery {
  _id?: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
}

const categories = ["Fruits & Vegetables", "Dairy & Eggs", "Personal Care"];
const units = ["kg", "g", "liter", "ml", "piece"];

export default function ViewGroceryPage() {
  const [groceries, setGroceries] = useState<Grocery[]>();
  const [editing, setEditing] = useState<Grocery | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [backendImage, setBackendImage] = useState<Blob | null>(null);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Grocery[]>();
  const getAllGroceries = async () => {
    try {
      const result = await axios.get("/api/admin/get-groceries");
      console.log(result.data);
      setGroceries(result.data);
      setFiltered(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllGroceries();
  }, []);

  useEffect(() => {
    if (editing) {
      setImagePreview(editing.image);
    }
  }, [editing]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBackendImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleGroceryUpdate = async () => {
    if (!editing) return;

    try {
      const formData = new FormData();
      formData.append("groceryId", editing?._id?.toString()!);
      formData.append("name", editing?.name);
      formData.append("category", editing?.category);
      formData.append("unit", editing?.unit);
      formData.append("price", editing?.price);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const result = await axios.post("/api/admin/edit-grocery", formData);
      console.log(result.data);
      setEditing(null);
      getAllGroceries();
    } catch (error) {
      console.log(error);
    }
  };

  const handleGroceryDelete = async (groceryId: string) => {
    try {
      console.log("groceryid", groceryId);

      const result = await axios.delete("/api/admin/delete-grocery", {
        data: { groceryId },
      });

      console.log(result);
      getAllGroceries();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.toLowerCase();

    setFiltered(
      groceries?.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q),
      ),
    );
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-white border border-gray-200 rounded-full px-5 py-3 shadow-sm mb-10 max-w-lg mx-auto w-full">
          <Search className="h-5 w-5 mr-2" />
          <input
            type="text"
            placeholder="Search by name or category"
            className="outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className="bg-pink-500 px-2 py-1 rounded-sm cursor-pointer"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {filtered?.map((grocery, index) => (
          <div
            key={index}
            className="border rounded-xl p-4 flex justify-between"
          >
            <div className="flex gap-4">
              <div className="relative w-48 h-48 rounded-xl overflow-hidden border">
                {grocery.image ? (
                  <Image
                    src={grocery.image}
                    alt={grocery.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-1">
                <h3 className="capitalize">{grocery.name}</h3>
                <h3 className="rounded-full bg-green-400 px-2 py-1 text-xs">
                  {grocery.category}
                </h3>
                <p>
                  {grocery.price}/{grocery.unit}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                className="bg-amber-500 text-sm rounded-sm px-4 py-1 cursor-pointer"
                onClick={() => setEditing(grocery)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-sm rounded-sm px-4 py-1 cursor-pointer"
                onClick={() => handleGroceryDelete(grocery._id?.toString()!)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 relative">
            <div className="flex justify-between items-center mb-4">
              <h2>Edit grocery</h2>
              <X
                className="text-red-500 cursor-pointer"
                onClick={() => setEditing(null)}
              />
            </div>
            <div className="relative w-48 h-48 rounded-xl overflow-hidden border">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt={editing.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200">
                  No Image
                </div>
              )}
              <label
                htmlFor="imageUpload"
                className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition cursor-pointer"
              >
                <div className="bg-black/60 p-3 rounded-full text-white">
                  <Upload size={22} />
                </div>
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <input
                className="border"
                type="text"
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
              />

              <input
                className="border"
                type="text"
                value={editing.price}
                onChange={(e) =>
                  setEditing({ ...editing, price: e.target.value })
                }
              />
              <select
                onChange={(e) =>
                  setEditing({ ...editing, unit: e.target.value })
                }
                value={editing.unit}
                className="border"
              >
                <option value="">Select unit</option>
                {units.map((unit, index) => (
                  <option key={index} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              <select
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value })
                }
                value={editing.category}
                className="border"
              >
                <option value="">Select category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                className="bg-green-500 px-4 py-1 rounded-sm cursor-pointer"
                onClick={handleGroceryUpdate}
              >
                Save
              </button>
              <button
                className="bg-red-500 px-4 py-1 rounded-sm cursor-pointer"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
