"use client";
import { Fragment, useEffect, useState } from "react";
import AttendanceGrid from "../_component/AttendanceGrid";
import SearchComponent from "@/app/component/Search";

export default function AdminAttendance() {

  const [error, setError] = useState("");
  const [gradeOptions, setGradeOptions] = useState();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedGrade, setSelectedGrade] = useState();
  const [attendanceList, setAttendanceList] = useState();
  const [searchQuery, setSearchQuery] = useState();

  useEffect(() => {
    const today = new Date();
    const month = today.toISOString().substring(0, 7);
    setSelectedMonth(month);
  }, []);

  function clearError() {
    setInterval(() => {
      setError("");
    }, 6000);
  }

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const gradeReq = await fetch("/api/members/grade", {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (gradeReq.ok) {
          const gradeData = await gradeReq.json();
          setGradeOptions(gradeData);
        } else {
          console.error("Failed to fetch grade");
        }
      } catch (error) {
        console.error("Error fetching grade data:", error);
      }
    };

    fetchTableData();
  }, []);

  async function search(e) {
    if(!selectedGrade){
      setError("Please Select the Grade")
      clearError();
    }
    try {
      const response = await fetch(`/api/members/attendance?grade=${selectedGrade}&month=${selectedMonth}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const gradeStudentData = await response.json();
        setAttendanceList(gradeStudentData);
      } else {
        console.error("Failed to fetch student data");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  }

  return (
    <Fragment>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <div className=" border rounded-lg shadow-md items-center">
        <div className="flex justify-between iteams-center">
        <div className="flex mt-7 m-2">
          <SearchComponent queryInput={(v) => setSearchQuery(v)}/>
          </div>
          <div className="flex gap-2 mt-10 m-2">
          <div>
            <input
              type="month"
              value={selectedMonth}
              onChange={e => {setSelectedMonth(e.target.value)}}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Select month and year"
            ></input>
          </div>
          <div>
            <select onChange={e => {setSelectedGrade(e.target.value)}} className="border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-cyan-950 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="">Select Grade</option>
            {gradeOptions && gradeOptions.length > 0 ? (
          gradeOptions.map((option) => (
            <option key={option._id} value={option._id}>
              {`Grade ${option.grade}`}
            </option>
          ))
        ) : (
          <option value="">No grades available</option>
        )}
            </select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <div>
            <button onClick={search} className="bg-cyan-500 right-0 hover:bg-cyan-400 dark:hover:bg-cyan-600 text-white dark:bg-cyan-700 rounded-md px-4 mr-8 py-2">
              Search
            </button>
          </div>
          </div>
        </div>
        </div>

        <div className="mt-5 flex items-center">
          <AttendanceGrid attendanceList={attendanceList} updateChecked={search} selectedMonth={selectedMonth} searchQuery={searchQuery}/>
        </div>
      </div>
    </Fragment>
  );
}
