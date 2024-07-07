import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import bcryptjs from 'bcryptjs'
const { MemberInfo, StudentInfo, StaffInfo, LoginInfo } = require('@/lib/modals/user');

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
    let userName;

    const [firstName, ...lastNameParts] = membersData.fullName.split(' ');
    const lastName = lastNameParts.join(' ');
    userName = `${membersData.fullName.replace(/\s+/g, '.').toLowerCase()}`;
    const password = `${firstName.charAt(0).toUpperCase() + firstName.slice(1)}#` +
      (lastName.length > 3 ? lastName.slice(-4) : lastName) +
      membersData.contactNo.slice(-4);

    const hashedPassword = await bcryptjs.hash(password, 4);

    if (membersData.type === "Student") {
      const existingUser = await LoginInfo.findOne({ userName });
      if(existingUser){
        userName = `${membersData.fullName.replace(/\s+/g, '.').toLowerCase()}.${membersData.contactNo.slice(-4)}`
      }
      let loginInfo;
      if(!existingUser){
      const login = new LoginInfo({
        userName: userName,
        password: hashedPassword,
        role: "student"
      })
      loginInfo = await login.save();
      }

      const student = new StudentInfo({
        studentId: membersData.studentId,
        grade: membersData.grade,
        yearEnrolled: membersData.yearEnrolled,
        loginInfo: loginInfo?._id || null
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