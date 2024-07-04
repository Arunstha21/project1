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
  const [defaultMonth, setDefaultMonth] = useState("");

  useEffect(() => {
    const today = new Date();
    const month = today.toISOString().substring(0, 7);
    setDefaultMonth(month);
  }, []);

  function clearError() {
    setInterval(() => {
      setError("");
    }, 6000);
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const profile = await fetch("/api/users/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (profile.ok) {
          const profileData = await profile.json();
          const response = await fetch("/api/users", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.ok) {
            const data = await response.json();
            const users = data.map((item) => [
              item.userName,
              item.role,
              item.status,
            ]);
            setHeaders(["User Name", "Role", "Status"]);
            setTableData(users);
          } else {
            console.error("Failed to fetch members data");
          }
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching members data:", error);
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
          <div className="relative mt-10 m-2">
            <input
              type="month"
              value={defaultMonth}
              onChange={e => {}}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Select month and year"
            ></input>
          </div>
          <div className="relative mt-10 m-2">
            <select>
                
            </select>
          </div>
        
        </div>
        <div className="lg:w-6/12  w-max flex items-center">
          <Table
            headers={headers}
            data={tableData}
            actionButtons={actionButtons}
          />
        </div>
      </div>
    </Fragment>
  );
}
