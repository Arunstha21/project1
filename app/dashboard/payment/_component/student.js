import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "./card";
import Table from "@/app/component/table";
import { Landmark, ReceiptText } from "lucide-react";

export default function StudentPaymentPage() {
  const [students, setStudents] = useState();
  const [allStudents, setAllStudents] = useState();


  useEffect(() => {
    const fetchTableData = async () => {
      try {

        const profile = await fetch("/api/users/profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
    
          if (!profile.ok) {
            throw new Error("Failed to fetch profile");
          }
    
          const profileData = await profile.json();

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
            
            const member = membersData.find((member) => member.studentInfo?.loginInfo && member.studentInfo.loginInfo === profileData.id);
            if (member) {
              const memberPayments = paymentData.filter((payment) => payment.student._id === member._id);
              let studentTotalPending = 0;
              let studentTotalPaidAmount = 0;
              const studentData = [];
            
              memberPayments.forEach((payment, index) => {
                let paidAmount = 0;
                if (payment.esewaPayment) {
                  paidAmount = payment.esewaPayment.paidAmount;
                  studentTotalPaidAmount += payment.esewaPayment.paidAmount;
                } else {
                  studentTotalPending += payment.amount;
                }
            
                studentData.push({
                  id: payment._id,
                  data: [
                    index + 1,
                    member.fullName,
                    member.studentInfo.grade.grade,
                    `NPR ${payment.amount}`,
                    `NPR ${paidAmount}`
                  ]
                });
              });

              setAllStudents(memberPayments);
              setStudents(studentData);
            } else {
              console.error("No member found with the given profile ID");
            }
            

        } else {
          console.error("Failed to fetch members");
        }
      } catch (error) {
        console.error("Error fetching members data:", error);
      }
    };

    fetchTableData();
  }, []);
  const headers = ["SN", "Student Name", "Grade", "Pending Amount", "Paid Amount"];

  const actionButtons = [
    {
      label: "Make Payment",
      extraClass: "hover:bg-cyan-400 dark:hover:bg-cyan-600 text-white dark:bg-cyan-700 rounded-md px-4 mr-8 py-2",
      color: "blue"
    }
  ];


  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
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
