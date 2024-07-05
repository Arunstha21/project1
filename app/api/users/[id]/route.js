import { NextResponse } from 'next/server';
import connect from '@/lib/db';
const { LoginInfo } = require('@/lib/modals/user');
import bcryptjs from 'bcryptjs'

export const GET = async (req, res) => {
    try {
        await connect();
        const userId = context.params.id;
        const users = await LoginInfo.findById(userId);
        if (!users) {
            return NextResponse.json({ error: "User not found" }, {status: 404})
          }
    
        return NextResponse.json(users, {status: 200})
      } catch (err) {
        return NextResponse.json({error: err.message}, {status: 500})
      }
}


export const PUT = async (req, context) => {
    try {
      await connect();
        const usersData = await req.json();
        const user = await LoginInfo.findById(context.params.id);
    
        if (!user) {
          return NextResponse.json({ error: "user not found" }, {status: 404})
        }
        const hashedPassword = await bcryptjs.hash(usersData.password, 4);
    
        user.userName = usersData.userName || user.userName;
        user.password = hashedPassword || user.password;
        user.role = usersData.role || user.role;
        user.status = usersData.status || user.status;
    
        const updatedUser = await user.save();

        return NextResponse.json(updatedUser, {status: 200})
      } catch (err) {
        return NextResponse.json({error: err.message}, {status: 500})
      }
}

export const DELETE = async (req, context) => {
    try {
      await connect();
        const user = await LoginInfo.findById(context.params.id);
    
        if (!user) {
          return NextResponse.json({ error: "User not found" }, {status: 404})
        }
    
        await user.deleteOne();
        return NextResponse.json({ message: "User deleted successfully" }, {status: 200})
      } catch (err) {
        return NextResponse.json({error: err.message}, {status: 500})
      }
}