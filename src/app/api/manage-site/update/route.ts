import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/config/database';
import SiteInfo from '@/lib/db/models/SiteInfo';

export const PUT = async (req: NextRequest) => {
  try {
    await connectDB();

    const formData = await req.json();
    const {
      name,
      description,
      contactNumber,
      email,
      mapLocation,
      social,
      logo,
      studioImages,
      navbarImages,
    } = formData;

    if (!name || !description || !contactNumber || !email || !mapLocation) {
      return NextResponse.json({
        success: false,
        message: 'Please fill in all required fields.',
      });
    }

    const siteInfo = await SiteInfo.findOne();
    if (!siteInfo) {
      return NextResponse.json({
        success: false,
        message: 'Site info not found.',
      });
    }

    siteInfo.name = name;
    siteInfo.description = description;
    siteInfo.contactNumber = contactNumber;
    siteInfo.email = email;
    siteInfo.mapLocation = mapLocation;
    siteInfo.social = social;
    siteInfo.logo = logo;
    siteInfo.studioImages = studioImages;
    siteInfo.navbarImages = navbarImages;

    await siteInfo.save();

    return NextResponse.json({
      success: true,
      message: 'Site updated successfully!',
      siteInfo,
    });
  } catch (error) {
    console.error('Error updating site info:', error);
    return NextResponse.json({
      success: false,
      message: 'Error updating site. Please try again later.',
    });
  }
};
