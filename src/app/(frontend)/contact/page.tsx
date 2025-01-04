"use client";

import Footer from "@/components/frontend/shared/Footer/Footer";
import Navbar from "@/components/frontend/shared/Navbar/Navbar";
import { IoCallOutline } from "react-icons/io5";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CiLocationOn, CiMail } from "react-icons/ci";
import PageTitle from "@/components/PageTitle/PageTitle";
import axios from "axios";


interface info {
    contactNumber: string;
    email: string;
    mapLocation: string;
    description: string;
}
const Page = () => {

    const [siteInfo, setSiteInfo] = useState<info>();

    useEffect(() => {
        axios
            .get(`/api/manage-site`)
            .then((res) => {
                const info = res?.data?.siteInfo;
                setSiteInfo(info);
            })
            .catch((err) => {
                console.error('Error fetching navbar images:', err);
            });
    }, []);

    return (
        <>
            <PageTitle title="Studio" />
            <Navbar />
            <div className="max-w-7xl lg:mx-auto mx-4 sm:mx-4 my-10 h-full h-screen">
                <div className="grid lg:grid-cols-2 grid-cols-1">
                    {/* Left Section - Map and Contact Details */}
                    <div className="lg:mb-0 mb-10">
                        <div className="group w-full">
                            <div className="relative">
                                {/* Map container */}
                                <div className="w-full relative h-[400px] lg:h-[500px]">
                                    <iframe
                                        src={siteInfo?.mapLocation}
                                        style={{ width: "100%", height: "100%", border: "0" }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                                <div className="absolute bottom-0 w-full lg:p-11 p-5">
                                    <div className="bg-white rounded-lg p-6 block text-black">
                                        <Link href="javascript:;" className="flex items-center mb-6">
                                            <IoCallOutline className="text-[20px]" />
                                            <h5 className="text-base font-normal leading-6 ml-5">
                                                {siteInfo?.contactNumber}
                                            </h5>
                                        </Link>
                                        <div className="flex items-center mb-6">
                                            <CiMail className="text-[20px]" />
                                            <h5 className="text-base font-normal leading-6 ml-5">
                                                {siteInfo?.email}
                                            </h5>
                                        </div>
                                        <Link
                                            href="https://maps.app.goo.gl/NqBgBvhxBJf7G7DW9"
                                            target="blank"
                                            className="flex items-center blank"
                                        >
                                            <CiLocationOn className="text-3xl md:text-2xl" />
                                            <h5 className="text-base font-normal leading-6 ml-5">
                                                {siteInfo?.description}
                                            </h5>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*Contact Form */}
                    <div className="bg-gray-50 px-5 lg:px-11 lg:rounded-r-2xl rounded-2xl">
                        <h2 className="text-indigo-600 text-4xl font-thin mb-11">
                            Send Us A Message
                        </h2>
                        <form
                            action={process.env.NEXT_AUTH_PUBLIC_EMAIL}
                            className="space-y-5"
                            target="_top"
                            method="POST"
                        >
                            <div className="flex flex-col space-y-2">
                                <label className="text-xl" >Your Name</label>
                                <input className="py-1 px-4 border border-gray-500 rounded-xl" type="text" name="Name" required />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label className="text-xl">Subject</label>
                                <input className="py-1 px-4 border border-gray-500 rounded-xl" type="text" id="email" name="Subject" required />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label className="text-xl">Email</label>
                                <input className="py-1 px-4 border border-gray-500 rounded-xl" type="email" id="email" name="Email" required />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label className="text-xl">Message</label>
                                <textarea
                                    className="py-1 px-4 border border-gray-500 rounded-xl"
                                    id="message"
                                    name="Message"
                                    required
                                ></textarea>
                            </div>
                            <div className="fs-button-group">
                                <button className="text-white bg-black py-1 px-4 rounded-full" type="submit" value="send">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Page;
