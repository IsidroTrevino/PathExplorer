// src/app/api/curriculum/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employee_id');

    // Get the authorization header from the incoming request
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
    }

    // Forward the request to the external API with the authorization header
    const response = await fetch(
      `https://pathexplorer.vercel.app/curriculum/?employee_id=${employeeId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `External API returned ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Curriculum proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileKey = searchParams.get('curriculum');
    const employeeId = searchParams.get('employee_id');

    // Get the authorization header from the incoming request
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
    }

    // Forward the request to the external API with the authorization header
    const response = await fetch(
      `https://pathexplorer.vercel.app/curriculum/?curriculum=${fileKey}&employee_id=${employeeId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `External API returned ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Curriculum proxy error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
