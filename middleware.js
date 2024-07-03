import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
const jwtSecretKey = new TextEncoder().encode(process.env.JWT_KEY);

const checkToken = async (req) => {
    try {
        const token = req.cookies.get('token')?.value || '';
        const { payload } = await jwtVerify(token, jwtSecretKey);
        return { valid: true, payload };
    } catch (error) {
        return { valid: false, expired: error.code === 'ERR_JWT_EXPIRED' };
    }
};


export async function middleware(request) {
    const path = request.nextUrl.pathname;
    if (path === '/api/users/login') {
        return NextResponse.next();
    }
    const isPublicPath = path === '/';
    const tokenCheck = await checkToken(request);

    if (typeof tokenCheck === 'object' && !tokenCheck.valid && tokenCheck.expired) {
        const response = NextResponse.redirect(new URL('/', request.url));
        response.cookies.delete('token');
        return response;
    }

    const token = tokenCheck.valid;

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/api/members/:path*',
        '/api/users/:path*',
        '/dashboard/:path*',
        '/'
    ]
};
