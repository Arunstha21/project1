import React, { useState, useEffect } from "react";
import { Collapsible } from "../dashboard/payment/_component/Collapsible";
import InvoiceComponent from "../dashboard/payment/_component/collapComp";

export default function Table({ headers, data, actionButtons, payment, fetchPaymentData, isEditing}) {
  const [tableData, setTableData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [action, setAction] = useState();
  const [studentId, setStudentId] = useState();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [editingRowIndex, setEditingRowIndex] = useState(null);

  useEffect(() => {
    setTableData(data);

  }, [data]);

  useEffect(() => {
    if (!isEditing) {
      return;
    }
    if (!isEditing.status) {
      setEditingRowIndex(null)
    }
    if (isEditing.status) {
      setEditingRowIndex(isEditing.id)
    }
  }, [isEditing]);


  const handleInputChange = (value, rowIndex, columnIndex) => {
    const newData = [...data];
    newData[rowIndex].data[columnIndex] = value;
    setTableData(newData);
  };

  const handleRowToggle = (rowIndex, action, studentId) => {
    setSelectedRow(selectedRow === rowIndex ? null : rowIndex);
    setAction(action);
    setStudentId(studentId);
  };

  const handleSort = (index) => {
    let direction = "asc";
    if (sortConfig.key === index && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...tableData].sort((a, b) => {
      const aValue = a.data[index];
      const bValue = b.data[index];

      if (isNaN(aValue) || isNaN(bValue)) {
        return aValue.localeCompare(bValue) * (direction === "asc" ? 1 : -1);
      } else {
        return (aValue - bValue) * (direction === "asc" ? 1 : -1);
      }
    });

    setSortConfig({ key: index, direction });
    setTableData(sortedData);
  };

  return (
    <div className="overflow-x-auto">
      <table
        id="sortable-table"
        className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
      >
        <thead className=" bg-gray-50 dark:bg-sky-500 dark:text-white">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                onClick={() => handleSort(index)}
                className="cursor-pointer px-6 py-3"
              >
                {header}
                {sortConfig.key === index && (
                  <span className="ml-1">
                    {sortConfig.direction === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </th>
            ))}
            {actionButtons && (
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody className="overflow-y-auto">
          {tableData?.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <tr
                key={rowIndex}
                className="bg-white border-b dark:bg-transparent dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {row.data.map((item, columnIndex) => (
                  <td key={columnIndex} className="dark:text-white px-6 py-4">
                    {editingRowIndex === row.id && (
                      ((columnIndex === 1 || columnIndex === 2) && (
                        <input
                          type={columnIndex === 1 ? "month" : "text"}
                          value={item}
                          onChange={(e) => handleInputChange(e.target.value, rowIndex, columnIndex)}
                          className="peer placeholder-transparent h-10 border-b-2 border-gray-300 text-gray-900 dark:bg-cyan-950 dark:text-gray-300 focus:outline-none focus:border-rose-600"
                        />
                      )) || (
                        item
                      )
                    )}
                    {editingRowIndex !== row.id && (
                      typeof item?.value === "boolean" ? (
                        <input
                          type="checkbox"
                          onChange={item.onchange}
                          checked={item.value}
                          disabled={item.disabled}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded hover:ring-blue-500 dark:hover:ring-blue-600 dark:ring-offset-gray-800 hover:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                      ) : (
                        item
                      )
                    )}
                  </td>
                ))}
                {editingRowIndex === row.id &&(actionButtons && (
                  <td className="flex items-center px-6 py-4">
                    {actionButtons.slice(2,3).map((button, buttonIndex) => (
                      <button
                        key={buttonIndex}
                        onClick={() => {
                           if(isEditing?.status){
                            button.onClick(row);
                          }
                        }}
                        className={`font-medium text-${
                          button.color
                        }-600 dark:text-${button.color}-500 ${button.extraClass} hover:underline mx-3`}
                      >
                        {typeof button.label === "string" ? (
                          button.label
                        ) : (
                          <button.label />
                        )}
                      </button>
                    ))}
                    </td>
                ))}
                {editingRowIndex !== row.id && (actionButtons && (
                  <td className="flex items-center px-6 py-4">
                    {actionButtons.slice(0,2).map((button, buttonIndex) => (
                      <button
                        key={buttonIndex}
                        onClick={() => {
                          if (payment) {
                            handleRowToggle(rowIndex, button.label, row.id);
                          } else {
                            button.onClick(row.id);
                          }
                        }}
                        disabled={row.isPaid ? row.isPaid : false}
                        className={`font-medium text-${
                          button.color
                        }-600 dark:text-${button.color}-500 ${button.extraClass} hover:underline mx-3`}
                      >
                        {typeof button.label === "string" ? (
                          button.label
                        ) : (
                          <button.label />
                        )}
                      </button>
                    ))}
                  </td>
                ))}
              </tr>
              {selectedRow === rowIndex && (
                <tr>
                  <td colSpan={headers.length + (actionButtons ? 1 : 0)}>
                    <Collapsible>
                      <InvoiceComponent
                        allStudents={payment}
                        action={action}
                        studentId={studentId}
                        fetchPaymentData={fetchPaymentData}
                      />
                    </Collapsible>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}