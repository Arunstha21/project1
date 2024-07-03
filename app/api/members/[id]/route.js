import { NextResponse } from 'next/server';
import connect from '@/lib/db';
const { MemberInfo, StudentInfo, StaffInfo } = require('@/lib/modals/user');

export const GET = async (res, context) => {
    try {
      await connect();
        const memberId = context.params.id;
        let member = await MemberInfo.findById(memberId)
          .populate({
            path: 'studentInfo',
            options: { strictPopulate: false }
          })
          .populate({
            path: 'staffInfo',
            options: { strictPopulate: false }
          })
    
        if (!member) {
          return NextResponse.json({ error: "Member not found" }, {status: 404})
        }
    
        return NextResponse.json(member, {status: 200})
      } catch (err) {
        return NextResponse.json({error: err.message}, {status: 500})
      }
}

export const PUT = async (req, context) => {
    try {
      await connect();
        const membersData = await req.json();
        const member = await MemberInfo.findById(context.params.id);
    
        if (!member) {
          return NextResponse.json({ error: "Member not found" }, {status: 404})
        }
    
        member.fullName = membersData.fullName || member.fullName;
        member.dateOfBirth = membersData.dateOfBirth || member.dateOfBirth;
        member.address = membersData.address || member.address;
        member.gender = membersData.gender || member.gender;
        member.contactNo = membersData.contactNo || member.contactNo;
        member.email = membersData.email || member.email;
        member.photo = membersData.photo || member.photo;
        member.bloodGroup = membersData.bloodGroup || member.bloodGroup;
    
        if (membersData.type === "Student" && member.studentInfo) {
          const studentInfo = await StudentInfo.findById(member.studentInfo);
          studentInfo.studentId = membersData.studentId || studentInfo.studentId;
          studentInfo.program = membersData.program || studentInfo.program;
          studentInfo.yearEnrolled = membersData.yearEnrolled || studentInfo.yearEnrolled;
          await studentInfo.save();
        } else if (membersData.type === "Staff" && member.staffInfo) {
          const staffInfo = await StaffInfo.findById(member.staffInfo);
          staffInfo.employeeId = membersData.employeeId || staffInfo.employeeId;
          staffInfo.department = membersData.department || staffInfo.department;
          staffInfo.position = membersData.position || staffInfo.position;
          await staffInfo.save();
        }
    
        const updatedMember = await member.save();
        await updatedMember.populate('studentInfo staffInfo');

        return NextResponse.json(updatedMember, {status: 200})
      } catch (err) {
        return NextResponse.json({error: err.message}, {status: 500})
      }
}

export const DELETE = async (req, context) => {
    try {
      await connect();
        const member = await MemberInfo.findById(context.params.id);
    
        if (!member) {
          return NextResponse.json({ error: "Member not found" }, {status: 404})
        }
    
        if (member.studentInfo) {
          await StudentInfo.findByIdAndDelete(member.studentInfo);
        }
        if (member.staffInfo) {
          await StaffInfo.findByIdAndDelete(member.staffInfo);
        }
    
        await member.deleteOne();
        return NextResponse.json({ message: "Member deleted successfully" }, {status: 200})
      } catch (err) {
        return NextResponse.json({error: err.message}, {status: 500})
      }
}