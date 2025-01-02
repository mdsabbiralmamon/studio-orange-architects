"use client";
import React, { useEffect, useState, useCallback } from "react";
import Footer from "@/components/frontend/shared/Footer/Footer";
import Navbar from "@/components/frontend/shared/Navbar/Navbar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import PageTitle from '@/components/PageTitle/PageTitle'
import Store from "@/components/Store/Store";

interface Product {
  _id: string;
  title: string;
  category: string;
  cover: {
    url: string;
    alt: string;
    name: string;
    _id: string;
  }
  images: string[];
  details: {
    AppointmentYear: string;
    CompletionYear: string;
    Client: string;
    Location: string;
  };
  description: string;
  "map-location": string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Page = () => {
  const [value, setValue] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [scrollLoading, setScrollLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  // console.log(displayedProducts);
  // console.log(products);


  const getProductsToShow = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1280) return 15;
    if (screenWidth >= 1024) return 12;
    if (screenWidth >= 768) return 9;
    return 6;
  };

  const categories = ["Architecture", "Interior", "Landscape"];

  useEffect(() => {
    axios
      .get(`/api/projects`)
      .then((response) => {
        console.log('API Response:', response.data); // Log full response

        const getProducts = response?.data?.projects.filter((p: Product) =>
          categories.includes(p.category)
        );

        console.log('Filtered Products:', getProducts); // Log filtered products

        setProducts(getProducts);
        setDisplayedProducts(getProducts.slice(0, getProductsToShow()));
        setPageLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error.message);
        setPageLoading(false);
      });
  }, []);



  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);

    // Don't filter products if we're on the Store tab
    if (newValue === 4) {
      setDisplayedProducts([]);
      setCurrentCategory(null);
      return;
    }

    let filteredProducts: Product[] = [];

    switch (newValue) {
      case 0: // All products
        filteredProducts = products;
        setCurrentCategory(null);
        break;
      case 1: // Woodwork
        filteredProducts = products.filter((p) => p.category === "Architecture");
        setCurrentCategory("Architecture");
        break;
      case 2: // Artwork
        filteredProducts = products.filter((p) => p.category === "Interior");
        setCurrentCategory("Interior");
        break;
      case 3: // ReCrafted
        filteredProducts = products.filter((p) => p.category === "Landscape");
        setCurrentCategory("Landscape");
        break;
    }

    setDisplayedProducts(filteredProducts.slice(0, getProductsToShow()));
  };

  const handleScroll = useCallback(() => {
    if (scrollLoading || pageLoading || value === 4) return; // Don't handle scroll for Store tab

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setScrollLoading(true);
      setTimeout(() => {
        const filteredProducts = currentCategory
          ? products.filter((p) => p.category === currentCategory)
          : products;

        const currentLength = displayedProducts.length;
        const nextLength = currentLength + getProductsToShow();
        setDisplayedProducts(filteredProducts.slice(0, nextLength));
        setScrollLoading(false);
      }, 2000);
    }
  }, [scrollLoading, pageLoading, displayedProducts, products, currentCategory, value]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const renderProducts = () => {
    if (value === 4) {
      return <Store />;
    }

    return (
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-20">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((Product) => (
            <Link key={Product._id} href={`/work/${Product._id}`}>
              <div className="relative group bg-gray-200 w-full h-full md:h-60 xl:h-96 overflow-hidden">
                <Image
                  width={1000}
                  height={1000}
                  alt={Product.title}
                  className="w-full h-full group-hover:h-64 xl:group-hover:h-96 object-cover transition-all delay-100 duration-500 ease"
                  src={Product?.cover?.url}
                />
                <div className="bg-black/70 w-full h-full absolute left-0 bottom-0 hidden group-hover:flex duration-500 transition-all delay-100">
                  <div className="p-6 h-full w-full">
                    <div className="capitalize flex flex-col items-center min-h-full gap-4 text-center justify-center">
                      <h2 className="text-white text-2xl font-thin">{Product?.title}</h2>
                      <p className="text-white">{Product?.details?.Location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center text-xl font-thin text-gray-500 py-10">
            No products found
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen">
      <PageTitle title={`ETHA`} />
      <Navbar />
      <div className="max-w-[1440px] xl:mx-auto lg:mx-16 md:mx-10 min-h-screen">
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              variant="scrollable"
              allowScrollButtonsMobile
              scrollButtons={true}
            >
              {["All", "Architecture", "Interior", "Landscape"].map((label, index) => (
                <Tab
                  key={label}
                  label={label}
                  {...a11yProps(index)}
                  sx={{
                    fontWeight: "100",
                    width: "auto",
                    minWidth: "auto",
                    fontSize: "small",
                    "@media (max-width: 640px)": {
                      fontSize: "0.65rem",
                    },
                  }}
                />
              ))}
            </Tabs>
          </Box>

          {pageLoading ? (
            <div className="text-center my-4">
              <span>Almost there...</span>
            </div>
          ) : (
            <CustomTabPanel value={value} index={value}>
              {renderProducts()}
            </CustomTabPanel>
          )}

          {scrollLoading && !pageLoading && value !== 4 && (
            <div className="text-center my-4">
              <span>Loading products...</span>
            </div>
          )}
        </Box>
      </div>
      <Footer />
    </div>
  );
};

export default Page;