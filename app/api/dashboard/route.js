import { NextResponse } from "next/server";
import connect from "@/lib/db";
const {
  MemberInfo,
  FeesRecordInfo,
  EsewaPaymentInfo,
  Attendance,
} = require("@/lib/modals/user");

export const GET = async (req, res) => {
  try {
    await connect();
    const studentCount = await MemberInfo.countDocuments({
      studentInfo: { $exists: true },
    });
    const staffCount = await MemberInfo.countDocuments({
        staffInfo: { $exists: true },
      });
    const totalAmount = await FeesRecordInfo.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    const totalPaid = await EsewaPaymentInfo.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed, so add 1
    const day = today.getDate();

    const todayDate = `${year}-${month}`;

    const presentStudent = await Attendance.countDocuments({
      date: todayDate,
      day: day,
      present: true,
    });
    const data = {studentCount, staffCount, totalAmount: totalAmount[0].total, totalPaid: totalPaid[0].total, presentStudent}

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
