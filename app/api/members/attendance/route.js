import { NextResponse } from "next/server";
import connect from "@/lib/db";
const { MemberInfo, StudentInfo, Attendance } = require("@/lib/modals/user");

export const GET = async (req, res) => {
  try {
    await connect();
    const searchParams = req.nextUrl.searchParams;
    const gradeId = searchParams.get('grade');
    const month = searchParams.get('month');

    const attendanceRecords = await Attendance.find({ date: month });

    const students = await StudentInfo.find({ grade: gradeId }).select('_id');
    const studentIds = students.map(student => student._id);

    const members = await MemberInfo.find({ studentInfo: { $in: studentIds } })
      .populate({
        path: "studentInfo",
        populate: {
          path: "grade",
        },
        options: { strictPopulate: false },
      });

      const responseData = members.map(member => {
        const attendances = attendanceRecords.filter(record => record.student.toString() === member.studentInfo._id.toString());

        const attendanceData = attendances.map(attendance => ({
          studentId: member.studentInfo._id,
          studentName: member.fullName,
          present: attendance.present || null,
          day: attendance.day || null,
          month: attendance.date || month,
          grade: member.studentInfo.grade.grade,
          attendanceId: attendance._id || null
        }));
      
        return attendanceData;
      }).flat();

    return NextResponse.json(responseData, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

export const POST = async (req, res) => {
    try {
        await connect();
        const data = await req.json();
        const attendance = new Attendance({
            student: data.student,
            present: data.present,
            day: data.day,
            date: data.date
        });
        console.log(attendance);

        await attendance.save();
        return NextResponse.json({ message: `Student ID: ${data.student} marked as present !` }, {status: 200})

    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export const DELETE = async (req, res) => {
    try {
        await connect();
        const data = await req.json();
        await Attendance.findByIdAndDelete(data);
        return NextResponse.json({ message: `Student ID: ${data.student} marked as absent !` }, {status: 200})

    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}