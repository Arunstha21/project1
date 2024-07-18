import { NextResponse } from 'next/server';
import connect from '@/lib/db';
const { LoginInfo } = require('@/lib/modals/user');

export const GET = async (req, res) => {
    try {
        await connect();
        const users = await LoginInfo.find({}, '-password');
    
        return NextResponse.json(users, {status: 200})
      } catch (err) {
        return NextResponse.json({error: err.message}, {status: 500})
      }
}