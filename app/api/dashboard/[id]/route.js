import { NextResponse } from 'next/server';
import connect from '@/lib/db';
const { FeesRecordInfo, EsewaPaymentInfo, Attendance, MemberInfo } = require('@/lib/modals/user');

export const GET = async (res, context) => {
    try {
      await connect();
        const memberId = context.params.id;
        const [feesRecord, esewaRecords] = await Promise.all([
            FeesRecordInfo.find({ student: memberId }),
            EsewaPaymentInfo.find({ student: memberId })
        ]);

        const membersData = await MemberInfo.find({ _id: memberId })
        .populate({
            path: 'studentInfo',
            populate: {
                path: 'grade',
                path: 'loginInfo'
            },
            options: { strictPopulate: false }
        })

        const feesRecordMap = feesRecord.reduce((map, record) => {
            map[record._id] = record.amount;
            return map;
        }, {});
        
        const esewaSumMap = esewaRecords.reduce((map, record) => {
            if (map[record.feesRecord]) {
                map[record.feesRecord] += record.amount;
            } else {
                map[record.feesRecord] = record.amount;
            }
            return map;
        }, {});

        let pendingInvoice = 0;

        for (const [feesRecordId, feesAmount] of Object.entries(feesRecordMap)) {
            const esewaAmount = esewaSumMap[feesRecordId] || 0;
            if (feesAmount !== esewaAmount) {
                pendingInvoice++;
            }
        }
        
        const attendanceData = await Attendance.find({student: membersData[0].studentInfo._id.toString()})
            const present = attendanceData.length;

            const totalAmount = feesRecord.reduce((total, fees) => total + fees.amount, 0);
            const totalPaid = esewaRecords.reduce((total, fees) => total + fees.amount, 0);
            const pendingAmount = totalAmount -totalPaid

        const data = {pendingAmount, present, pendingInvoice}
        const plainObjects = membersData.map(doc => doc.toJSON());
        const membersInfo = plainObjects.reduce((acc, member) => {
            const { studentInfo, __v, _id,...restMembersData } = member;
            return {
                ...restMembersData,
                studentId: studentInfo?.studentId,
                grade: studentInfo?.grade.grade,
                yearEnrolled: studentInfo?.yearEnrolled,
                userName: studentInfo?.loginInfo.userName,
                status: studentInfo?.loginInfo.status
            }
        }, {});
        
        return NextResponse.json({membersInfo,data}, {status: 200})
      } catch (err) {
        return NextResponse.json({error: err.message}, {status: 500})
      }
}