import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { role_id: string } },
) {
  try {
    const roleId = params.role_id;
    const url = request.nextUrl;
    const skillName = url.searchParams.get('skill_name');
    if (!skillName) {
      return NextResponse.json({ error: 'Missing skill_name parameter' }, { status: 400 });
    }

    const body = await request.json();
    const payload = {
      skill_name: body.skill_name?.trim() ?? '',
      level: typeof body.level === 'number' ? body.level : Number(body.level),
      type: body.type,
    };

    const auth = request.headers.get('Authorization') ?? '';
    const apiUrl =
        `https://pathexplorer.vercel.app/project-roles/${roleId}/skills/` +
        `?skill_name=${encodeURIComponent(skillName)}`;

    const res = await fetch(apiUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: auth },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    if (!res.ok) {
      try {
        return NextResponse.json(JSON.parse(text), { status: res.status });
      } catch {
        return NextResponse.json({ error: text || `Error: ${res.status}` }, { status: res.status });
      }
    }

    return NextResponse.json(JSON.parse(text), { status: res.status });
  } catch (err) {
    console.error('Route handler error:', err);
    return NextResponse.json({ error: 'Failed to process the request' }, { status: 500 });
  }
}
