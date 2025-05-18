import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileKey = searchParams.get('fileKey');

    if (!fileKey) {
      return NextResponse.json({ error: 'File key is required' }, { status: 400 });
    }

    const client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT_URL,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });

    const response = await client.send(new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileKey,
    }));

    if (!response.Body) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    let buffer: Buffer;
    if (response.Body instanceof Blob) {
      buffer = Buffer.from(await response.Body.arrayBuffer());
    } else {
      const chunks: Buffer[] = [];
      const stream = response.Body as unknown as AsyncIterable<Uint8Array>;

      for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
      }

      buffer = Buffer.concat(chunks);
    }

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename=${fileKey}`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
}
