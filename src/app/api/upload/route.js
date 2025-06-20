import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Determine if it's a PDF
    const isPDF = file.type === 'application/pdf';

    // Set the correct folder path
    const folder = isPDF ? 'notescafe/pdf' : 'notescafe/notes';

    // Create form data for Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('upload_preset', 'notescafe');
    cloudinaryFormData.append('folder', folder);

    // Log the upload configuration
    console.log('Uploading to Cloudinary:', {
      folder,
      fileType: file.type,
      fileName: file.name,
      isPDF,
    });

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData,
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Cloudinary upload failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      throw new Error(`Failed to upload to Cloudinary: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Upload successful:', {
      url: data.secure_url,
      resourceType: data.resource_type,
      format: data.format,
      public_id: data.public_id,
    });

    // For PDFs, construct the delivery URL directly
    const finalUrl = isPDF
      ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v${data.version}/${data.public_id}.pdf`
      : data.secure_url;

    return NextResponse.json({
      url: finalUrl,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: error.message || 'Error uploading file' },
      { status: 500 }
    );
  }
}
