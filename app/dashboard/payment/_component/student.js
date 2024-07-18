import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "./card";
import Table from "@/app/component/table";

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

        const payment = await fetch(`/api/payment/feesRecord/${profileData.memberId}`, {
          method:'GET'
        })

        if (payment.ok) {
            const paymentData = await payment.json();
            
            const memberPayments = paymentData.filter((payment) => payment.student._id === profileData.memberId);
              const studentData = [];
            
              memberPayments.forEach((payment, index) => {
                let paidAmount = 0;
                let status = 'Pending'
                if (payment.esewaPayments && payment.esewaPayments.length > 0) {
                  payment.esewaPayments.forEach((esewaPayment) => {
                    paidAmount += esewaPayment.amount;
                  });
                }

                status = (payment.amount == paidAmount) ? "Paid" : (paidAmount > 0 && payment.amount > paidAmount) ? "Partial Paid" : status;
            
                studentData.push({
                  isPaid : status === "Paid" ? true : false,
                  id: payment._id,
                  data: [
                    index + 1,
                    payment.student.fullName,
                    payment.grade.grade,
                    `NPR ${payment.amount}`,
                    `NPR ${paidAmount}`,
                    status
                  ]
                });
              });
              console.log(studentData);

              setAllStudents(memberPayments);
              setStudents(studentData);
        } else {
          console.error("Failed to fetch members");
        }
      } catch (error) {
        console.error("Error fetching members data:", error);
      }
    };

    fetchTableData();
  }, []);
  const headers = ["SN", "Student Name", "Grade", "Pending Amount", "Paid Amount", "status"];

  const actionButtons = [
    {
      label: "Make Payment",
      extraClass: "hover:bg-cyan-400 bg-cyan-500 dark:hover:bg-cyan-600 text-white dark:bg-cyan-700 rounded-md px-4 mr-8 py-2",
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
