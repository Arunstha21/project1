"use client";
import { useEffect, useState } from "react";
import FormFields from "@/app/component/FormFields";
import formFields from "./formFields.json";

function Validate(id, title, value="") {
  if (id === "userName") {
    const usernameRegex = /^[a-z0-9_.]{4,10}$/;
    if (!usernameRegex.test(value)) {
      return (`Invalid ${title}, characters should be lowercase letters and underscores, with a length between 4 to 10.`);
    }
  } else if (id === "password") {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$])[a-zA-Z0-9!@#$]{8,}$/;
    if (!passwordRegex.test(value)) {
      return (`Invalid ${title}, password must be at least 8 characters long and contain at least one lowercase letter.`);
    }
  } else if (formFields.userValidation[id] && value === "") {
    return (`${title} is required`);
  } else {
    return;
  }
}

export default function AddMembers({isVisible, onClose}) {
    if (!isVisible) return null;
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({});
  const { userFields } = formFields;

  function handleFieldChange(tag, title ,value=null) {
    setFormData({ ...formData, [tag]: {value:value, title:title} });
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
      setSuccess('');
    }, 6000);
  
    return () => clearTimeout(timer);
  }, [error, success]);

const userForm = [...userFields];

async function submit(event){
        event.preventDefault();

        let updatedFormData = {};
        userForm.forEach((field) => {
          const tag = field.tag;
          const title = field.title;
          updatedFormData[tag] = { value: null, title: title };
        });

        for (const field of Object.keys(updatedFormData)) {
          const fieldValue = formData[field] ? formData[field].value : null;
          const validationError = Validate(field, updatedFormData[field].title, fieldValue  );
          console.log({field, validationError});
          if (validationError) {
            setError(validationError);
            return;
          }
        }

        try {
          const response = await fetch(`/api/users/addUser`,{
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userName: formData.userName.value,
            password: formData.password.value,
            role: formData.role.value
          })
          
          })
          const res = await response.json();
          if(response.ok){
            setSuccess(res.success);
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
                {userForm.map((field, index) => (
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
