'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState("")
  const [user, setUser] = useState({
    userName: '',
    password: ''
  });
  
  function clearError() {
    setInterval(() => {
      setError("");
    }, 6000);
  }

  async function login() {
    if (!user.userName || !user.password) {
      setError('User Name and Password are required');
      clearError();
      return
    }
    try {
      const response = await fetch(`/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: user.userName,
          password: user.password,
        }),
      });
      const resData = await response.json();
      if (response.ok) {
        setError("");
        router.push("/dashboard");
      } else if (response.status === 500) {
        setError(resData.error);
        clearError();
      } else {
        setError("Error, Try again!");
        clearError();
      }
    } catch (error) {
      console.log(error);
      setError(`${error} :: Try again!`);
      clearError();
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-sky-950 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white dark:bg-cyan-950 shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl text-black dark:text-white font-semibold">Login</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <input
                    autoComplete="off"
                    value={user.userName}
                    onChange={(e)=> setUser({...user, userName: e.target.value})}
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 dark:bg-cyan-950 dark:text-gray-300 focus:outline-none focus:borer-rose-600"
                    placeholder="User Name"
                  />
                  <label
                    htmlFor="userName"
                    className="absolute dark:text-gray-300 left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 dark:peer-focus:text-gray-300 peer-focus:text-sm"
                  >
                    User Name
                  </label>
                </div>
                <div className="relative">
                  <input
                    autoComplete="off"
                    type="password"
                    value={user.password}
                    onChange={(e)=> setUser({...user, password: e.target.value})}
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 dark:bg-cyan-950 dark:text-gray-300 focus:outline-none focus:borer-rose-600"
                    placeholder="Password"
                  />
                  <label
                    htmlFor="password"
                    className="absolute dark:text-gray-300 left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 dark:peer-focus:text-gray-300 peer-focus:text-sm"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <button onClick={login} className="bg-cyan-500 hover:bg-cyan-400 dark:hover:bg-cyan-600 text-white dark:bg-cyan-700 rounded-md px-2 py-1">
                    Submit
                  </button>
                </div>
              </div>
            </div>
            <div>{error}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
