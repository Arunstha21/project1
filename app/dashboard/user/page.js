"use client";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import Table from "@/app/component/table";
import AddUsers from "@/app/component/AddUsers";
import { Edit, Trash } from "lucide-react";
import { Card, CardContent } from "../payment/_component/card";
import SearchComponent from "@/app/component/Search";

export default function Users() {
  const [error, setError] = useState("");
  const [headers, setHeaders] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isAddUserPopupOpen, setIsAddUserPopupOpen] = useState(false);
  const [isEditAddUserPopupOpen, setIsEditAddUserPopupOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [userDbData, setUserDbData] = useState([]);
  const [userDataForEdit, setUserDataForEdit] = useState({});
  const [searchQuery, setSearchQuery] = useState();
  const [filteredData, setFilteredData] = useState(tableData);

  const headersData = useMemo(()=> ["User Name", "Role", "Status"], []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredData(tableData);
    } else {
      const filtered = tableData.filter(item =>
        item.data.some(value => 
          value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, tableData]);

  const fetchTableData = useCallback(async () => {
    try {
      const response = await fetch("/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users data");
      }

      const data = await response.json();
      setUserDbData(data);
      const users = data.map((item) => ({
        id: item._id,
        data: [item.userName, item.role, item.status],
      }));

      setHeaders(headersData);
      setTableData(users);
    } catch (error) {
      console.error("Error fetching users data:", error);
      setError("Failed to fetch users data");
    }
  },[headersData]);

  useEffect(() => {
    fetchTableData();
  },[fetchTableData]);

  const handleAddOrEditUser = () => {
    fetchTableData();
    setIsAddUserPopupOpen(false);
    setIsEditAddUserPopupOpen(false);
  };

  const actionButtons = [
    {
      label: Edit,
      color: "blue",
      onClick: (id) => {
        setIsEditAddUserPopupOpen(true);
        setUserDataForEdit(userDbData.find((user) => user._id === id));
      },
    },
    {
      label: Trash,
      color: "red",
      onClick: (id) => {
        setDeletingUserId(id);
        setDeleteConfirmation(true);
      },
    },
  ];

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/users/${deletingUserId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      const updatedTableData = tableData.filter(
        (user) => user.id !== deletingUserId
      );
      setTableData(updatedTableData);
      setDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user");
    }
  };

  const Alert = ({ type, message }) => (
    <div
      className={`bg-${
        type === "success" ? "green" : "red"
      }-200 px-4 py-2 my-2 rounded-md text-sm text-${
        type === "success" ? "green" : "red"
      }-800`}
    >
      {message}
    </div>
  );

  return (
    <Fragment>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <div className="pb-4 flex justify-between items-center">
        <div className="mt-10">
          <SearchComponent queryInput={(v) => setSearchQuery(v)}/>
          </div>
          <div className="left-0">
            <button
              onClick={() => {
                setIsAddUserPopupOpen(true);
              }}
              className="bg-cyan-500 right-0 hover:bg-cyan-400 dark:hover:bg-cyan-600 text-white dark:bg-cyan-700 rounded-md px-4 mt-8 mr-8 py-2"
            >
              Add new
            </button>
          </div>
        </div>
      </div>

      <div>
        {deleteConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg dark:bg-cyan-950 shadow-lg text-center ">
              <p className="text-lg font-semibold">
                Are you sure you want to delete{" "}
                {tableData.find((user) => user.id === deletingUserId)?.data[0]}{" "}
                data?
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
        <Card className='xl:w-5/12'>
          <CardContent className="p-5">
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <Table
              headers={headers}
              data={filteredData}
              actionButtons={actionButtons}
            />
          </div>
          </CardContent>
        </Card>

        {error && <Alert type="error" message={error} />}
        {isEditAddUserPopupOpen && (
          <AddUsers
            isVisible={isEditAddUserPopupOpen}
            onClose={() => setIsEditAddUserPopupOpen(false)}
            userDataForEdit={userDataForEdit}
            onAddOrEditUser={handleAddOrEditUser}
          />
        )}
        {isAddUserPopupOpen && (
          <AddUsers
            isVisible={isAddUserPopupOpen}
            onClose={() => setIsAddUserPopupOpen(false)}
            onAddOrEditUser={handleAddOrEditUser}
          />
        )}
      </div>
    </Fragment>
  );
}
