import { useState, useEffect } from "react";

export default function Table({ headers, data, actionButtons }) {
  const [tableData, setTableData] = useState([]);
  console.log(tableData);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (index) => {
    let direction = "asc";
    if (sortConfig.key === index && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...tableData].sort((a, b) => {
      const aValue = a[index];
      const bValue = b[index];

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
            <tr
              key={rowIndex}
              className="bg-white border-b dark:bg-transparent dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {row.data.map((item, columnIndex) => (
                <td key={columnIndex} className="dark:text-white px-6 py-4">
                  {typeof item.value === 'boolean' ? <input type="checkbox" onChange={item.onchange} checked={item.value} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded hover:ring-blue-500 dark:hover:ring-blue-600 dark:ring-offset-gray-800 hover:ring-2 dark:bg-gray-700 dark:border-gray-600"/> : item}
                </td>
              ))}
              {actionButtons && (
                <td className="flex items-center px-6 py-4">
                  {actionButtons.map((button, buttonIndex) => (
                    <button
                      key={buttonIndex}
                      onClick={() => button.onClick(row.id)}
                      className={`font-medium text-${button.color}-600 dark:text-${button.color}-500 hover:underline mx-3`}
                    >
                      {typeof button.label === "string" ? (
                        button.label
                      ) : (
                        <button.label />
                      )}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
