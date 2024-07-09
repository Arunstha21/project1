import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "./card";
import Table from "@/app/component/table";
import { Landmark, Pause, ReceiptText } from "lucide-react";


export default function AdminPaymentPage() {
  const [students, setStudents] = useState();
  const [allStudents, setAllStudents] = useState();
  const [totalPendingAmount, setTotalPendingAmount] = useState();
  const [totalPaidAmount, setTotalPaidAmount] = useState();


  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const members = await fetch("/api/members", {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const payment = await fetch("/api/payment/feesRecord", {
          method:'GET'
        })

        if (members.ok) {
          const membersData = await members.json();
          const paymentData = await payment.json();
          console.log(paymentData);
          let totalPending = 0;
          let totalPaidAmount = 0;
          const allStudents = membersData.filter((member) => member.studentInfo);
          const studentData = allStudents.map((member, index) => {
            const memberPayments = paymentData.filter((payment) => payment.student._id === member._id);
          
            let studentTotalPending = 0;
            let studentTotalPaidAmount = 0;
          
            memberPayments.forEach((payment) => {
              if (payment.esewaPayments && payment.esewaPayments.length > 0) {
                payment.esewaPayments.forEach((esewaPayment) => {
                  studentTotalPaidAmount += esewaPayment.amount;
                });
              }
              studentTotalPending += payment.amount;
            });
          
            totalPending += studentTotalPending;
            totalPaidAmount += studentTotalPaidAmount;
          
            return {
              id: member._id,
              data: [
                index + 1,
                member.fullName,
                member.studentInfo.grade.grade,
                member.email,
                member.contactNo,
                `NPR ${studentTotalPending - studentTotalPaidAmount}`,
                `NPR ${studentTotalPaidAmount}`
              ]
            };
          });
          
          setAllStudents(allStudents);
          setStudents(studentData);
          setTotalPendingAmount(totalPending);
          setTotalPaidAmount(totalPaidAmount);

        } else {
          console.error("Failed to fetch members");
        }
      } catch (error) {
        console.error("Error fetching members data:", error);
      }
    };

    fetchTableData();
  }, []);
  const headers = ["SN", "Student Name", "Grade", "Email", "Contact No", "Pending Amount", "Paid Amount"];

  const actionButtons = [
    {
      label: ReceiptText,
      color: "blue",
    },
    {
      label: Landmark,
      color: "red",
    },
  ];


  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">{students?.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Paid</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">NPR {totalPaidAmount}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Pending</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            NPR {totalPendingAmount}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Student Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table
            headers={headers}
            data={students}
            actionButtons={actionButtons}
            payment={allStudents}
          />
        </CardContent>
      </Card>
    </div>
  );
}
