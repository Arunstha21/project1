import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import jwt from 'jsonwebtoken'
const jwtSecretKey = process.env.JWT_KEY;
import bcryptjs from 'bcryptjs'
const { LoginInfo } = require('@/lib/modals/user');

connect();

export const POST = async (req, res) => {
    const { userName, password } = await req.json();
    const userExists = await LoginInfo.findOne({ userName });
  
    if (userExists) {
      if (userExists.status === "active") {
        const passwordMatch = await bcryptjs.compare(password, userExists.password);
        if (passwordMatch) {
          const payload = {
            id: userExists._id,
            userName: userExists.userName,
            password: userExists.password,
            role: userExists.role,
          };
          const token = jwt.sign(payload, jwtSecretKey, { expiresIn: "30m" });
          const response =  NextResponse.json({ success: "Logged in!", role: userExists.role}, {status: 200});
          response.cookies.set("token", token, { httpOnly: true});
          return response

        } else {
            return NextResponse.json({ error: "User Name or Password didn't match" }, {status: 500});
        }
      }else {
        return NextResponse.json({ error: "User is not active !" }, {status: 500});
        }
    } else {
        return NextResponse.json({ error: "User Name or Password didn't match" }, {status: 500});
    }
}