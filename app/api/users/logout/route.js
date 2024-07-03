import { NextResponse } from 'next/server';
import connect from '@/lib/db';

connect();

export const POST = async (req, res) => {
    try {
        const response = NextResponse.json({
            success: "Logged Out Successfully !!"
        }, {status: 200})

        response.cookies.set('token', "", {httpOnly: true, expires: new Date(0)})

        return response
    } catch (error) {
        return NextResponse.json({error: err.message}, {status: 500})
    }
}