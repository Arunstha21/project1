import { useEffect, useState } from "react";
import Table from "@/app/component/table";

export default function AttendanceGrid({role, attendanceList, selectedMonth, updateChecked, searchQuery }) {
  const [error, setError] = useState("");
  const [rowData, setRowData] = useState([]);
  const [filteredRowData, setFilteredRowData] = useState(rowData);
  const [daysArray, setDaysArray] = useState();
  const [headers, setHeaders] = useState(["Number", "Student Name"]);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  useEffect(() => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const numberOfDays = daysInMonth(year, month - 1);
    const daysArray = Array.from({ length: numberOfDays }, (_, i) => i + 1);
    const addHeaders = daysArray.map((date) => date.toString());
    setDaysArray(daysArray);
    setHeaders(["Number", "Student Name", ...addHeaders]);
  }, [selectedMonth]);

  useEffect(() => {
    const userList = getUniqueRecords();
    const tableData = userList.map((user, index) => {
      const userAttendance = daysArray.reduce((acc, day) => {
        const fullDateStr = `${selectedMonth}-${String(day).padStart(2, '0')}`;
        const attendanceEntry = attendanceList.find((entry) => entry.studentId === user.studentId && entry.day === day);
        const attendanceId = attendanceEntry ? attendanceEntry.attendanceId : null;
      
        const currentDate = new Date();
        const attendanceDate = new Date(fullDateStr);
      
        const diffInDays = (currentDate - attendanceDate) / (1000 * 60 * 60 * 24);
        const isOlderThanOneDay = diffInDays > 2;
      
        acc[fullDateStr] = {
          value: isPresent(user.studentId, day),
          onchange: (e) => handleCheckboxChange(user.studentId, day, e.target.checked, attendanceId),
          disabled: role==='staff' ? isOlderThanOneDay : false
        };
        return acc;
      }, {});

      return {
        id: user.studentId,
        data: [index + 1, user.studentName, ...Object.values(userAttendance)],
      };
    });

    setRowData(tableData);
  }, [attendanceList]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredRowData(rowData);
    } else {
      const filtered = rowData.filter(item => {
        const value = item.data[1];
        if (typeof value === 'undefined') {
          return false;
        }
        const stringValue = typeof value === 'number' ? value.toString() : value;
        return stringValue.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredRowData(filtered);
    }
  }, [searchQuery, rowData]);

  const handleCheckboxChange = async (studentId, day, presentStatus, attendanceId) => {
    if (presentStatus) {
      const data = {
        day,
        student: studentId,
        present: presentStatus,
        date: selectedMonth,
      };

      try {
        const response = await fetch("/api/members/attendance", {
          method: "POST",
          body: JSON.stringify(data),
        });
        if (response.ok) {
          const res = await response.json();
          updateChecked();
        }
      } catch (error) {
        setError(error.toString());
      }
    } else {
      try {
        const response = await fetch("/api/members/attendance", {
          method: "DELETE",
          body: JSON.stringify({ attendanceId }),
        });
        if (response.ok) {
          const res = await response.json();
          updateChecked();
        }
      } catch (error) {
        setError(error.toString());
      }
    }
  };

  const isPresent = (studentId, day) => {
    const result = attendanceList.find((item) => item.day === day && item.studentId === studentId);
    return !!result;
  };

  const getUniqueRecords = () => {
    const uniqueRecords = [];
    const existingUsers = new Set();

    attendanceList?.forEach((record) => {
      if (!existingUsers.has(record.studentId)) {
        existingUsers.add(record.studentId);
        uniqueRecords.push(record);
      }
    });
    return uniqueRecords;
  };

  return (
    <div className="overflow-y-auto">
      <Table headers={headers} data={filteredRowData} />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
