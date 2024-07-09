import React, { useState, useEffect } from "react";
import FormFields from "@/app/component/FormFields";
import { Card, CardHeader, CardTitle, CardContent } from "./card";
import { Edit, Landmark, ReceiptText, Trash } from "lucide-react";
import Table from "@/app/component/table";
import { uid } from 'uid';
import {GetEsewaPaymentHash} from "@/app/helpers/getEsewaPaymentHash";
const formFields = require("@/app/component/formFields.json");

const { invoiceFields } = formFields;

export default function InvoiceComponent({ action, studentId, allStudents }) {
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [invoiceFormData, setInvoiceFormData] = useState({});
  const [invoiceTableData, setInvoiceTableData] = useState();
  const paymentData = allStudents.find((payment) => payment._id === studentId)
  const paidAmount = paymentData?.esewaPayment?.amount || 0
  const [makePaymentAmount, setMakePaymentAmount] = useState(
    paymentData.amount - paidAmount
  );
  const [makePaymentButton, setMakePaymentButton] = useState("Make Payment")

  async function getInvoiceRecords() {
    try {
      const response = await fetch("/api/payment/feesRecord", {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        const filteredData = data.filter((d) => d.student._id === studentId);
        const tableData = filteredData.map((item, index) => ({
          id: item._id,
          data: [index + 1, item.month, item.amount],
        }));
        setInvoiceTableData(tableData);
      }
    } catch (error) {
      setError(error);
    }
  }

  const handleFieldChange = (tag, title, value = null) => {
    setInvoiceFormData((prevFormData) => ({
      ...prevFormData,
      [tag]: { value: value, title: title },
    }));
  };


  useEffect(() => {
    if (action === Landmark) {
      getInvoiceRecords();
    }
  }, [action]);

  if (action === ReceiptText) {
    const submit = async (event) => {
        event.preventDefault();
        
        const uuid = uid(16);
        let updatedFormData = {};
        invoiceFields.forEach((field) => {
          const tag = field.tag;
          const title = field.title;
          updatedFormData[tag] = {
            value: invoiceFormData[tag]?.value || "",
            title: title,
          };
        });
        console.log(updatedFormData);
        const studentData = allStudents.find(
          (student) => student._id === studentId
        );
    
        try {
          const response = await fetch("/api/payment/feesRecord", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(
              Object.keys(updatedFormData).reduce(
                (acc, key) => {
                  acc[key] = updatedFormData[key].value;
                  return acc;
                },
                { student: studentId, grade: studentData.studentInfo.grade._id,transactionUuid: uuid  }
              )
            ),
          });
    
          const res = await response.json();
          if (response.ok) {
            setSuccess(res.message);
            setError("");
          } else {
            setError(res.error || "An error occurred");
          }
        } catch (error) {
          setError(error.message || "Failed to submit data.");
        }
      };

    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Invoice</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-5 items-center font-bold">
          {invoiceFields.map((field, index) => (
            <FormFields
              key={index}
              field={field.field}
              tag={field.tag}
              title={field.title}
              type={field.type}
              required={field.required}
              onChangeValue={(e) =>
                handleFieldChange(field.tag, field.title, e.target.value)
              }
            />
          ))}
          <button
            id="submit"
            onClick={submit}
            className="bg-cyan-500 hover:bg-cyan-400 dark:hover:bg-cyan-600 text-white dark:bg-cyan-700 rounded-md px-2 py-1"
          >
            Submit
          </button>

          {success && (
            <p className="text-black dark:text-white text-sm mt-1">{success}</p>
          )}
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </CardContent>
      </Card>
    );
  } else if (action === Landmark) {
    const headers = ["SN", "Month", "Amount", "Status", "Paid Amount"];
    const actionButtons = [
      {
        label: Edit,
        color: "blue",
        onClick: (id) => {
          console.log("Edit CLicked");
        },
      },
      {
        label: Trash,
        color: "red",
        onClick: (id) => {
          console.log("Delete CLicked");
        },
      },
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle>Invoice Records</CardTitle>
        </CardHeader>
        <CardContent className="font-bold">
          <Table
            headers={headers}
            actionButtons={actionButtons}
            data={invoiceTableData}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </CardContent>
      </Card>
    );
  } else if (action === "Make Payment") {
    const submit = async () => {
        try {
            if (makePaymentAmount > paymentData.amount) {
                setError("Inserted Amount is greater then Invoice Amount !!")
                return;
            }
          const uuid = paymentData.transactionUuid;
          const esewaHash = await GetEsewaPaymentHash(makePaymentAmount, uuid);
    
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

          const successUrl = `http://localhost:3000/api/payment/esewa/success`
    
          const inputs = [
            { name: 'amount', value: makePaymentAmount },
            { name: 'tax_amount', value: 0 },
            { name: 'total_amount', value: parseInt(makePaymentAmount) },
            { name: 'transaction_uuid', value: uuid },
            { name: 'product_code', value: 'EPAYTEST' },
            { name: 'product_service_charge', value: '0' },
            { name: 'product_delivery_charge', value: '0' },
            { name: 'success_url', value: successUrl },
            { name: 'failure_url', value: 'http://localhost:3000/api/payment/esewa/fail' },
            { name: 'signed_field_names', value: esewaHash.signed_field_names },
            { name: 'signature', value: esewaHash.signature },
          ];
    
          inputs.forEach(inputData => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = inputData.name;
            input.value = inputData.value;
            form.appendChild(input);
          });
    
          document.body.appendChild(form);
          form.submit();
        } catch (error) {
          setError('Payment submission failed. Please try again.');
          console.error(error);
        }
      };
    
      return (
        <Card className="m-4">
          <CardHeader>
            <CardTitle>Make Payment</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-5 items-center font-bold">
            <div>
              <label htmlFor="makePayment">Amount</label>
              <input
                id="makePayment"
                type="number"
                placeholder="Amount"
                value={makePaymentAmount}
                onChange={(e) => {
                  setMakePaymentAmount(e.target.value);
                  setMakePaymentButton('Make Partial Payment');
                }}
                className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 dark:bg-cyan-950 dark:text-gray-300 focus:outline-none focus:border-rose-600"
              />
            </div>
            <button
              id="submit"
              onClick={submit}
              className="bg-cyan-500 hover:bg-cyan-400 dark:hover:bg-cyan-600 text-white dark:bg-cyan-700 rounded-md px-2 py-1"
            >
              {makePaymentButton}
            </button>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </CardContent>
        </Card>
      );
  } else {
    return <p>No content available for this action.</p>;
  }
}
