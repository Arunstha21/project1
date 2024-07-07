import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import bcryptjs from 'bcryptjs'
const { FeesRecordInfo } = require('@/lib/modals/user');

export const GET = async (req, res) => {
    try {
        await connect();
        const feesData = await FeesRecordInfo.find()
        .populate({
          path: 'student',
          options: { strictPopulate: false }
        })
        .populate({
            path: 'grade',
            options: { strictPopulate: false }
          })
        .populate({
          path: 'esewaPayment',
          options: { strictPopulate: false }
        });
    
        return NextResponse.json(feesData, {status: 200})
      } catch (err) {
        return NextResponse.json({error: err.message}, {status: 500})
      }
}

export const POST = async (req, res) => {
      try {
        await connect();
    const feesData = await req.json();
    const feesRecord = new FeesRecordInfo(feesData);
    await feesRecord.save();
    return NextResponse.json({ message: "Invoice created successfully" }, {status: 200})

  } catch (err) {
    return NextResponse.json({error: err.message}, {status: 500})
  }
}