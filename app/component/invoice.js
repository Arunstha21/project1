'use client'
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export default function Invoice ({ invoiceData }) {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Invoice Record',
  });
  
  return (
    <div>
  <div ref={componentRef} className="bg-background text-card-foreground p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">School Management System</h1>
            <p className="text-muted-foreground">Tikathali, Lalitpur, Nepal</p>
            <p className="text-muted-foreground">support@schoolms.com | +977 9815922201</p>
          </div>
        </div>
        <div>
          <p className="text-right">
            <span className="font-bold">Invoice #:</span> {invoiceData.invoiceNumber}
          </p>
          <p className="text-right">
            <span className="font-bold">Date:</span> {invoiceData.date}
          </p>
        </div>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted text-muted-foreground">
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
          {invoiceData.items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="p-3 font-medium">{item.description}</td>
              <td className="p-3 text-right">{item.amount}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 text-right">
        <div className="grid grid-cols-2 gap-2">
          <div className="font-medium">Subtotal:</div>
          <div>{invoiceData.total}</div>
          {/* <div className="font-medium">Tax (8%):</div>
          <div>{((invoiceData.total*8)/100).toFixed(2)}</div> */}
          <div className="font-bold text-2xl">Grand Total:</div>
          <div className="font-bold text-2xl">{invoiceData.total}</div>
          {/* <div className="font-bold text-2xl">{(((invoiceData.total*8)/100)+invoiceData.total).toFixed(2)}</div> */}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Student Information</h2>
          <div>
            <div className="font-medium">Name: {invoiceData.studentName}</div>
          </div>
          <div>
            <div className="font-medium">Class: {invoiceData.className}</div>
          </div>
      </div>
    </div>
    <button onClick={handlePrint} className="bg-cyan-500 right-0 hover:bg-cyan-400 dark:hover:bg-cyan-600 text-white dark:bg-cyan-700 rounded-md px-4 mt-8 mr-8 py-2" >Print</button>
          </div>
  );
};