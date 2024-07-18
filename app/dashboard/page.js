'use client'
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./payment/_component/card"

export default function Dashboard() {
   const [cardContent, setCardContent] = useState();
   const [userRole, setUserRole] = useState();
   const [memberData, setMemberData] = useState();

   const title = {
      presentStudent: "Total Present",
      studentCount: "Total Student",
      staffCount: "Total Staff",
      totalPaid: "Total Received",
      pendingAmount: "Total Pending",
      present: "Total Present",
      pendingInvoice: "Invoice Pending",
      fullName: "Full Name",
      dateOfBirth: "Date Of Birth",
      address: "Address",
      gender: "Gender",
      contactNo: "Contact Number",
      email: "Email",
      bloodGroup: "Blood Group",
      studentId: "Student Id",
      grade: "Grade",
      yearEnrolled: "Year Enrolled",
      userName: "User Name",
      status: "Status"
   }

   const prefix = {
      totalPaid: 'NPR',
      pendingAmount: 'NPR',
   }

   useEffect(()=>{
      const fetchDashboardData = async ()=>{
         try {
            const response = await fetch("/api/users/profile", {
              method: "POST",
            });
            if (response.ok) {
              const profileData = await response.json();
              setUserRole(profileData.role)
              if (profileData.role === "admin" || profileData.role === "staff") {
               const response = await fetch('/api/dashboard',{
                  method: 'GET'
               })
               if (response.ok) {
                  const res = await response.json();
                  const pendingAmount = res.totalAmount - res.totalPaid
                  const {totalAmount,...restRes} = res;
                  const resData = {...restRes, pendingAmount}
                  
                  let cardData = [];
                  for (const key in resData) {
                     const data = {
                        title: title[key],
                        value: resData[key],
                        prefix: prefix[key] || ''
                        
                     }
                     cardData.push(data);
                   }
                  setCardContent(cardData)
               }
              } else {
               const response = await fetch(`/api/dashboard/${profileData.memberId}`,{
                  method: 'GET'
               })
               if (response.ok) {
                  const res = await response.json();
                  let cardData = [];
                  for (const key in res.data) {
                     const data = {
                        title: title[key],
                        value: res.data[key],
                        prefix: prefix[key] || ''
                        
                     }
                     cardData.push(data);
                   }
                  setCardContent(cardData)
                  setMemberData(res.membersInfo);
               }
              }
            } else {
              console.error("Failed to fetch profile");
            }
          } catch (error) {
            console.error("Error fetching profile:", error);
          }
      }

      fetchDashboardData();

   },[])

 return (
   <div className="flex flex-col gap-8 p-6 md:p-8">
      {userRole ==='student' && memberData ? (
          <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:ml-8 sm:grid-cols-3">
            {Object.keys(memberData).map((key) => (
              <div className="grid gap-1" key={key}>
                <div className="text-sm font-medium underline">{title[key]}</div>
                <div className="text-sm text-muted-foreground">{String(memberData[key])}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : ""}
   <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
   {cardContent?.length > 0 ? (
          cardContent.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-4xl font-bold">
                {item.prefix} {item.value}
              </CardContent>
            </Card>
          ))
        ) : (
          <div>Loading...</div>
        )}
   </div>
   </div>
 )
}