import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import { VerifyEsewaPayment } from '@/app/helpers/getEsewaPaymentHash';
const { EsewaPaymentInfo, FeesRecordInfo } = require('@/lib/modals/user');
import { uid } from 'uid';

export const GET = async (req, context) => {
    try {
      await connect();
        const type = context.params.type;
        const searchParams = req.nextUrl.searchParams;
        const data = searchParams.get('data');

        if (type === "success") {
            const verify = await VerifyEsewaPayment(data);

            const feesRecord = await FeesRecordInfo.findOne({transactionUuid: verify.decodedData.transaction_uuid});
            if (!feesRecord) {
                return NextResponse.json({message: "Fees Record Didn't found"}, {status: 400});
            }

            let uuid = (feesRecord.amount > verify.decodedData.total_amount) ? uid(16) : feesRecord.transactionUuid;
            
            const esewaPaymentRecord = new EsewaPaymentInfo({
                amount: verify.decodedData.total_amount,
                date: new Date(),
                status: "completed",
                student: feesRecord.student,
                transactionCode: verify.decodedData.transaction_code,
                feesRecord : feesRecord._id
            });
            
            feesRecord.esewaPayment = esewaPaymentRecord._id;
            feesRecord.transactionUuid = uuid;

            await feesRecord.save();
            await esewaPaymentRecord.save();
            
            return NextResponse.redirect(new URL('/dashboard/payment', req.url));
        }else if(type === "fail"){

        }else{
            return NextResponse.json({message: "Unauthorized"}, {status: 400})
        }
    
        return NextResponse.json(member, {status: 200})
      } catch (err) {
        return NextResponse.json({error: err.message}, {status: 500})
      }
}