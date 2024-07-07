"use client";
import { Fragment, useEffect, useState } from "react";
import Table from "@/app/component/table";
import AddMembers from "@/app/component/AddMembers";
import { Edit, Trash } from "lucide-react";

export default function Student() {
  const [error, setError] = useState("");
  const [headers, setHeaders] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isAddMembersPopupOpen, setIsAddMembersPopupOpen] = useState(false);
  const [isEditAddMembersPopupOpen, setIsEditAddMembersPopupOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deletingMemberId, setDeletingMemberId] = useState(null);
  const [memberDbData, setMemberDbData] = useState([]);
  const [memberDataForEdit, setMemberDataForEdit] = useState({});

  const headersData = {
    student: [
      "Student ID",
      "Full Name",
      "Address",
      "Contact",
      "Date of Birth",
      "Email",
      "Gender",
      "Grade",
      "Enrolled Year",
    ],
    staff: [
      "Employee ID",
      "Full Name",
      "Address",
      "Contact",
      "Date of Birth",
      "Email",
      "Gender",
      "Department",
      "Position",
    ],
    admin: [
      "ID",
      "Full Name",
      "Address",
      "Contact",
      "Date of Birth",
      "Email",
      "Gender",
      "Grade / Department",
      "Enrolled Year / Position",
      "Type",
    ],
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

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

        const response = await fetch("/api/members", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch members data");
        }

        const data = await response.json();
        setMemberDbData(data);
        const members = data.map((item) => ({
          id: item._id,
          data: [
            item.studentInfo
              ? item.studentInfo.studentId
              : item.staffInfo.employeeId,
            item.fullName,
            item.address,
            item.contactNo,
            formatDate(item.dateOfBirth),
            item.email,
            item.gender,
            item.studentInfo
              ? item.studentInfo.grade.grade
              : item.staffInfo.department,
            item.studentInfo
              ? item.studentInfo.yearEnrolled
              : item.staffInfo.position,
            item.studentInfo ? "student" : "staff",
          ],
        }));

        let filteredMembers;
        if (profileData.role === "staff") {
          setHeaders(headersData.student);
          filteredMembers = members
            .filter((member) => member.data[9] === "student")
            .map((member) => ({
              id: member.id,
              data: member.data.slice(0, 9),
            }));
        } else {
          setHeaders(headersData.admin);
          filteredMembers = members.map((member) => ({
            id: member.id,
            data: member.data,
          }));
        }

        setTableData(filteredMembers);
      } catch (error) {
        console.error("Error fetching members data:", error);
        setError("Failed to fetch members data");
      }
    };

    useEffect(()=>{
      fetchTableData()
    },[])

  const handleAddOrEditMember = () => {
    fetchTableData();
    setIsAddMembersPopupOpen(false);
    setIsEditAddMembersPopupOpen(false);
  };

  const actionButtons = [
    {
      label: Edit,
      color: "blue",
      onClick: (id) => {
        setIsEditAddMembersPopupOpen(true);
        setMemberDataForEdit(memberDbData.find((member) => member._id === id));
    }, 
    },
    {
      label: Trash,
      color: "red",
      onClick: (id) => {
        setDeletingMemberId(id);
        setDeleteConfirmation(true);
      },
    },
  ];

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/members/${deletingMemberId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete member");
      }

      const updatedTableData = tableData.filter(
        (member) => member.id !== deletingMemberId
      );
      setTableData(updatedTableData);
      setDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting member:", error);
      setError("Failed to delete member");
    }
  };

  const Alert = ({ type, message }) => (
    <div
      className={`bg-${
        type === "success" ? "green" : "red"
      }-200 px-4 py-2 my-2 rounded-md text-sm text-${
        type === "success" ? "green" : "red"
      }-800`}
    >
      {message}
    </div>
  );

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
        </div>

    <div>
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg dark:bg-cyan-950 shadow-lg text-center ">
            <p className="text-lg font-semibold">
              Are you sure you want to delete{" "}
              {tableData.find((member) => member.id === deletingMemberId)?.data[1]}{" "}
              data ?
            </p>
            <div className="mt-4 space-x-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                onClick={confirmDelete}
              >
                Confirm Delete
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                onClick={() => setDeleteConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <Table
          headers={headers}
          data={tableData}
          actionButtons={actionButtons}
        />
      </div>
      {error && <Alert type="error" message={error} />}
      {isEditAddMembersPopupOpen && (
        <AddMembers
          isVisible={isEditAddMembersPopupOpen}
          onClose={() => setIsEditAddMembersPopupOpen(false)}
          memberDataForEdit={memberDataForEdit}
          onAddOrEditMember={handleAddOrEditMember}
        />
      )}
      {isAddMembersPopupOpen && (
        <AddMembers
          isVisible={isAddMembersPopupOpen}
          onClose={() => setIsAddMembersPopupOpen(false)}
          onAddOrEditMember={handleAddOrEditMember}
        />
      )}
    </div>
    </Fragment>
  );
}
