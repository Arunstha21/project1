import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '../../payment/_component/card';

export default function Calendar ({attendanceData, selectedMonth, updateDateAndMonth, currentDate}) {  
    const renderHeader = () => {
      return (
        <div className="flex justify-between m-4">
          <button onClick={() => updateDateAndMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>Prev</button>
          <CardHeader>
            <CardTitle>{selectedMonth}</CardTitle>
          </CardHeader>
          <button onClick={() => updateDateAndMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>Next</button>
        </div>
      );
    };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
        <div className='grid grid-cols-7 gap-2'>
                {days.map((day, index) => (
          <div key={index} className="flex h-12 items-center justify-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        </div>
    );
  };
  
  const renderCells = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
  
    const attendanceDays = attendanceData?.map(entry => entry.day);
  
    // Calculate previous month's last days
    const prevMonthDays = [];
    const lastDayOfPrevMonth = new Date(year, month, 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      prevMonthDays.unshift(lastDayOfPrevMonth - i);
    }
  
    // Calculate next month's first days
    const nextMonthDays = [];
    const totalCells = 6 * 7; // 6 weeks, 7 days per week
    const remainingCells = totalCells - (daysInMonth + firstDayOfMonth);
    for (let i = 1; i <= remainingCells; i++) {
      nextMonthDays.push(i);
    }
  
    let days = [];
    let day = 1;
  
    for (let week = 0; week < 6; week++) {
      let weekDays = [];
      for (let weekDay = 0; weekDay < 7; weekDay++) {
        if (week === 0 && weekDay < firstDayOfMonth) {
          // Previous month days
          weekDays.push(
            <div key={`empty-${weekDay}`} className="flex h-12 items-center justify-center mt-2 rounded-md text-sm font-medium bg-neutral-950 bg-opacity-25">
              {prevMonthDays[weekDay]}
            </div>
          );
        } else if (day > daysInMonth) {
          // Next month days
          weekDays.push(
            <div key={`empty-${weekDay}`} className="flex h-12 items-center justify-center mt-2 rounded-md text-sm font-medium bg-neutral-950 bg-opacity-25">
              {nextMonthDays.shift()}
            </div>
          );
        } else {
          // Current month days
          const isPresent = attendanceDays?.includes(day) || false;
        const isSaturday = new Date(year, month, day).getDay() === 6; // Saturday is index 6 (0-indexed)
        weekDays.push(
          <div
            key={day}
            className={`flex h-12 items-center justify-center mt-2 rounded-md text-sm font-medium ${
              isPresent ? 'bg-green-500 text-white' : isSaturday ? 'bg-red-500 text-white' : 'bg-gray-600 bg-opacity-25 text-green-50'
            }`}
          >
            {day}
          </div>
        );
        day++;
      }
      }
      days.push(
        <div className="grid grid-cols-7 gap-2" key={week}>
          {weekDays}
        </div>
      );
      if (day > daysInMonth) {
        break;
      }
    }
  
    return <div>{days}</div>;
  };
  

  return (
    <div>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};
