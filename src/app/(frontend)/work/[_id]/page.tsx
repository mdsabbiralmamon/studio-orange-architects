"use client";

import Footer from '@/components/frontend/shared/Footer/Footer';
import Navbar from '@/components/frontend/shared/Navbar/Navbar';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { GrFormPreviousLink, GrFormNextLink } from 'react-icons/gr';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import Image from 'next/image';
import type { Swiper as SwiperType } from 'swiper';
import { PropagateLoader } from 'react-spinners';
import PageTitle from '@/components/PageTitle/PageTitle';

interface Project {
  details: {
    AppointmentYear: string;
    CompletionYear: string;
    Client: string;
    Location: string;
  };
  _id: string;
  title: string;
  category: string;
  cover: {
    url: string;
    alt: string;
    name: string;
    _id: string;
  };
  images: Array<{
    url: string;
    alt: string;
    name: string;
    _id: string;
  }>;
  description: string;
  mapLocation: string;
}

const SingleProject = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [showPrevIcon, setShowPrevIcon] = useState(false);
  const [showNextIcon, setShowNextIcon] = useState(false);

  const { _id } = useParams();

  useEffect(() => {
    if (_id) {
      axios.get(`/api/projects/single/${_id}`) //
        .then((response) => {
          setProject(response?.data?.project);
        })
        .catch((error) => console.error('Error fetching project data:', error));
    }
  }, [_id]);

  if (!project) {
    return <div className='w-full h-screen flex items-center justify-center'><PropagateLoader color="#c0c0c0" /></div>;
  }

  const sliderImages = project?.images;
  const details = project?.details

  const handlePrevClick = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  const handleNextClick = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  return (
    <div className='h-screen'>
      <PageTitle title={`${project ? project?.title : "Work"}`} />
      <Navbar />
      <style jsx global>{`
        .cursor-prev {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='15 18 9 12 15 6'%3E%3C/polyline%3E%3C/svg%3E") 16 16, auto;
        }
        .cursor-next {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='9 18 15 12 9 6'%3E%3C/polyline%3E%3C/svg%3E") 16 16, auto;
        }
      `}</style>
      <div className="container mx-auto w-full relative group">
        {/* Navigation Overlay Zones */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div
            className="absolute left-0 w-1/2 h-full pointer-events-auto cursor-prev flex items-center justify-start px-4"
            onClick={handlePrevClick}
            onMouseEnter={() => setShowPrevIcon(true)}
            onMouseLeave={() => setShowPrevIcon(false)}
          >
            <GrFormPreviousLink
              className={`text-3xl text-white transition-opacity duration-300 block lg:hidden ${showPrevIcon ? 'opacity-50' : 'opacity-0'
                }`}
            />
          </div>
          <div
            className="absolute right-0 w-1/2 h-full pointer-events-auto cursor-next flex items-center justify-end px-4"
            onClick={handleNextClick}
            onMouseEnter={() => setShowNextIcon(true)}
            onMouseLeave={() => setShowNextIcon(false)}
          >
            <GrFormNextLink
              className={`text-3xl text-white transition-opacity duration-300 block lg:hidden ${showNextIcon ? 'opacity-50' : 'opacity-0'
                }`}
            />
          </div>
        </div>

        <Swiper
          onSwiper={setSwiperInstance}
          slidesPerView={1}
          loop={true}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          navigation={false}
          modules={[Pagination, Navigation, Autoplay]}
          className="mySwiper"
        >
          {sliderImages?.map((image) => (
            <SwiperSlide key={image._id}>
              <Image
                width={1920}
                height={1080}
                src={image.url}
                alt={image.alt}
                className="object-cover h-[400px] md:h-[500px] lg:h-[700px] w-full"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Project details */}
      <div className="max-w-5xl lg:mx-auto mx-10 py-10">
        <div>
          <div>
            <h1 className='text-5xl font-thin'>{project?.title}</h1>
          </div>
          <div className='grid md:grid-cols-4 grid-cols-2 mt-8'>
            <div>
              {
                details?.AppointmentYear ? <div className='mt-2'>{/*mr-5 lg:mr-10*/}
                  <h1 className='font-normal text-xl lg:text-2xl'>Appointment Year</h1>
                  <h1 className='font-thin text-sm'>{details?.AppointmentYear}</h1>
                </div> : <></>
              }
            </div>
            <div>
              {
                details?.CompletionYear ? <div className='mt-2'>
                  <h1 className='font-normal text-xl lg:text-2xl'>Completion Year</h1>
                  <h1 className='font-thin text-sm'>{details?.CompletionYear}</h1>
                </div> : <></>
              }
            </div>
            <div>
              {
                details?.Client ? <div className='mt-2'>
                  <h1 className='font-normal text-xl lg:text-2xl'>Client Name</h1>
                  <h1 className='font-thin text-sm'>{details?.Client}</h1>
                </div> : <></>
              }
            </div>
            <div>
              {
                details?.Location ? <div className='mt-2'>
                  <h1 className='font-normal text-xl lg:text-2xl'>Location</h1>
                  <h1 className='font-thin text-sm'>{details?.Location}</h1>
                </div> : <></>
              }
            </div>
          </div>

          <div className='mt-10'>
            <p className='text-lg'>{project?.description}</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SingleProject;