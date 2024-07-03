"use client";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
const apiDomain = "http://localhost:3002";
import Table from "@/app/component/table";
import { Edit, Trash } from "lucide-react";
import AddUsers from "@/app/component/AddUsers";

export default function Student() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [headers, setHeaders] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isAddUserPopupOpen, setIsAddUserPopupOpen] = useState();

  function clearError() {
    setInterval(() => {
      setError("");
    }, 6000);
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
            const response = await fetch('/api/users', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              }
          });
          if (response.ok) {
              const data = await response.json();
              const users = data.map(item => [
                item.userName,
                item.role,
                item.status
              ]);
              setHeaders(["User Name","Role", "Status"],)
              setTableData(users);
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
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
              className="block p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-50 sm:w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for items"
            />
          </div>
          <div className="relative left-0">
            <button onClick={()=>{setIsAddUserPopupOpen(true)}} className="bg-cyan-500 right-0 hover:bg-cyan-400 dark:hover:bg-cyan-600 text-white dark:bg-cyan-700 rounded-md px-4 mt-8 mr-8 py-2">
              Add new
            </button>
          </div>
        </div>
        <div className="lg:w-6/12  w-max flex items-center">
        <Table headers={headers} data={tableData} actionButtons={actionButtons} />
        </div>
      </div>
      {isAddUserPopupOpen && <AddUsers isVisible={isAddUserPopupOpen} onClose={()=> setIsAddUserPopupOpen(false)} />}
    </Fragment>
  );
}
