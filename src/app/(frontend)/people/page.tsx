"use client";

// import Image from "next/image";
import Footer from "@/components/frontend/shared/Footer/Footer";
import Navbar from "@/components/frontend/shared/Navbar/Navbar";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import PageTitle from '@/components/PageTitle/PageTitle'
// Import required Swiper modules
import { Autoplay, Pagination } from "swiper/modules";

// Interface for People data
interface Person {
  _id: string;
  name: string;
  role: string;
  image: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Interface for OfficeGallery data
interface OfficeGallery {
  _id: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Interface for GeneralGallery data
interface GeneralGallery {
  _id: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
const Page: React.FC = () => {
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");
  const [peoples, setPeoples] = useState<Person[]>([]);
  const [officeGalleries, setOfficeGalleries] = useState<OfficeGallery[]>([]);
  const [generalGalleries, setGeneralGalleries] = useState<GeneralGallery[]>([]);

  // Fetch gallery images
  useEffect(() => {
    axios
      .get(`/api/gallery/general`)
      .then((response) => {
        setGeneralGalleries(response.data.galleries);
      })
      .catch((error) => console.error("Error fetching gallery images:", error));
  }, []);

  // Fetch office galleries
  useEffect(() => {
    axios
      .get(`/api/gallery/office`)
      .then((response) => {
        setOfficeGalleries(response.data.galleries);
      })
      .catch((error) => console.error("Error fetching office galleries:", error));
  }, []);

  // Fetch people data
  useEffect(() => {
    axios
      .get(`/api/people`)
      .then((response) => {
        setPeoples(response.data.people);
      })
      .catch((error) => console.error("Error fetching people data:", error));
  }, []);

  const openLightbox = (imageSrc: string) => {
    setLightboxImage(imageSrc);
    setLightboxVisible(true);
  };

  const closeLightbox = () => {
    setLightboxVisible(false);
  };

  const renderImages = (images: string[], row: string) => {
    return (
      <div className={`grid ${row}`}>
        {images?.map((src, index) => (
          <div
            key={index}
            className="cursor-pointer overflow-hidden"
            onClick={() => openLightbox(src)}
          >
            <img
              width={1000}
              height={1000}
              src={src} // src should be the URL string
              alt={`Gallery image ${index + 1}`}
              className="transition-all object-cover ease-in-out mx-auto w-full h-full"
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <PageTitle title="People" />
      <Navbar />
      <div className="space-y-24 pt-10 pb-20">
        {/* office section */}
        <section className="">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid gap-10 lg:grid-cols-3 flex flex-col-reverse justify-between items-center">
              <div className="col-span-2 w-full rounded-xl">
                <Swiper
                  slidesPerView={1}
                  spaceBetween={30}
                  loop={true}
                  pagination={{
                    clickable: true,
                  }}
                  autoplay={{
                    delay: 1500,
                    disableOnInteraction: false,
                  }}
                  modules={[Pagination, Autoplay]}
                  className="mySwiper h-[300px] md:h-[500px] w-full"
                >
                  {officeGalleries.map((gallery, index) =>
                    gallery.images.map((imageSrc, imageIndex) => (
                      <SwiperSlide key={`${index}-${imageIndex}`}>
                        <img
                          width={1000}
                          height={1000}
                          alt={`Gallery image ${imageIndex + 1}`}
                          src={imageSrc}
                          className="w-full h-full object-cover"
                        />
                      </SwiperSlide>
                    ))
                  )}
                </Swiper>

              </div>
              <div className="w-full">
                <h2 className="font-manrope text-xl lg:text-5xl text-gray-900 font-thin mb-4 text-center lg:text-left">
                  Our Space, Your Inspiration
                </h2>
                <p className="text-lg text-gray-500 text-center lg:text-left">
                  A creative environment affects what happens within it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team section */}
        <section className="max-w-6xl mx-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center py-4">
              <h2 className="font-manrope text-5xl font-thin text-gray-900">
                Meet the Minds
              </h2>
              <p className="text-lg text-gray-500 mt-3 text-center">
                Strength in unity, success in synergy
              </p>
            </div>
            <div className="md:flex justify-evenly items-center md:space-x-4 space-y-4 w-full">
              {peoples
                ?.filter((person) => person.category === "Director")
                ?.map((person, index) => (
                  <div key={index} className="block cursor-pointer group lg:col-span-1">
                    <div className="relative mb-6">
                      <img
                        width={1000}
                        height={1000}
                        src={person.image}
                        alt={`${person.name} image`}
                        className="w-40 h-40 mx-auto transition-all duration-500 object-cover"
                      />
                    </div>
                    <h4 className="text-xl font-semibold mb-2 capitalize text-center transition-all duration-500 text-gray-900">
                      {person.name}
                    </h4>
                    <span className="text-center block transition-all duration-500 text-gray-500 group-hover:text-gray-900">
                      {person.role}
                    </span>
                  </div>
                ))}
            </div>

            <div className="max-w-4xl mx-auto grid md:grid-cols-3 grid-cols-2 justify-center gap-6 mt-20">
              {/* Engineer */}
              {peoples
                .filter((person) => person.category === "Engineer")
                ?.map((person, index) => (
                  <div key={index} className="block cursor-pointer group lg:col-span-1">
                    <div className="relative mb-6">
                      <img
                        width={1000}
                        height={1000}
                        src={person.image}
                        alt={`${person.name} image`}
                        className="w-40 h-40 mx-auto transition-all duration-500 object-cover"
                      />
                    </div>
                    <h4 className="text-xl font-semibold mb-2 capitalize text-center transition-all duration-500 text-gray-900">
                      {person.name}
                    </h4>
                    <span className="text-center block transition-all duration-500 text-gray-500 group-hover:text-gray-900">
                      {person.role}
                    </span>
                  </div>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center gap-4 mt-20">
              {/* Marketing */}
              {peoples
                .filter((person) => person.category === "Marketing")
                ?.map((person, index) => (
                  <div key={index} className="block cursor-pointer group lg:col-span-1">
                    <div className="relative mb-6">
                      <img
                        width={1000}
                        height={1000}
                        src={person.image}
                        alt={`${person.name} image`}
                        className="w-40 h-40 mx-auto transition-all duration-500 object-cover"
                      />
                    </div>
                    <h4 className="text-xl font-semibold mb-2 capitalize text-center transition-all duration-500 text-gray-900">
                      {person.name}
                    </h4>
                    <span className="text-center block transition-all duration-500 text-gray-500 group-hover:text-gray-900">
                      {person.role}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* gallery section */}
        <section className="max-w-5xl mx-auto">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-2.5 lg:pb-16 pb-10">
              <h2 className="w-full text-center text-gray-900 text-4xl font-thin font-manrope leading-normal">
                Our Gallery
              </h2>
              <div className="w-full text-center text-gray-600 text-lg font-normal leading-8">
                Step into a realm where art comes to life.
              </div>
            </div>
            <div className="gallery gap-2">
              {/* Map through officeGalleries and extract the images array */}
              {renderImages(
                generalGalleries.flatMap((gallery) => gallery.images), // Flatten the array of image URLs
                "grid-cols-2 md:grid-cols-4 gap-1"
              )}
            </div>

          </div>
          {lightboxVisible && (
            <div
              className="lightbox fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-80"
              onClick={closeLightbox}
            >
              <span
                className="close text-white text-3xl absolute top-5 right-8 cursor-pointer"
                onClick={closeLightbox}
              >
                &times;
              </span>
              <img
                width={1000}
                height={1000}
                src={lightboxImage}
                alt="Lightbox"
                className="lightbox-image max-w-full max-h-full"
              />
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Page;
