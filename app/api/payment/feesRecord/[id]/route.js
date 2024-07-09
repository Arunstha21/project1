import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import { uid } from 'uid';
const { FeesRecordInfo, EsewaPaymentInfo } = require('@/lib/modals/user');

export const GET = async (res, context) => {
    try {
        await connect();
        const memberId = context.params.id;
        const allFeesData = await FeesRecordInfo.find()
        .populate({
          path: 'student',
          match: { _id: memberId },
          options: { strictPopulate: false }
        })
        .populate({
          path: 'grade',
          options: { strictPopulate: false }
        });

        const feesData = allFeesData.filter(record => record.student !== null);
      
      const esewaPaymentRecord = await EsewaPaymentInfo.find();

      const esewaPaymentsByFeesRecord = esewaPaymentRecord.reduce((acc, payment) => {
        const feesRecordId = payment.feesRecord.toString();
        if (!acc[feesRecordId]) {
          acc[feesRecordId] = [];
        }
        acc[feesRecordId].push(payment);
        return acc;
      }, {});
      
      
      const updatedFeesData = feesData.map(feesRecord => {
        const feesRecordId = feesRecord._id.toString();
        const plainFeesRecord = feesRecord.toObject();
        plainFeesRecord.esewaPayments = esewaPaymentsByFeesRecord[feesRecordId] || [];
        return plainFeesRecord;
      });
    
        return NextResponse.json(updatedFeesData, {status: 200})
      } catch (err) {
        return NextResponse.json({error: err.message}, {status: 500})
      }
}