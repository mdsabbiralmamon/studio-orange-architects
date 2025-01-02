"use client";

import Footer from '@/components/frontend/shared/Footer/Footer';
import Navbar from '@/components/frontend/shared/Navbar/Navbar';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import PageTitle from '@/components/PageTitle/PageTitle'

interface Journals {
    _id: string;
    title: string;
    cover: string;
    description: string[]; // Array of strings for the description sections
    topic: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
}

const Page = () => {
    const { _id } = useParams();
    const [journal, setJournal] = useState<Journals | null>(null);
    const [latestJournals, setLatestJournals] = useState<Journals[]>([]); // State to store the latest 3 journals
    const [loading, setLoading] = useState(true); // State to track loading

    // Fetch single journal for the specific _id
    useEffect(() => {
        if (_id) {
            axios
                .get(`/api/posts/single/${_id}`)
                .then((response) => {
                    const data = response?.data;
                    setJournal(data?.post);
                })
                .catch((error) => console.error('Error fetching project data:', error))
                .finally(() => setLoading(false)); // Stop loading after fetching the journal
        }
    }, [_id]);

    // Fetch all journals and get the latest 3
    useEffect(() => {
        axios
            .get(`/api/posts`)
            .then((response) => {
                const data = response?.data;
                const posts = data?.posts || [];

                // Sort journals by createdAt in descending order and slice the first 3
                const sortedJournals = posts.sort((a: Journals, b: Journals) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                }).slice(0, 2);

                setLatestJournals(sortedJournals); // Set latest 3 journals
            })
            .catch((error) => console.error('Error fetching posts:', error));
    }, []);

    // Format the full date
    const publishedDate = journal?.createdAt
        ? new Date(journal.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : null;

    return (
        <>
            <PageTitle title={`${journal? journal?.title: "Journal"}`} />
            <Navbar />
            <div className='xl:max-w-7xl lg:max-w-5xl xl:mx-auto lg:mx-10 mx-5 mb-10 '>
                <div className="">
                    {/* Displaying single journal */}
                    {loading ? (
                        <div className="w-full h-screen flex flex-col items-center justify-center text-center">
                            <PropagateLoader color="#c0c0c0" />
                        </div>
                    ) : journal ? (
                        <>
                            <Image
                                width={1920}
                                height={1080}
                                src={journal.cover}
                                alt={journal.title}
                            />
                            <div className='lg:grid grid-cols-6 gap-6'>
                                <div className='col-span-4'>
                                    <h1 className='py-8 text-5xl'>{journal.title}</h1>
                                    {publishedDate && <p className='text-gray-500'>Published on: {publishedDate}</p>}
                                    {journal.description.map((desc, index) => (
                                        <p className='mt-8' key={index}>{desc}</p>
                                    ))}
                                </div>
                                <div className="mx-4 my-10 col-span-2">
                                    <h2 className="text-2xl font-bold">Latest Journals</h2>
                                    {/* Displaying the latest 3 journals */}
                                    <div className="lg:block md:flex md:justify-between flex-col space-y-4">
                                        {latestJournals.map((journal) => {
                                            const publishedDate = new Date(journal.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            });
                                            return (
                                                <div key={journal._id} className="bg-white p-4 rounded-lg shadow-lg">
                                                    <Image
                                                        width={1920}
                                                        height={1080}
                                                        src={journal.cover}
                                                        alt={journal.title}
                                                        className="w-full h-48 object-cover rounded-lg"
                                                    />
                                                    <h3 className="text-lg font-semibold mt-4">{journal.title}</h3>
                                                    <p className="text-sm text-gray-500">{publishedDate}</p>
                                                    <Link href={`/journal/${journal._id}`}>
                                                        <button className="mt-4 py-2 px-6 rounded-full bg-blue-500 text-white text-xs hover:bg-blue-600">
                                                            Read more...
                                                        </button>
                                                    </Link>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-gray-500">Journal not found.</p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Page;
