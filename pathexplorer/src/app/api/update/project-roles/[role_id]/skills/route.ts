import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { role_id: string } },
) {
  try {
    const roleId = params.role_id;
    const searchParams = request.nextUrl.searchParams;
    const skillName = searchParams.get('skill_name');

    if (!skillName) {
      return NextResponse.json(
        { error: 'Missing skill_name parameter' },
        { status: 400 },
      );
    }

    const requestBody = await request.json();

    const formattedPayload = {
      skill_name: requestBody.skill_name ? requestBody.skill_name.trim() : '',
      level: typeof requestBody.level === 'number' ? requestBody.level : Number(requestBody.level),
      type: requestBody.type,
    };

    console.log('Formatted payload:', formattedPayload);

    const authHeader = request.headers.get('Authorization');

    const apiUrl = `https://pathexplorer.vercel.app/project-roles/${roleId}/skills/?skill_name=${encodeURIComponent(skillName)}`;
    console.log('Forwarding request to:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '',
      },
      body: JSON.stringify(formattedPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API error:', response.status, errorText);

      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(errorData, { status: response.status });
      } catch (e) {
        return NextResponse.json(
          { error: errorText || `Error: ${response.status}` },
          { status: response.status },
        );
      }
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Route handler error:', error);
    return NextResponse.json(
      { error: 'Failed to process the request' },
      { status: 500 },
    );
  }
}
