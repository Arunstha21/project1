import React, { useState, useEffect } from "react";
import FormFields from "@/app/component/FormFields";
import { Card, CardHeader, CardTitle, CardContent } from "./card";
import { Check, Edit, Landmark, ReceiptText, Trash } from "lucide-react";
import Table from "@/app/component/table";
import { uid } from 'uid';
import {GetEsewaPaymentHash} from "@/app/helpers/getEsewaPaymentHash";
import { useRouter } from "next/router";
const formFields = require("@/app/component/formFields.json");

const { invoiceFields } = formFields;

export default function InvoiceComponent({ action, studentId, allStudents, fetchPaymentData }) {
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [invoiceFormData, setInvoiceFormData] = useState({});
  const [invoiceTableData, setInvoiceTableData] = useState();
  const paymentData = allStudents.find((payment) => payment._id === studentId)
  const paidAmount = paymentData?.esewaPayments?.reduce((total, payment) => total + payment.amount, 0) || 0
  const [makePaymentAmount, setMakePaymentAmount] = useState(
    paymentData.amount - paidAmount
  );
  const [makePaymentButton, setMakePaymentButton] = useState("Make Payment")
  const [invoiceOf, setInvoiceOf] = useState();
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deletingFeesId, setDeletingFeesId] = useState(null);
  const [isEditing, setIsEditing] = useState({status: false, id: null});
  const router = useRouter();

  async function getInvoiceRecords() {
    try {
      const response = await fetch("/api/payment/feesRecord", {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        const filteredData = data.filter((d) => d.student._id === studentId);
        const nameOnInvoice = filteredData[0]?.student?.fullName;
        setInvoiceOf(nameOnInvoice ? 'of '+ nameOnInvoice : '');
        const tableData = filteredData.map((item, index) => {
            let status = "Unpaid";
            let paid = item.esewaPayments.reduce((total, payment) => total + payment.amount, 0);
            if (item.amount === paid) {
                status = "Paid";
              } else if (paid > 0 && item.amount > paid) {
                status = "Partial Paid";
              }
            
            return {
              isPaid : status === "Paid" ? true : false,
              id: item._id,
              data: [
                index + 1,
                item.month,
                item.amount,
                paid,
                status
              ],
            };
          });
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
            fetchPaymentData()
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
    const headers = ["SN", "Month", "Amount", "Paid Amount", "Status"];
    const actionButtons = [
      {
        label: Edit,
        color: "blue",
        onClick: (id) => {
          setIsEditing({status: !isEditing.status, id: id})
        },
      },
      {
        label: Trash,
        color: "red",
        onClick: (id) => {
          setDeletingFeesId(id);
          setDeleteConfirmation(true);
        },
      },
      {
        label: Check,
        color: "white",
        onClick: ( data) => {
          submitEdit(data)
        },
      }
    ];

    async function submitEdit(data){
      const updatedData = {
        amount: data.data[2],
        month: data.data[1]
      }

      try {
        const response = await fetch(`/api/payment/feesRecord/${data.id}`,{
          method: "PUT",
          body: JSON.stringify(updatedData)
        })
        const res = await response.json();
        if (response.ok) {
          fetchPaymentData();
          getInvoiceRecords();
          setIsEditing({status: !isEditing.status, id: null})
        }
        if (response.status === 404) {
          setError(res.error);
        }
      } catch (error) {
        setError("Error Updating data", error);
      }
    }



  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/payment/feesRecord/${deletingFeesId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete invoice record");
      }
      fetchPaymentData();
      getInvoiceRecords();
      setDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting invoice record:", error);
      setError("Failed to delete invoice record");
    }
  };

    if (invoiceTableData?.length > 0) {
      return (
        <div>
        {deleteConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg dark:bg-cyan-950 shadow-lg text-center ">
              <p className="text-lg font-semibold">
                Are you sure you want to delete data ?
              </p>
              <div className="mt-4 space-x-4">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                  onClick={confirmDelete}
                >
                  Confirm Delete
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                  onClick={() => setDeleteConfirmation(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Records {invoiceOf}</CardTitle>
          </CardHeader>
          <CardContent className="font-bold">
            <Table
              headers={headers}
              actionButtons={actionButtons}
              data={invoiceTableData}
              isEditing={isEditing}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </CardContent>
        </Card>
        </div>
      )
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>No Invoice Records</CardTitle>
        </CardHeader>
      </Card>);
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

          const successUrl = `${router.asPath}/api/payment/esewa/success`
    
          const inputs = [
            { name: 'amount', value: makePaymentAmount },
            { name: 'tax_amount', value: 0 },
            { name: 'total_amount', value: parseInt(makePaymentAmount) },
            { name: 'transaction_uuid', value: uuid },
            { name: 'product_code', value: 'EPAYTEST' },
            { name: 'product_service_charge', value: '0' },
            { name: 'product_delivery_charge', value: '0' },
            { name: 'success_url', value: successUrl },
            { name: 'failure_url', value: `${router.asPath}/api/payment/esewa/fail` },
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
