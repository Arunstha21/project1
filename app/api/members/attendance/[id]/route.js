import { NextResponse } from "next/server";
import connect from "@/lib/db";
const { MemberInfo, Attendance } = require("@/lib/modals/user");

export const GET = async (req, context) => {
  try {
    await connect();
    const searchParams = req.nextUrl.searchParams;
    const studentId = context.params.id;
    const month = searchParams.get('month');

    const attendanceRecords = await Attendance.find({ date: month });

    const members = await MemberInfo.find({ _id : studentId })
      .populate({
        path: "studentInfo",
        populate: {
          path: "grade",
        },
        options: { strictPopulate: false },
      });
      const responseData = members.map(member => {
        const attendances = attendanceRecords.filter(record => record.student.toString() === member.studentInfo._id.toString());

        if (attendances.length === 0) {
          return {
            studentId: member.studentInfo._id,
            studentName: member.fullName,
            present: null,
            day: null,
            month: month,
            grade: member.studentInfo.grade.grade,
            attendanceId: null
          };
        }
      
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