import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import bcryptjs from 'bcryptjs'
const { MemberInfo, StudentInfo, LoginInfo, GradeInfo } = require('@/lib/modals/user');

export const POST = async (req) => {
  try {
    await connect();
    const membersDataArray = await req.json();

    for (const membersData of membersDataArray) {
      if (membersData.type !== "student") {
        continue;
      }

      const existingMember = await MemberInfo.findOne({ email: membersData.email });
      if (existingMember) {
        continue;
      }

      const [firstName, ...lastNameParts] = membersData.fullName.split(' ');
      const lastName = lastNameParts.join(' ');
      let userName = `${membersData.fullName.replace(/\s+/g, '.').toLowerCase()}`;
      const password = `${firstName.charAt(0).toUpperCase() + firstName.slice(1)}#` +
        (lastName.length > 3 ? lastName.slice(-4) : lastName) +
        membersData.contactNo.slice(-4);

      const hashedPassword = await bcryptjs.hash(password, 4);

      const existingUser = await LoginInfo.findOne({ userName });
      if (existingUser) {
        userName = `${membersData.fullName.replace(/\s+/g, '.').toLowerCase()}.${membersData.contactNo.slice(-4)}`;
      }

      let loginInfo;
      if (!existingUser) {
        const login = new LoginInfo({
          userName: userName,
          password: hashedPassword,
          role: "student",
        });
        loginInfo = await login.save();
      }

      const grade = await GradeInfo.find({grade: Number(membersData.grade)})

      const student = new StudentInfo({
        studentId: membersData.studentId,
        grade: grade[0]._id,
        yearEnrolled: membersData.yearEnrolled,
        loginInfo: loginInfo?._id || null,
      });

      const studentInfo = await student.save();

      const memberData = {
        fullName: membersData.fullName,
        dateOfBirth: membersData.dateOfBirth,
        address: membersData.address,
        gender: membersData.gender,
        contactNo: membersData.contactNo,
        email: membersData.email,
        bloodGroup: membersData.bloodGroup,
        studentInfo: studentInfo._id,
      };

      const member = new MemberInfo(memberData);
      await member.save();
    }

    return NextResponse.json({ message: "Members created successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
