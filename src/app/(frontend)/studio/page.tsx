"use client";

import Footer from '@/components/frontend/shared/Footer/Footer';
import Navbar from '@/components/frontend/shared/Navbar/Navbar';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import PageTitle from '@/components/PageTitle/PageTitle';



const Page = () => {

    const [studioImage, SetStudioImage] = useState<string[]>([]);

    useEffect(() => {
        const fetchSiteInfo = async () => {
            try {
                const res = await fetch('/api/manage-site');
                const data = await res.json();

                if (data.success && data.siteInfo) {
                    SetStudioImage(data.siteInfo.studioImages);
                    // console.log(data.siteInfo.studioImages);
                } else {
                    alert('Failed to fetch site info.');
                }
            } catch (error) {
                console.error('Error fetching site info:', error);
            }
        };

        fetchSiteInfo();
    }, []);

    //   console.log(studioImage);

    return (
        <>
            <PageTitle title="Studio" />
            <Navbar />
            <div className='min-h-screen px-6 md:px-10 lg:px-20 xl:px-36 pt-5 pb-10'>
                <div className='pb-[20px] md:pb-10 grid md:grid-cols-2 grid-cols-1 gap-4'>
                    <Image
                        width={1000}
                        height={600}
                        src={studioImage.length > 0 ? studioImage[0] : "/blank-image.jpg"}
                        alt='Studio Image 1'
                        className='mx-auto h-full'
                    />
                    <div className='space-y-4 justify-center inline-flex flex-col'>
                        <h1 className='xl:text-5xl md:text-3xl font-thin text-2xl'>Who We Are</h1>
                        <p className='xl:text-lg lg:text-base md:text-[15px] text-sm'>
                            Welcome to Studio Orange Architects (SOA), a multidisciplinary design platform where creativity meets purpose.
                            We are a collective of visionaries, designers, and storytellers, passionate about shaping environments,
                            experiences, and ideas that inspire.
                        </p>
                    </div>
                </div>

                <div className='py-[20px] md:py-10 grid md:grid-cols-2 grid-cols-1 gap-4'>
                    <div className='space-y-4 justify-center inline-flex flex-col'>
                        <h1 className='xl:text-5xl md:text-3xl font-thin text-2xl'>Our Philosophy</h1>
                        <p className='xl:text-lg lg:text-base md:text-[15px] text-sm'>
                            We approach every project with a timeless sense of design, deeply rooted in local traditions,
                            societal needs, and cultural contexts. Our aim is to create spaces and experiences that resonate
                            with people from all walks of life, designs that are as functional as they are meaningful.
                            <br />
                            <br />
                            As a platform, we celebrate diversity in all its forms. From artists and architects to musicians
                            and makers, we bring together a vibrant community of talent, embracing collaboration across
                            disciplines to create something greater than the sum of its parts.
                        </p>
                    </div>
                    <Image
                        width={1000}
                        height={600}
                        src={studioImage.length > 0 ? studioImage[1] : "/blank-image.jpg"}
                        alt="Studio Image 1"
                        className="mx-auto h-full"
                    />
                </div>

                <div className='py-[20px] md:py-10 space-y-4'>
                    <h1 className='xl:text-5xl md:text-3xl font-thin text-2xl'>Our Motto</h1>
                    <p className='text-lg italic'>&quot;Designing for today. Connecting with tomorrow. Timeless by design.&quot;</p>
                </div>

                <div className='py-[20px] md:py-10 space-y-4'>
                    <h1 className='xl:text-5xl md:text-3xl font-thin text-2xl'>Our Goals</h1>
                    <ul className='list-disc ml-5 xl:text-lg lg:text-base md:text-[15px] text-sm'>
                        <li>To craft meaningful designs that connect with local cultures and global audiences.</li>
                        <li>To build a vibrant platform that bridges the gap between disciplines, fostering innovation and creativity.</li>
                        <li>To champion diversity by collaborating with a wide range of artists and thinkers from various fields.</li>
                        <li>To create spaces, products, and experiences that inspire and uplift communities.</li>
                        <li>To continuously evolve, staying true to our philosophy while adapting to the future.</li>
                    </ul>
                </div>

                <div>
                    <p>
                        With SOA, the possibilities are endless. Let&apos;s shape a world that&apos;s not just designed to be seen but to be felt, experienced, and remembered.
                    </p>

                </div>
            </div>
            <Footer />
        </>
    );
};

export default Page;
