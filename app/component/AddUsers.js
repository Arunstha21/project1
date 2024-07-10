"use client";
import { useEffect, useState } from "react";
import FormFields from "@/app/component/FormFields";
import formFields from "./formFields.json";

function Validate(id, title, value = "") {
  if (id === "userName") {
    const usernameRegex = /^[a-z0-9_.]{4,10}$/;
    if (!usernameRegex.test(value)) {
      return `Invalid ${title}, characters should be lowercase letters and underscores, with a length between 4 to 10.`;
    }
  } else if (id === "password") {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$])[a-zA-Z0-9!@#$]{8,}$/;
    if (!passwordRegex.test(value)) {
      return `Invalid ${title}, password must be at least 8 characters long and contain at least one lowercase letter.`;
    }
  } else if (formFields.userValidation[id] && value === "") {
    return `${title} is required`;
  } else {
    return;
  }
}

export default function AddUsers({ isVisible, onClose, userDataForEdit, onAddOrEditUser }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({});
  const { userFields } = formFields;

  useEffect(() => {
    const initialFormData = {};
    userFields.forEach((field) => {
      let value = "";
      if (userDataForEdit && field.tag in userDataForEdit) {
        value = userDataForEdit[field.tag];
      }
      initialFormData[field.tag] = {
        value: value,
        title: field.title,
      };
    });
    if (userDataForEdit) {
      initialFormData.status = {
        value: userDataForEdit.status || "",
        title: "Status",
      };
    }
    setFormData(initialFormData);
  }, [isVisible, userDataForEdit, userFields]);

  function handleFieldChange(tag, title, value = null) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [tag]: { value: value, title: title },
    }));
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
      setSuccess('');
    }, 6000);
  
    return () => clearTimeout(timer);
  }, [error, success]);

  async function submit(event) {
    event.preventDefault();

    let updatedFormData = {};
    userFields.forEach((field) => {
      const tag = field.tag;
      const title = field.title;
      updatedFormData[tag] = { value: formData[tag]?.value || "", title: title };
    });

    for (const field in updatedFormData) {
      const fieldValue = updatedFormData[field].value;
      const validationError = Validate(field, updatedFormData[field].title, fieldValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    try {
      let url = "/api/users/addUser";
      let method = "POST";

      if (userDataForEdit) {
        url = `/api/users/${userDataForEdit._id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          Object.keys(updatedFormData).reduce((acc, key) => {
            acc[key] = updatedFormData[key].value;
            return acc;
          }, {})
        ),
      });

      const res = await response.json();
      if (response.ok) {
        if(onAddOrEditUser){
          onAddOrEditUser()
        }
        setSuccess(res.message);
        setError("");
      } else {
        setError(res.error || "An error occurred");
      }
    } catch (error) {
      setError(error.message || "Failed to submit data.");
    }
  }

  function handleClose(e) {
    if (e.target.id === "wrapper") {
      onClose();
    }
  }

  return (
    <div onClick={handleClose} id="wrapper" className={`fixed inset-0 min-h-full min-w-full bg-gray-100 dark:bg-sky-950 bg-opacity-5 backdrop-blur-sm dark:bg-opacity-5 dark:backdrop-blur-sm py-6 flex flex-col justify-center sm:py-12 ${!isVisible ? 'hidden' : ''}`}>
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white dark:bg-cyan-950 shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl text-black dark:text-white font-semibold">
                {userDataForEdit ? "Edit User" : "Add User"}
              </h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                {userFields.map((field, index) => {
                  if (!field.editOnly || userDataForEdit) {
                    return (
                      <FormFields
                        key={index}
                        field={field.field}
                        tag={field.tag}
                        title={field.title}
                        type={field.type}
                        options={field.options}
                        required={field.required}
                        value={formData[field.tag] ? formData[field.tag].value : ""}
                        onChangeValue={(e) =>
                          handleFieldChange(field.tag, field.title, e.target.value)
                        }
                      />
                    );
                  }
                  return null;
                })}
                {userDataForEdit && (
                  <FormFields
                    key="status"
                    field="status"
                    tag="status"
                    title="Status"
                    type="text"
                    required={false}
                    value={formData.status ? formData.status.value : ""}
                    onChangeValue={(e) => handleFieldChange("status", "Status", e.target.value)}
                  />
                )}
                <div className="relative">
                  <button id="submit" onClick={submit} className="bg-cyan-500 hover:bg-cyan-400 dark:hover:bg-cyan-600 text-white dark:bg-cyan-700 rounded-md px-2 py-1">
                    Submit
                  </button>
                  <button id="close" onClick={onClose} className="bg-cyan-500 hover:bg-cyan-400 dark:hover:bg-cyan-600 text-white dark:bg-cyan-700 rounded-md ml-4 px-2 py-1">
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
