import { NextResponse } from 'next/server';
import connect from '@/lib/db';
const { MemberInfo, StudentInfo, StaffInfo } = require('@/lib/modals/user');

export const GET = async (req, res) => {
    try {
        await connect();
        const members = await MemberInfo.find()
          .populate({
            path: 'studentInfo',
            options: { strictPopulate: false }
          })
          .populate({
            path: 'staffInfo',
            options: { strictPopulate: false }
          })
    
        return NextResponse.json(members, {status: 200})
      } catch (err) {
        return NextResponse.json({error: err.message}, {status: 500})
      }
}

export const POST = async (req, res) => {
      try {
        await connect();
    const membersData = await req.json();
    let studentInfo;
    let staffInfo;
    if (membersData.type.value === "Student") {
      const student = new StudentInfo({
        studentId: membersData.studentId.value,
        program: membersData.program.value,
        yearEnrolled: membersData.enrolledYear.value,
      });

      studentInfo = await student.save();
    } else if (membersData.type.value === "Staff") {
      const staff = new StaffInfo({
        employeeId: membersData.employeeId.value,
        department: membersData.department.value,
        position: membersData.position.value,
      });

      staffInfo = await staff.save();
    } else {
        return NextResponse.json({ error: "Invalid member type" }, {status: 400})
    }

    const memberData = {
      fullName: membersData.fullName.value,
      dateOfBirth: membersData.dateOfBirth.value,
      address: membersData.address.value,
      gender: membersData.gender.value,
      contactNo: membersData.contactNo.value,
      email: membersData.email.value,
      photo: membersData.photo.value,
      bloodGroup: membersData.bloodGroup.value,
    };

    if (studentInfo) {
      memberData.studentInfo = studentInfo._id;
    } else if (staffInfo) {
      memberData.staffInfo = staffInfo._id;
    }

    const member = new MemberInfo(memberData);
    await member.save();
    return NextResponse.json({ message: "Member created successfully" }, {status: 201})

  } catch (err) {
    return NextResponse.json({error: err.message}, {status: 500})
  }
}