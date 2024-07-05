import { NextResponse } from 'next/server';
import connect from '@/lib/db';
const { GradeInfo } = require('@/lib/modals/user');

export const POST = async (req, res) => {
      try {
        await connect();
    const gradeData = await req.json();

    const grade = new GradeInfo(gradeData);
    await grade.save();
    return NextResponse.json({ message: "Grade added successfully" }, {status: 200})

  } catch (err) {
    return NextResponse.json({error: err.message}, {status: 500})
  }
}

export const GET = async (req, res) => {
    try {
        await connect();
        const grade = await GradeInfo.find()
    
        return NextResponse.json(grade, {status: 200})
      } catch (err) {
        return NextResponse.json({error: err.message}, {status: 500})
      }
}