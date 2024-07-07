import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import { VerifyEsewaPayment } from '@/app/helpers/getEsewaPaymentHash';
const { EsewaPaymentInfo } = require('@/lib/modals/user');

export const GET = async (req, context) => {
    try {
      await connect();
        const type = context.params.type;
        const searchParams = req.nextUrl.searchParams;
        const data = searchParams.get('data');

        if (type === "success") {
            const verify = await VerifyEsewaPayment(data);
            const esewaPaymentRecord = new EsewaPaymentInfo({
                amount: verify.total_amount,
                date: new Date(),
                status: "complete",
                student: "",
                transactionCode: verify.transaction_code,
                transactionUuid: verify.transaction_uuid,
            })

            return NextResponse.json(verify, {status: 200})
        }else if(type === "fail"){

        }else{
            return NextResponse.json({message: "Unauthorized"}, {status: 400})
        }
    
        return NextResponse.json(member, {status: 200})
      } catch (err) {
        return NextResponse.json({error: err.message}, {status: 500})
      }
}