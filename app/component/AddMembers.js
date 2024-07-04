"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FormFields from "@/app/component/FormFields";
import formFields from "./formFields.json";
import Validate from "@/app/component/Validation";

export default function AddUsers({isVisible, onClose}) {
    if (!isVisible) return null;
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({});
  const [memberType, setMemberType] = useState("");
  const [success, setSuccess] = useState("")
  const { generalFields, studentFields, staffFields } = formFields;

  function handleFieldChange(tag, title ,value=null) {
    setFormData({ ...formData, [tag]: {value:value, title:title} });
  }

  function handleTypeChange(e) {
    setMemberType(e.target.value);
    setFormData({type: {value:e.target.value, title:"Type"}});
  }

useEffect(()=>{
  setInterval(()=>
  setError(''), 6000)
},[error])

let typeSpecificFields = [];
if (memberType === "Student") {
  typeSpecificFields = studentFields;
} else if (memberType === "Staff") {
  typeSpecificFields = staffFields;
}
const combinedItems = [...generalFields, ...typeSpecificFields];

async function submit(event){
        event.preventDefault();

        let updatedFormData = {};
        combinedItems.forEach((field) => {
          const tag = field.tag;
          const title = field.title;
          updatedFormData[tag] = { value: null, title: title };
        });

        for (const field of Object.keys(updatedFormData)) {
          const fieldValue = formData[field] ? formData[field].value : null;
          const validationError = Validate(field, updatedFormData[field].title, fieldValue  );
          if (validationError) {
            setError(validationError);
            return;
          }
        }
        console.log(formData);
        try {
          const response = await fetch(`/api/members`,{
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
          })
          const res = await response.json();
          if(response.ok){
            setSuccess(res.message);
          }else if(response.status === 400){
            setError(res.error)
          }
        } catch (error) {
          setError(error)
        }
}
function handelClose (e){
  if(e.target.id === "wrapper"){
    onClose()
  }
}

  return (
    <div onClick={handelClose} id="wrapper" className=" fixed inset-0 min-h-full min-w-full bg-gray-100 dark:bg-sky-950 bg-opacity-5 backdrop-blur-sm dark:bg-opacity-5 dark:backdrop-blur-sm py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white dark:bg-cyan-950 shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl text-black dark:text-white font-semibold">
                Add Members
              </h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div key="typeElement-11" className="relative">
                    <label
                      htmlFor="type"
                      className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                    >
                      Select Type
                    </label>
                    <select
                      id="type"
                      placeholder="Type"
                      onChange={handleTypeChange}
                      className="border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-cyan-950 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="">Select Option</option>
                      <option value="Student">Student</option>
                      <option value="Staff">Staff</option>
                    </select>
                </div>
                {combinedItems.map((field, index) => (
                <FormFields
                  key={index}
                  field={field.field}
                  tag={field.tag}
                  title={field.title}
                  type={field.type}
                  options={field.options}
                  required={field.required}
                  onChangeValue={(e) => handleFieldChange(field.tag, field.title, e.target.value)}
                />
              ))}
                <div className="relative">
                  <button id="submit" onClick={submit} className="bg-cyan-500 hover:bg-cyan-400 dark:hover:bg-cyan-600 text-white dark:bg-cyan-700 rounded-md px-2 py-1">
                    Submit
                  </button>
                  <button id="close" onClick={()=>{onClose()}} className="bg-cyan-500 hover:bg-cyan-400 dark:hover:bg-cyan-600 text-white dark:bg-cyan-700 rounded-md ml-4 px-2 py-1">
                    Close
                  </button>
                </div>
              </div>
            </div>
            {success && <p className="text-white text-sm mt-1">{success}</p>}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
