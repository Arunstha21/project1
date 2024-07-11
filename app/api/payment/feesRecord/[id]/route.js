import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import { uid } from 'uid';
const { FeesRecordInfo, EsewaPaymentInfo } = require('@/lib/modals/user');

connect();

export const GET = async (res, context) => {
    try {
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

export const PUT = async (req, context) => {
  try {
      const feesData = await req.json();
      const feesRecord = await FeesRecordInfo.findById(context.params.id);
  
      if (!feesRecord) {
        return NextResponse.json({ error: "Fees Record not found" }, {status: 404})
      }

      const uuid = uid(16);

      feesRecord.amount = feesData.amount;
      feesRecord.month = feesData.month;
      feesRecord.transactionUuid = uuid;
  
      const updatedFeesRecord = await feesRecord.save();

      return NextResponse.json(updatedFeesRecord, {status: 200})
    } catch (err) {
      return NextResponse.json({error: err.message}, {status: 500})
    }
}
export const DELETE = async (req, context) => {
  try {
    const { id } = context.params;
    const esewaPaymentRecords = await EsewaPaymentInfo.find({ feesRecord: id });
    const feesRecord = await FeesRecordInfo.findById(id);

    if (!feesRecord) {
      return NextResponse.json({ error: "Fees Record not found" }, { status: 404 });
    }
    if (esewaPaymentRecords >= 1) {
      for (const record of esewaPaymentRecords) {
        await record.deleteOne();
      }
    }
    await feesRecord.deleteOne();

    return NextResponse.json({ message: "Fees Record deleted successfully" }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};