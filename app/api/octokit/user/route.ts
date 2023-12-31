import { NextRequest, NextResponse } from 'next/server';
import { init } from '@/app/api/lib/init';

type Cookie = {
    name: string;
    value: string;
};

const options = {
    status: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
};

export async function POST(req: NextRequest) {
    const { value: token } = req.cookies.get('token') as Cookie;
    // const { value: refreshToken } = req.cookies.get('refreshToken') as Cookie;
    const octokit = await init({ token });

    try {
        const { data } = await octokit.request('GET /user');

        const response = NextResponse.json(data, options);

        return response;
    } catch (error) {
        const response = NextResponse.json({ error }, options);

        return response;
    }
}
