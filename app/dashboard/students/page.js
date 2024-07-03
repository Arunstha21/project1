"use client";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
const apiDomain = "http://localhost:3002";
import Table from "@/app/component/table";
import AddMembers from "@/app/component/AddMembers";
import { Edit, Trash } from "lucide-react";

export default function Student() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [headers, setHeaders] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isAddMembersPopupOpen, setIsAddMembersPopupOpen] = useState();

  function clearError() {
    setInterval(() => {
      setError("");
    }, 6000);
  }
  const headersData = {
    student: ["Student ID","Full Name", "Address", "Contact", "Date of Birth", "Email", "Gender", "Program", "Enrolled Year"],
    staff: ["Employee ID","Full Name", "Address", "Contact", "Date of Birth", "Email", "Gender", "Department", "Position"],
    admin: ["ID","Full Name", "Address", "Contact", "Date of Birth", "Email", "Gender", "Program / Department", "Enrolled Year / Position"]
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchTableData = async () => {
        try {
          const profile = await fetch('/api/users/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (profile.ok) {
            const profileData = await profile.json();
            const response = await fetch('/api/members', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              }
          });
          if (response.ok) {
              const data = await response.json();
              const members = data.map(item => [
                item.studentInfo ? item.studentInfo.studentId : item.staffInfo.employeeId,
                item.fullName,
                item.address,
                item.contactNo,
                formatDate(item.dateOfBirth),
                item.email,
                item.gender,
                item.studentInfo ? item.studentInfo.program : item.staffInfo.department,
                item.studentInfo ? item.studentInfo.yearEnrolled : item.staffInfo.position,
                item.studentInfo ? "student" : "staff"
              ]);
              let filteredMembers;
              if (profileData.role === "staff") {
                setHeaders(headersData.student)
                filteredMembers = members.filter(member => member[9] === "student").map(member => member.slice(0, 9));
              }else{
                setHeaders(headersData.admin)
                filteredMembers = members.map(member => member.slice(0, 9));
              }
              setTableData(filteredMembers);
          } else {
              console.error('Failed to fetch members data');
          }

        } else {
            console.error('Failed to fetch profile');
        }
        } catch (error) {
            console.error('Error fetching members data:', error);
        }
    };

    fetchTableData();
}, []);
  
  const actionButtons = [
    {
      label: Edit,
      color: "blue",
      onClick: () => console.log("Edit clicked"),
    },
    {
      label: Trash,
      color: "red",
      onClick: () => console.log("Remove clicked"),
    },
  ];

  return (
    <Fragment>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <div className="pb-4 flex justify-between items-center">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative mt-10 m-2">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search"
              className="block p-3 ps-10 text-sm text-gray-900 border border-sky-500 rounded-lg w-50 sm:w-80 bg-gray-50 focus:ring-sky-500 focus:border-sky-500 dark:bg-cyan-950 dark:border-sky-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
              placeholder="Search for items"
            />
          </div>
          <div className="relative left-0">
            <button onClick={()=>{setIsAddMembersPopupOpen(true)}} className="bg-cyan-500 right-0 hover:bg-cyan-400 dark:hover:bg-cyan-600 text-white dark:bg-cyan-700 rounded-md px-4 mt-8 mr-8 py-2">
              Add new
            </button>
          </div>
        </div>
        <div>
        <Table headers={headers} data={tableData} actionButtons={actionButtons} />
        </div>
      </div>
      {isAddMembersPopupOpen && <AddMembers isVisible={isAddMembersPopupOpen} onClose={()=> setIsAddMembersPopupOpen(false)} />}
    </Fragment>
  );
}
