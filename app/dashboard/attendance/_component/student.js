import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../payment/_component/card";
import Calendar from "./calendar";

export default function AttendanceStudent({studentId}) {
  const [attendanceData, setAttendanceData] = useState();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState('');
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const [totalDays, setTotalDays] = useState(0);

  const getMonthName = (month) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[month];
  };

  const updateDateAndMonth = (date) => {
      setCurrentDate(date);
      setSelectedMonth(`${getMonthName(date.getMonth())} ${date.getFullYear()}`);
      const numberOfDays = daysInMonth(date.getFullYear(), date.getMonth());
      setTotalDays(numberOfDays)
    };

    useEffect(() => {
      updateDateAndMonth(currentDate);
    },[currentDate]);

  function convertDateToYYYYMM(dateString) {
    const dateParts = dateString.split(' ');
    const monthName = dateParts[0];
    const year = dateParts[1];
  
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthIndex = monthNames.indexOf(monthName) + 1;
    const month = monthIndex < 10 ? `0${monthIndex}` : monthIndex;
  
    return `${year}-${month}`;
  }

  useEffect(()=>{
    const fetchAttendacnecData = async () => {
        try {
            const response = await fetch(`/api/members/attendance/${studentId}?month=${convertDateToYYYYMM(selectedMonth)}`, {
              method: "get",
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (response.ok) {
              const attendance = await response.json();
              setAttendanceData(attendance);
            } else {
              console.error("Failed to fetch student data");
            }
          } catch (error) {
            console.error("Error fetching student data:", error);
          }
    }
    if (selectedMonth) {
    fetchAttendacnecData()
    }
  },[selectedMonth, studentId])


  return (
    <div className="flex h-full w-full flex-col lg:flex-row">
          <div className="flex-1 bg-background p-2 lg:p-5">
          <Card>
        <CardContent>
              <Calendar attendanceData={attendanceData} selectedMonth={selectedMonth} updateDateAndMonth={updateDateAndMonth} currentDate={currentDate}/>
            </CardContent>
      </Card>
          </div>
      <div className="space-y-8 pr-2 pl-2 pb-2 lg:pt-5 lg:pr-5">
        <Card>
          <CardHeader>
            <CardTitle>Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">{attendanceData?.length || 0}</div>
                <div className="text-muted-foreground">Days Present</div>
              </div>
              <div>
                <div className="text-4xl font-bold">{totalDays}</div>
                <div className="text-muted-foreground">Total Days</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Holidays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Labor Day</div>
                  <div className="text-muted-foreground text-sm">
                    September 4, 2023
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Thanksgiving</div>
                  <div className="text-muted-foreground text-sm">
                    November 23, 2023
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Test/Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Midterm Exams</div>
                  <div className="text-muted-foreground text-sm">
                    April 15 - April 19, 2023
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Final Exams</div>
                  <div className="text-muted-foreground text-sm">
                    May 6 - May 10, 2023
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
