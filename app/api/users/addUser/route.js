import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import bcryptjs from 'bcryptjs'
const { LoginInfo } = require('@/lib/modals/user');

connect()
export const POST = async (req, res) => {
    const { userName, password, role } = await req.json();
    const existingUser = await LoginInfo.findOne({ userName });
    if (existingUser) {
      return NextResponse.json({ error: "User Already Exists!!" }, {status: 400});
    }
    const hashedPassword = await bcryptjs.hash(password, 4);
    const user = new LoginInfo({
      userName,
      password: hashedPassword,
      role,
    });
    try {
        await user.save()
        return NextResponse.json({ success: "User is Added!!" }, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: error }, {status: 500});
    }
}