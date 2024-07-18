'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header () {
   const [user, setUser] = useState({});
   const router = useRouter();
   const [isOpen, setIsOpen] = useState(false);

   useEffect(() => {
       const fetchProfile = async () => {
           try {
               const response = await fetch('/api/users/profile', {
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json'
                   }
               });
               if (response.ok) {
                   const profileData = await response.json();
                   setUser(profileData);
               } else {
                   console.error('Failed to fetch profile');
               }
           } catch (error) {
               console.error('Error fetching profile:', error);
           }
       };

       fetchProfile();
   }, []);

   function handelClose (e){
    if(e.target.id === "wrapper"){
        setIsOpen(false)
    }
  }

  async function handleLogout(){
    try {
        const response = await fetch('/api/users/logout',{
            method: 'POST'
        })
        if (response.ok) {
            setIsOpen(false);
            router.push('/');
        }
    } catch (error) {
        console.log(error);
    }

    
  }

 return (
    <div onClick={handelClose} id="wrapper" className="min-w-full border-2 border-sky-500 rounded-lg mr-2 p-4 shadow-sm bg-white flex justify-between text-gray-900 dark:bg-cyan-950 dark:text-gray-300">
      <div>

      </div>
    <div>
        <button onClick={() => setIsOpen(!isOpen)}>
        <Image src={'/user.png'} width={35} height={35} alt="user" className="rounded-full"/>
        </button>
    </div>
    {isOpen && (
        <div className="absolute right-0 mt-10 mr-2 w-48 origin-top-right border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none bg-white">
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-cyan-950 dark:bg-sky-500 dark:text-white rounded-md"
              onClick={handleLogout}
            >
              Logout
            </button>
        </div>
      )}
    </div>
 )
}