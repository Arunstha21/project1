import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import { uid } from 'uid';
const { FeesRecordInfo, EsewaPaymentInfo } = require('@/lib/modals/user');

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
        });
      
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

export const POST = async (req, res) => {
      try {
        await connect();
    const feesData = await req.json();
    const checkUniqueUid = await FeesRecordInfo.find({ transactionUuid: feesData.transactionUuid });

    if (checkUniqueUid.length > 0) {
      const uuid = uid(16);
      feesData.transactionUuid = uuid;
    }
    
    const feesRecord = new FeesRecordInfo(feesData);
    await feesRecord.save();

    await feesRecord
    .populate({
      path: 'student',
      options: { strictPopulate: false }
    })

    await feesRecord
    .populate({
      path: 'grade',
      options: { strictPopulate: false }
    })

    return NextResponse.json({ message: "Invoice created successfully", feesRecord }, {status: 200})

  } catch (err) {
    return NextResponse.json({error: err.message}, {status: 500})
  }
}