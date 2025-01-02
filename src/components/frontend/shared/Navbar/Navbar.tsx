import React, { useState, useEffect } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import Image from 'next/image';
import Link from 'next/link';
import { RxCross1 } from 'react-icons/rx';
import { CiFacebook, CiInstagram } from 'react-icons/ci';
import { AiOutlineMenu } from "react-icons/ai";
import { FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import axios from 'axios';
import SearchBar from '@/components/frontend/shared/Navbar/(SearchBar)/SearchBar';

interface NavbarProps {
    textClass?: string;
}

interface NavImages {
    Studio: { image: string };
    Work: { image: string };
    Product: { image: string };
    People: { image: string };
    Journal: { image: string };
    Contact: { image: string };
}

interface Social {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    twitter: string;
}

const Navbar: React.FC<NavbarProps> = ({ textClass }) => {
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [socialLinks, setSocialLinks] = useState<Social>();
    const [navImages, setNavImages] = useState<NavImages>();

    useEffect(() => {
        axios.get(`/api/manage-site`)
            .then((res) => {
                setSocialLinks(res?.data?.siteInfo?.social);
                setNavImages(res?.data?.siteInfo?.navbarImages);
            })
            .catch((err) => console.error('Error fetching navbar images:', err));
    }, []);

    const defaultImage = "/defaultNavImage.jpg";

    const navLinks = [
        { title: 'Studio', href: '/studio', img: navImages?.Studio?.image },
        { title: 'Work', href: '/work', img: navImages?.Work?.image },
        { title: 'ETHA', href: '/etha', img: navImages?.Product?.image },
        { title: 'People', href: '/people', img: navImages?.People?.image },
        { title: 'Journal', href: '/journal', img: navImages?.Journal?.image },
        { title: 'Contact', href: '/contact', img: navImages?.Contact?.image },
    ];

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event?.type === 'keydown' && 
            ((event as React.KeyboardEvent).key === 'Tab' || 
             (event as React.KeyboardEvent).key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const list = () => (
        <Box sx={{ width: '100%', height: '100%' }} role="presentation">
            <div className="md:grid grid-cols-3 h-screen">
                <div className="col-span-2 hidden md:flex justify-center items-center bg-gray-100">
                    <Image
                        src={hoveredLink ? 
                            navLinks.find(link => link.title === hoveredLink)?.img || defaultImage : 
                            defaultImage}
                        alt={hoveredLink || 'Default'}
                        width={1920}
                        height={1080}
                        className="object-cover h-screen w-full duration-300"
                    />
                </div>
                <div className="h-screen w-full">
                    <div className="flex justify-end p-4">
                        <div onClick={() => setDrawerOpen(false)} 
                             className="text-black p-4 rounded-full hover:bg-black duration-300 hover:text-white">
                            <RxCross1 className="text-2xl duration-300 cursor-pointer" />
                        </div>
                    </div>
                    <div>
                        <ul className="flex text-center md:text-left md:px-6 lg:px-10 flex-col w-full">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.title}
                                    href={link.href}
                                    className="text-5xl font-thin w-full duration-300 text-black/30 hover:text-black hover:pl-6 pt-6"
                                    onMouseEnter={() => setHoveredLink(link.title)}
                                    onMouseLeave={() => setHoveredLink(null)}
                                >
                                    <li>{link.title}</li>
                                </Link>
                            ))}
                        </ul>

                        <div className='flex justify-center items-center pt-10 lg:p-10 font-bold text-lg lg:text-2xl space-x-6'>
                            <Link className="p-1 bg-gray-200 rounded-full" href={socialLinks?.facebook || '#'} target='blank'>
                                <CiFacebook />
                            </Link>
                            <Link className="p-1 bg-gray-200 rounded-full" href={socialLinks?.instagram || '#'} target='blank'>
                                <CiInstagram />
                            </Link>
                            <Link className="p-1 bg-gray-200 rounded-full" href={socialLinks?.linkedin || '#'} target='blank'>
                                <FaLinkedinIn />
                            </Link>
                            <Link className="p-1 bg-gray-200 rounded-full" href={socialLinks?.youtube || '#'} target='blank'>
                                <FaYoutube />
                            </Link>
                            <Link className="p-1 bg-gray-200 rounded-full" href={socialLinks?.twitter || '#'} target='blank'>
                                <FaXTwitter />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Box>
    );

    return (
        <header className="lg:px-16 px-4 bg-transparent flex flex-wrap items-center max-w-[1920px] mx-auto p-1">
            <div className="flex-1 flex justify-between items-center">
                <Link href="/" className={`text-4xl ${textClass} font-thin font-[family-name:var(--font-montserrat)]`}>
                    S<span className='font-[family-name:var(--font-josefin-sans)]'>OA</span>
                </Link>
            </div>

            <div className="flex items-center space-x-3">
                <SearchBar textClass={textClass} />
                
                <label onClick={() => setDrawerOpen(true)} 
                       className="cursor-pointer hover:bg-black group duration-300 hover:text-white p-5 rounded-full">
                    <AiOutlineMenu className={`fill-current ${textClass} pointer-cursor text-xl duration-300 font-bold`} />
                </label>
            </div>

            <SwipeableDrawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: '100%',
                        height: '100%',
                    },
                }}
            >
                {list()}
            </SwipeableDrawer>
        </header>
    );
};

export default Navbar;