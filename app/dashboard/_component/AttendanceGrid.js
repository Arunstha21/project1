import { useEffect, useState } from "react";
import Table from "@/app/component/table";


export default function AttendanceGrid({attendanceList, selectedMonth, updateChecked}) {

    const [error, setError] = useState('')
    const [rowData, setRowData] = useState();
    const [headers, setHeaders ] = useState([
        "Number", "Student Name",
    ]);
    

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const [year, month] = selectedMonth.split('-').map(Number);
    const numberOfDays = daysInMonth(year, month - 1);
    const daysArray = Array.from({ length: numberOfDays }, (_, i) => i + 1);

    useEffect(()=>{
        const newHeaders = ["Number", "Student Name", ...daysArray.map(date => date.toString())];
        setHeaders(newHeaders);

        // Get unique user records and create row data
        const userList = getUniqueRecords();
        const tableData = userList.map((user, index) => {
            const userAttendance = daysArray.reduce((acc, date) => {
                const attendanceEntry = attendanceList.find(entry => entry.studentId === user.studentId && entry.day === date);
                const attendanceId = attendanceEntry ? attendanceEntry.attendanceId : null;

                acc[date] = {
                    value: isPresent(user.studentId, date),
                    onchange: (e) => {handleCheckboxChange(user.studentId, date, e.target.checked, attendanceId)}
                };
                return acc;
            }, {});

            return {
                id: user.studentId,
                data: [
                    index + 1,
                    user.studentName,
                    ...Object.values(userAttendance)
                ],
            };
        });

        setRowData(tableData);
    },[attendanceList])

    const handleCheckboxChange = async (studentId, day, presentStatus, attendanceId) =>{
        if(presentStatus){
            const data = {
                day: day,
                student: studentId,
                present: presentStatus,
                date: selectedMonth
            }

            try {
                const response = await fetch('/api/members/attendance',{
                    method: "POST",
                    body: JSON.stringify(data)
                })
                if (response.ok) {
                    const res = await response.json()
                    updateChecked();
                }
            } catch (error) {
                setError(error)
            }
        }else {
            console.log(attendanceId);
            try {
                const response = await fetch('/api/members/attendance',{
                    method: "DELETE",
                    body: JSON.stringify(attendanceId)
                })
                if (response.ok) {
                    const res = await response.json()
                    updateChecked();
                }
            } catch (error) {
                setError(error)
            }
        }
    }

    const isPresent = (studentId, day) => {
        const result = attendanceList.find(item => item.day === day && item.studentId === studentId);
        return !!result;
    }

    const getUniqueRecords = ()=>{
        const uniqueRecords = [];
        const existingUsers = new Set();

        attendanceList?.forEach(record => {
            if (!existingUsers.has(record.studentId)) {
                existingUsers.add(record.studentId);
                uniqueRecords.push(record)
            } 
        });
        return uniqueRecords;
    }
    return (
        <div className="overflow-y-auto">
            <Table headers={headers} data={rowData} />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    )
}