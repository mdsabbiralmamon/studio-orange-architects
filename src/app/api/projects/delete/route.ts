import path from 'path';
import { promises as fs } from 'fs';
import connectDB from '@/lib/db/config/database';
import Project from '@/lib/db/models/Project';
import { NextRequest, NextResponse } from 'next/server';

export const DELETE = async (req: NextRequest) => {
  try {
    await connectDB();

    // Extract the project ID from query parameters
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('id');

    if (!projectId) {
      return NextResponse.json({
        success: false,
        message: 'Project ID is required.',
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({
        success: false,
        message: 'Project not found.',
      });
    }

    // Delete associated files
    const deleteFile = async (fileUrl: string) => {
      // Log the fileUrl to inspect its value
      console.log('fileUrl:', fileUrl);

      // Ensure fileUrl is a string and not a MongoDB document
      if (typeof fileUrl !== 'string') {
        console.error('Invalid fileUrl type:', fileUrl);
        return;
      }

      const filePath = path.join(process.cwd(), 'public', fileUrl);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.warn(`Failed to delete file: ${filePath}`, error);
      }
    };

    // Delete cover image
    if (project.cover) {
      await deleteFile(project.cover);
    }

    // Delete additional images
    if (project.images && project.images.length > 0) {
      for (const image of project.images) {
        await deleteFile(image);
      }
    }

    // Remove the project from the database
    await project.deleteOne();

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({
      success: false,
      message: 'Server Error',
    });
  }
};
