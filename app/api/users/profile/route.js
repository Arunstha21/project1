import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import { dcryptToken } from '@/app/helpers/dcryptToken';
const { LoginInfo, StudentInfo, StaffInfo, MemberInfo } = require('@/lib/modals/user');

connect();

export const POST = async (req, res) => {
    const userId = await dcryptToken(req);

    try {
        const user = await LoginInfo.findById(userId).select('-password -createdAt -updatedAt -__v');
        const student = await StudentInfo.findOne({ loginInfo: userId });
        const staff = await StaffInfo.findOne({ loginInfo: userId });

        let member;
        if (student || staff) {
            if (student) {
                member = await MemberInfo.findOne({ studentInfo: student._id })
                    .populate('studentInfo')
                    .populate('staffInfo');
            } else if (staff) {
                member = await MemberInfo.findOne({ staffInfo: staff._id })
                    .populate('studentInfo')
                    .populate('staffInfo');
            }
        }

        const userData = {
            id: user._id,
            userName : user.userName,
            status : user.status,
            role: user.role,
            fullName : member?.fullName || null,
            email: member?.email || null,
            memberId: member?._id || null,
            studentId : member?.student?._id || null
        }

        return NextResponse.json(userData);
    } catch (error) {
        console.error('Error in POST /api/users/profile:', error);
        return NextResponse.json(error, { status: 500 });
    }
}
