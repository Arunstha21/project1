import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import { dcryptToken } from '@/app/helpers/dcryptToken';
const { LoginInfo } = require('@/lib/modals/user');

connect();

export const POST = async (req, res) => {
    const userId = await dcryptToken(req);
    const user = await LoginInfo.findById(userId).select('-password -createdAt -updatedAt -__v');

    return NextResponse.json(user)
}