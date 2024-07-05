import { NextResponse } from 'next/server';
import connect from '@/lib/db';
const { MemberInfo, StudentInfo, StaffInfo } = require('@/lib/modals/user');

export const GET = async (req, res) => {
    try {
        await connect();
        const members = await MemberInfo.find()
    .populate({
        path: 'studentInfo',
        populate: {
            path: 'grade',
        },
        options: { strictPopulate: false }
    })
    .populate({
        path: 'staffInfo',
        options: { strictPopulate: false }
    });
    
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
    if (membersData.type === "Student") {
      const student = new StudentInfo({
        studentId: membersData.studentId,
        grade: membersData.grade,
        yearEnrolled: membersData.enrolledYear,
      });

      studentInfo = await student.save();
      
    } else if (membersData.type === "Staff") {
      const staff = new StaffInfo({
        employeeId: membersData.employeeId,
        department: membersData.department,
        position: membersData.position,
      });

      staffInfo = await staff.save();
    } else {
        return NextResponse.json({ error: "Invalid member type" }, {status: 400})
    }

    const memberData = {
      fullName: membersData.fullName,
      dateOfBirth: membersData.dateOfBirth,
      address: membersData.address,
      gender: membersData.gender,
      contactNo: membersData.contactNo,
      email: membersData.email,
      // photo: membersData.photo ? membersData.photo : '',  //TO DO
      bloodGroup: membersData.bloodGroup,
    };

    if (studentInfo) {
      memberData.studentInfo = studentInfo._id;
    } else if (staffInfo) {
      memberData.staffInfo = staffInfo._id;
    }

    const member = new MemberInfo(memberData);
    await member.save();
    return NextResponse.json({ message: "Member created successfully" }, {status: 200})

  } catch (err) {
    return NextResponse.json({error: err.message}, {status: 500})
  }
}