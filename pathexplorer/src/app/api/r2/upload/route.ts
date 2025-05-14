// app/api/r2/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function POST(request: NextRequest) {
  console.log('🔍 UPLOAD ROUTE HANDLER TRIGGERED');
  console.log('📌 Request URL:', request.url);

  try {
    console.log('⏳ Attempting to parse form data...');
    const formData = await request.formData();

    const file = formData.get('file') as File;
    const employeeId = formData.get('employeeId') as string;

    console.log('📋 Form data received:', {
      fileExists: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      employeeId,
    });

    if (!file || !employeeId) {
      console.log('❌ Missing required fields:', { fileExists: !!file, employeeId: !!employeeId });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate unique file key
    const timestamp = Date.now();
    const fileKey = `cv_${employeeId}_${timestamp}.pdf`;
    console.log('🔑 Generated file key:', fileKey);

    // Convert file to buffer
    console.log('🔄 Converting file to buffer...');
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log('✅ Buffer created, size:', buffer.length);

    console.log('🔌 Initializing S3 client with:', {
      endpoint: process.env.R2_ENDPOINT_URL?.substring(0, 20) + '...',
      bucketName: process.env.R2_BUCKET_NAME,
      hasAccessKey: !!process.env.R2_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.R2_SECRET_ACCESS_KEY,
    });

    const client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT_URL,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });

    console.log('📤 Sending PutObjectCommand to R2...');
    await client.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileKey,
      Body: buffer,
      ContentType: 'application/pdf',
    }));

    console.log('🎉 File successfully uploaded to R2!');
    return NextResponse.json({ fileKey });
  } catch (error) {
    console.error('❌ R2 upload error:', error);
    console.error('Error details:', {
      name: (error as Error)?.name,
      message: (error as Error)?.message,
      stack: (error as Error)?.stack,
    });
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
