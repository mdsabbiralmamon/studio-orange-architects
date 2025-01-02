import Link from 'next/link';
import React from 'react';
import { CiFacebook, CiInstagram } from 'react-icons/ci';
import { FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
    return (
        <footer className="w-full p-14 bg-black">
            <div className="mx-auto text-gray-300  max-w-[1920px]">
                <div className=" md:grid grid-cols-2 flex flex-col mx-auto space-y-4 md:space-y-0">
                    <div className=''>
                        <Link href="/" className=" text-5xl text-gray-300 hover:text-white font-thin font-[family-name:var(--font-montserrat)]">
                            S<span className='font-[family-name:var(--font-josefin-sans)]'>OA</span>
                        </Link>
                        {/* <ul className="md:text-lg text-xs font-thin flex items-center flex-wrap flex-row transition-all duration-500 ">
                            <li><Link href="#" className="pr-2 md:pr-4 font-thin link text-gray-400 hover:text-white duration-150">Products</Link></li>
                            <li><Link href="#" className="pr-2 md:pr-4 font-thin link text-gray-400 hover:text-white duration-150">Resources</Link></li>
                            <li><Link href="#" className="pr-2 md:pr-4 font-thin link text-gray-400 hover:text-white duration-150">Blogs</Link></li>
                            <li><Link href="#" className="pr-2 md:pr-4 font-thin link text-gray-400 hover:text-white duration-150">Support</Link></li>
                            <li><Link href="#" className="pr-2 md:pr-4 font-thin link text-gray-400 hover:text-white duration-150">Pagedone</Link></li>
                        </ul> */}

                    </div>

                    {/* socials */}
                    <div className="flex h-full items-end space-x-10 lg:justify-end text-2xl ">
                        <Link className="p-1 rounded-full" href={'https://www.facebook.com/profile.php?id=61568416150416'} target='blank'>
                            <CiFacebook />
                        </Link>
                        <Link className="p-1 rounded-full" href={'https://www.instagram.com/studio_orange_architects'} target='blank'>
                            <CiInstagram />
                        </Link>
                        <Link className="p-1 rounded-full" href={'/'} target='blank'>
                            <FaLinkedinIn />
                        </Link>
                        <Link className="p-1 rounded-full" href={'/'} target='blank'>
                            <FaYoutube />
                        </Link>
                        <Link className="p-1 rounded-full" href={'/'} target='blank'>
                            <FaXTwitter />
                        </Link>
                    </div>
                    <span className="text-sm  text-gray-400 block "><Link href={'/'}>©SOA</Link> {new Date().getFullYear()}, All rights reserved. Developed by <Link className='font-semibold hover:text-white duration-150' href={'https://vexstack.com'}>VexStack</Link></span>
                </div>
            </div>
        </footer>

    );
};

export default Footer;