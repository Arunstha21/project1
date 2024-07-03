"use client"
import { useEffect, useState } from "react";
import Validate from "./Validation";

export default function FormFields({field, tag, title, type = "", options = [], required , onChangeValue}) {
    const [error, setError] = useState("")
    
    const handleOnBlur = (event) => {
        const value = event.target.value;
      if (required && !value) {
        setError(`${title} is required`);
      } else {
        setError("");
        setError(Validate(tag, title,value));
      }
    };

    if (field === "input") {
      return (
        <div className="relative">
          <input
            autoComplete="off"
            id={tag}
            type={type}
            className={type === "file" ? "block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-cyan-950 dark:border-gray-600 dark:placeholder-gray-400" : "peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 dark:bg-cyan-950 dark:text-gray-300 focus:outline-none focus:borer-rose-600"}
            placeholder={title}
            onBlur={handleOnBlur}
            onChange={onChangeValue}
          />
          <label
            htmlFor={tag}
            className="absolute dark:text-gray-300 left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 dark:peer-focus:text-gray-300 peer-focus:text-sm"
          >
            {title}
          </label>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );
    } else if (field === "select") {
      const optionElements = options.map((option, index) => (
        <option key={index} value={option.value}>{option.title}</option>
      ));
      return (
        <div className="relative">
          <label htmlFor={tag} className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300" >Select {title}</label>
          <select
            id={tag}
            onBlur={handleOnBlur}
            placeholder={title}
            onChange={onChangeValue}
            className="border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-cyan-950 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Select Option</option>
            {optionElements}
          </select>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );
    } else {
      return null;
    }
  };