"use client";
import { useEffect, useMemo, useState } from "react";
import FormFields from "@/app/component/FormFields";
import formFields from "./formFields.json";
import Validate from "@/app/component/Validation";

export default function AddMembers({
  isVisible,
  onClose,
  memberDataForEdit,
  onAddOrEditMember,
}) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({});
  const [memberType, setMemberType] = useState("");
  const { generalFields, studentFields, staffFields } = formFields;
  const [updatedStudentFields, setStudentFields] = useState(studentFields);

  useEffect(() => {
    const fetchStudentFields = async () => {
      try {
        const response = await fetch("/api/members/grade", {
          method: "GET",
        });
        const gradesData = await response.json();

        const updatedFields = studentFields.map((field) => {
          if (field.tag === "grade") {
            const options = gradesData
              .sort((a, b) => a.grade - b.grade)
              .map((grade) => ({
                value: grade._id,
                title: `Grade ${grade.grade}`,
              }));
            return { ...field, options };
          }
          return field;
        });

        setStudentFields(updatedFields);
      } catch (error) {
        console.error("Error fetching grades:", error);
      }
    };

    fetchStudentFields();
  }, [studentFields]);

  const initialFormData = useMemo(() => {
    const initialFormData = {};
    const type = memberDataForEdit?.studentInfo ? "Staff" : "Student";
    const fieldsToIterate = [
      ...generalFields,
      ...(type === "Student" ? updatedStudentFields : staffFields),
    ];

    for (const field of fieldsToIterate) {
      let value = "";
      if (
        type === "Student" &&
        memberDataForEdit?.studentInfo &&
        field.tag in memberDataForEdit.studentInfo
      ) {
        value = memberDataForEdit.studentInfo[field.tag];
      } else if (
        type === "Staff" &&
        memberDataForEdit?.staffInfo &&
        field.tag in memberDataForEdit.staffInfo
      ) {
        value = memberDataForEdit.staffInfo[field.tag];
      } else if (memberDataForEdit && field.tag in memberDataForEdit) {
        value = memberDataForEdit[field.tag];
      }
      if (field.tag === "dateOfBirth" && memberDataForEdit?.dateOfBirth) {
        const dateOfBirth = new Date(memberDataForEdit.dateOfBirth);
        value = dateOfBirth.toISOString().split("T")[0];
      }

      initialFormData[field.tag] = {
        value: value,
        title: field.title,
      };
    }

    if (memberDataForEdit) {
      initialFormData.status = {
        value: memberDataForEdit.status || "",
        title: "Status",
      };
    }

    return initialFormData;
  }, [generalFields, memberDataForEdit, staffFields, updatedStudentFields]);

  useEffect(() => {
    setFormData(initialFormData);
    setMemberType(memberDataForEdit?.studentInfo ? "Staff" : "Student");
  }, [initialFormData]);

  function handleFieldChange(tag, title, value = null) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [tag]: { value: value, title: title },
    }));
  }

  function handleTypeChange(e) {
    const selectedType = e.target.value;
    setMemberType(selectedType);
    setFormData((prevFormData) => ({
      ...prevFormData,
      type: { value: selectedType, title: "Type" },
    }));
  }

  const typeSpecificFields =
    memberType === "Student"
      ? updatedStudentFields
      : memberType === "Staff"
      ? staffFields
      : [];
  const combinedItems = [...generalFields, ...typeSpecificFields];

  async function submit(event) {
    event.preventDefault();

    let updatedFormData = {};
    combinedItems.forEach((field) => {
      const tag = field.tag;
      const title = field.title;
      updatedFormData[tag] = {
        value: formData[tag]?.value || "",
        title: title,
      };
    });

    if (memberDataForEdit) {
      updatedFormData.status = {
        value: formData.status?.value || "",
        title: "Status",
      };
    }

    for (const field in updatedFormData) {
      const fieldValue = updatedFormData[field].value;
      const validationError = Validate(
        field,
        updatedFormData[field].title,
        fieldValue
      );
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    try {
      let url = "/api/members";
      let method = "POST";

      if (memberDataForEdit) {
        url = `/api/members/${memberDataForEdit._id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          Object.keys(updatedFormData).reduce(
            (acc, key) => {
              acc[key] = updatedFormData[key].value;
              return acc;
            },
            { type: memberType }
          )
        ),
      });

      const res = await response.json();
      if (response.ok) {
        if (onAddOrEditMember) {
          onAddOrEditMember();
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
    <div
      onClick={handleClose}
      id="wrapper"
      className={`fixed inset-0 min-h-full min-w-full bg-gray-100 dark:bg-sky-950 bg-opacity-5 backdrop-blur-sm dark:bg-opacity-5 dark:backdrop-blur-sm py-6 flex flex-col justify-center sm:py-12 ${
        !isVisible ? "hidden" : ""
      }`}
    >
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white dark:bg-cyan-950 shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl text-black dark:text-white font-semibold">
                {memberDataForEdit ? "Edit Member" : "Add Member"}
              </h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
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
                    value={memberType}
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
                    value={formData[field.tag] ? formData[field.tag].value : ""}
                    onChangeValue={(e) =>
                      handleFieldChange(field.tag, field.title, e.target.value)
                    }
                  />
                ))}
                {memberDataForEdit && (
                  <FormFields
                    key="status"
                    field="status"
                    tag="status"
                    title="Status"
                    type="text"
                    required={false}
                    value={formData.status ? formData.status.value : ""}
                    onChangeValue={(e) =>
                      handleFieldChange("status", "Status", e.target.value)
                    }
                  />
                )}
                <div className="relative">
                  <button
                    id="submit"
                    onClick={submit}
                    className="bg-cyan-500 hover:bg-cyan-400 dark:hover:bg-cyan-600 text-white dark:bg-cyan-700 rounded-md px-2 py-1"
                  >
                    Submit
                  </button>
                  <button
                    id="close"
                    onClick={onClose}
                    className="bg-cyan-500 hover:bg-cyan-400 dark:hover:bg-cyan-600 text-white dark:bg-cyan-700 rounded-md ml-4 px-2 py-1"
                  >
                    Close
                  </button>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
