import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employee_id');

    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
    }

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
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileKey = searchParams.get('curriculum');
    const employeeId = searchParams.get('employee_id');

    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
    }

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
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employee_id');

    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
    }

    if (!employeeId) {
      return NextResponse.json({ error: 'employee_id is required' }, { status: 400 });
    }

    const externalApiUrl = `https://pathexplorer.vercel.app/curriculum/?employee_id=${employeeId}`;

    const response = await fetch(
      externalApiUrl,
      {
        method: 'DELETE',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      return NextResponse.json(
        { error: `Failed to delete curriculum data (status: ${response.status})` },
        { status: response.status },
      );
    }

    const contentLength = response.headers.get('content-length');
    const contentType = response.headers.get('content-type');

    if (!contentLength || parseInt(contentLength) === 0 || !contentType?.includes('application/json')) {
      return NextResponse.json({ success: true });
    }

    try {
      const data = await response.json();
      return NextResponse.json(data);
    } catch (parseError) {
      return NextResponse.json({ success: true });
    }

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to delete curriculum data',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
