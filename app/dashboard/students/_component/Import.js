import { useState } from "react";
import { readString } from "react-papaparse";

export default function CsvUpload({ fetchTableData }) {
  const [csvData, setCsvData] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const parsedData = readString(reader.result, { header: true });
      setCsvData(parsedData.data);
    };

    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!csvData) return;

    setIsUploading(true);
    const response = await fetch("/api/members/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(csvData),
    });

    setIsUploading(false);
    if (response.ok) {
      console.log("Data imported successfully");
      fetchTableData();
      setModalIsOpen(false);
    } else {
      console.error("Failed to import data");
    }
  };

  const handleDownloadSample = () => {
    const sampleData = [
      [
        "fullName",
        "dateOfBirth",
        "address",
        "gender",
        "contactNo",
        "email",
        "bloodGroup",
        "studentId",
        "grade",
        "yearEnrolled",
        "type",
      ],
      [
        "John Doe",
        "2000-01-01",
        "123 Main St",
        "Male",
        "1234567890",
        "john.doe@example.com",
        "O+",
        "S123",
        "G10",
        "2022",
        "Student",
      ],
    ];
    const csvContent = sampleData.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sample.csv";
    link.click();
  };

  return (
    <div>
      <button
        onClick={() => setModalIsOpen(true)}
        className="bg-cyan-500 right-0 hover:bg-cyan-400 dark:hover:bg-cyan-600 text-white dark:bg-cyan-700 rounded-md px-4 mt-8 mr-8 py-2"
      >
        Import CSV
      </button>
      {modalIsOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="dark:bg-cyan-700 p-8 bg-white rounded-lg shadow-lg w-96">
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Upload file
            </label>
            <input
              className="block w-full text-sm text-gray-900 border mb-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              accept=".csv"
              onChange={handleFileUpload}
              type="file"
            />
            <button
              onClick={handleDownloadSample}
              className="px-4 py-2 bg-gray-500 text-white mr-2 rounded-lg hover:bg-gray-700 transition mb-2"
            >
              Download Sample File
            </button>
            <button
              onClick={handleSubmit}
              disabled={isUploading}
              className={`px-4 py-2 text-white rounded-lg transition mr-2 mb-2 ${
                isUploading ? "bg-gray-400" : "bg-green-500 hover:bg-green-700"
              }`}
            >
              {isUploading ? "Uploading..." : "Import CSV"}
            </button>
            <button
              onClick={() => setModalIsOpen(false)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
