"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { PropagateLoader } from "react-spinners"; // Loading spinner

interface Products {
  _id: string;
  name: string;
  images: string[];
  price: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Store = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/products`)
      .then((response) => {
        const data = response?.data;
        setProducts(data?.products);
      })
      .catch(() => {
        setError(true); // Set error state if fetching fails
      })
      .finally(() => {
        setIsLoading(false); // Stop loading spinner
      });
  }, []);

  return (
    <div>
      {/* Loading Spinner */}
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <PropagateLoader color="#c0c0c0" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-red-500">Failed to load products. Please try again later.</p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <div
                key={product._id}
                className="product-card rounded-xl group hover:bg-gray-100"
              >
                <Image
                  src={product.images[0] || "/placeholder-image.png"} // Fallback image
                  alt={product.name || "Product Image"}
                  width={300}
                  height={300}
                  className="object-cover w-full h-64 rounded-xl"
                />
                <div className="flex flex-col items-center justify-center py-5">
                  <h2 className="text-lg font-bold">{product.name}</h2>
                  <p className="text-gray-700 my-2">{product.price} BDT</p>
                  <Link href={`/etha/${product._id}`}>
                    <button className="bg-black text-white py-1 px-4 rounded-full">
                      View Product
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
