"use client";

import Footer from "@/components/frontend/shared/Footer/Footer";
import Navbar from "@/components/frontend/shared/Navbar/Navbar";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from 'swiper/types';
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
// import Image from "next/image";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PropagateLoader } from "react-spinners";
import PageTitle from '@/components/PageTitle/PageTitle'

interface Product {
  _id: string;
  name: string;
  images: string[];
  price: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Page = () => {
  const { _id } = useParams();
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [moreProduct, setMoreProduct] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (_id) {
      axios
        .get(`/api/products/single/${_id}`)
        .then((response) => {
          const data = response?.data;
          setProduct(data?.product);
        })
        .catch(() => setError(true))
        .finally(() => setIsLoading(false));
    }
  }, [_id]);

  useEffect(() => {
    axios
      .get(`/api/products`)
      .then((response) => {
        const data = response?.data;
        const products = data?.products || [];
        const sortedProducts = products
          .sort((a: Product, b: Product) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          })
          .slice(0, 6);
        setMoreProduct(sortedProducts);
      })
      .catch(() => setError(true));
  }, []);

  return (
    <div>
      <PageTitle title={`${product? product?.name: "product"}`} />
      <Navbar />

      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <PropagateLoader color="#c0c0c0" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-xl font-bold text-red-500">Failed to load product details.</h2>
          <p className="text-gray-500">Please try refreshing the page or contact support.</p>
        </div>
      ) : (
        <>
          {/* Main Product Details */}
          <div className="md:grid grid-cols-2 gap-10 max-w-5xl xl:mx-auto lg:mx-10 mx-5">
            <div className="product-slider">
              <Swiper
                style={{
                  "--swiper-navigation-color": "#fff",
                  "--swiper-pagination-color": "#fff",
                }as React.CSSProperties}
                spaceBetween={10}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="main-swiper"
              >
                {product?.images?.length ? (
                  product.images.map((imgSrc, index) => (
                    <SwiperSlide key={index}>
                      <img
                        width={500}
                        height={500}
                        src={imgSrc}
                        alt={product.name || `Slide ${index + 1}`}
                        className="w-full h-[500px] object-cover"
                      />
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <img
                      width={500}
                      height={500}
                      src="/placeholder-image.png"
                      alt="Placeholder"
                      className="w-full h-[500px] object-cover"
                    />
                  </SwiperSlide>
                )}
              </Swiper>
              <Swiper
                onSwiper={setThumbsSwiper}
                slidesPerView={5}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="thumbs-swiper flex"
              >
                {product?.images?.length ? (
                  product.images.map((imgSrc, index) => (
                    <SwiperSlide key={index}>
                      <img
                        width={100}
                        height={100}
                        src={imgSrc}
                        alt={`Thumbnail ${index + 1}`}
                        className="p-2 size-[100px] object-cover"
                      />
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <img
                      width={100}
                      height={100}
                      src="/placeholder-image.png"
                      alt="Placeholder Thumbnail"
                      className="p-2 size-[100px] object-cover"
                    />
                  </SwiperSlide>
                )}
              </Swiper>
            </div>

            <div className="py-10 space-y-5">
              <h1 className="text-3xl">{product?.name}</h1>
              <p className="text-xl">{product?.price} BDT</p>
              <p className="product-description">{product?.description}</p>
              <Link target="blank" href="https://www.instagram.com/_e_t_h_a">
                <button className="bg-black hover:bg-black/80 text-white py-2 px-10 rounded-full mt-5">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>

          {/* Related Products */}
          <div className="grid grid-cols-3 lg:grid-cols-4 max-w-6xl  xl:mx-auto lg:mx-10 mx-5 py-10 md:py-20">
            {moreProduct.map((product) => (
              <div key={product._id} className="product-card rounded-xl group hover:bg-gray-100 md:p-4">
                <img
                  src={product.images[0] || "/placeholder-image.png"}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="object-cover lg:h-[200px] h-[120px] rounded-xl"
                />
                <div className="flex flex-col items-center justify-center text-xs mt-2">
                  <h2 className="md:text-lg font-bold">{product.name}</h2>
                  <p className="text-gray-700 md:text-base md:my-2 my-1">{product.price} BDT</p>
                  <Link href={`/etha/${product._id}`}>
                    <button className="bg-black text-white py-1 md:text-base px-4 rounded-full">
                      View Product
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default Page;
