"use client"
import Footer from '@/components/frontend/shared/Footer/Footer';
import Navbar from '@/components/frontend/shared/Navbar/Navbar';
// import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
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

    const [journals, setJournals] = useState<Journals[]>([]);
    const [loading, setLoading] = useState(true); // State to track loading

    useEffect(() => {
        axios
            .get(`/api/posts`)
            .then((response) => {
                const data = response?.data;
                setJournals(data?.posts);
            })
            .finally(() => {
                setLoading(false); // Stop loading when data is fetched
            });
    }, []);

    return (
        <div className='min-h-screen'>
            <PageTitle title="Journal" />
            <Navbar />
            <div className="max-w-7xl xl:mx-auto mx-8 h-full my-10">
                {loading ? (
                    <div className="w-full h-screen flex flex-col items-center justify-center text-center">
                        <PropagateLoader color="#c0c0c0" />
                    </div>
                ) : (
                    journals.length > 0 ? (
                        journals.map((journal) => {
                            const publishedDate = new Date(journal.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            });
                            return (
                                <div key={journal._id} className="mb-6">
                                    <div className="sm:grid grid-cols-5 bg-white rounded-xl overflow-hidden items-center gap-10">
                                        <img
                                            width={1920}
                                            height={1080}
                                            className="w-full h-full object-cover object-center transition duration-50 col-span-2 rounded-2xl"
                                            loading="lazy"
                                            alt={journal?.title || 'News image'}
                                            src={journal?.cover || '/placeholder.jpg'}
                                        />

                                        <div className="flex flex-col justify-between gap-1 items-start col-span-3 py-4 h-full">
                                            {publishedDate && <p className='text-gray-500'>{publishedDate}</p>}
                                            <p className="text-3xl font-thin">{journal.title}</p>
                                            <p className="text-gray-500 text-xs lg:text-base">
                                                <p>{journal?.description[0].slice(0, 400)}</p>
                                            </p>
                                            <Link href={`/journal/${journal._id}`}>
                                                <button className="mt-4 py-2 px-6 rounded-full bg-blue-500 text-white text-xs hover:bg-blue-600">
                                                    Read more...
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-500">No journals available.</p>
                    )
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Page;
