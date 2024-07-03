import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Table({ headers, data, actionButtons }) {
  const router = useRouter();
// To DO Add Table shorting
  return (
    <div className=" overflow-x-auto">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-sky-500 dark:text-white">
            <tr>
                {headers.map((header, index) => (
                    <th key={index} scope="col" className="px-6 py-3">
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
            {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="bg-white border-b dark:bg-transparent dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    {row.map((item, columnIndex) => (
                        <td key={columnIndex} className="dark:text-white px-6 py-4">
                            {item}
                        </td>
                    ))}
                    {actionButtons && (
                        <td className="flex items-center px-6 py-4">
                            {actionButtons.map((button, buttonIndex) => (
                                <button key={buttonIndex} onClick={button.onClick} className={`font-medium text-${button.color}-600 dark:text-${button.color}-500 hover:underline mx-3`}>
                                    <button.label/>
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
