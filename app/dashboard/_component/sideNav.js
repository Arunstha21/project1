"use client";
import {
  GraduationCap,
  HandIcon,
  LayoutIcon,
  ScanBarcode,
  Settings,
  User,
  User2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./header";

export default function SideNav() {
  const [user, setUser] = useState({});
  const [menuList, setMenuList] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const adminMenuList = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutIcon,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Members",
      icon: GraduationCap,
      path: "/dashboard/students",
    },
    {
      id: 3,
      name: "Attendance",
      icon: HandIcon,
      path: "/dashboard/attendance",
    },
    {
      id: 4,
      name: "User",
      icon: User2Icon,
      path: "/dashboard/user",
    },
    {
      id: 5,
      name: "Payment",
      icon: ScanBarcode,
      path: "/dashboard/payment",
    },
  ];
  const staffMenuList = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutIcon,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Students",
      icon: GraduationCap,
      path: "/dashboard/students",
    },
    {
      id: 3,
      name: "Attendance",
      icon: HandIcon,
      path: "/dashboard/attendance",
    },
    {
      id: 5,
      name: "Payment",
      icon: ScanBarcode,
      path: "/dashboard/payment",
    },
  ];
  const studentMenuList = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutIcon,
      path: "/dashboard",
    },
    {
      id: 3,
      name: "Attendance",
      icon: HandIcon,
      path: "/dashboard/attendance",
    },
    {
      id: 5,
      name: "Payment",
      icon: ScanBarcode,
      path: "/dashboard/payment",
    },
  ];
  const path = usePathname();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/users/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const profileData = await response.json();
          setUser(profileData);
          if (profileData.role === "student") {
            setMenuList(studentMenuList);
          } else if (profileData.role === "staff") {
            setMenuList(staffMenuList);
          } else {
            setMenuList(adminMenuList);
          }
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
        <div>
        <button
          className="md:hidden text-gray-900 mt-5 ml-5 dark:text-gray-300"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "Close" : "Menu"}
        </button>
      </div>
      <div
        className={`lg:flex flex-col border-2 border-sky-500 rounded-lg shadow-md bg-white text-gray-900 dark:bg-cyan-950 dark:text-gray-300 h-screen p-5 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {!isSidebarOpen && (
          <>
            <div className="lg:flex">
              <Image
                src={"/logo.svg"}
                width={180}
                height={50}
                alt="logo"
              />
            </div>
            <hr className="my-5"></hr>
          </>
        )}
        {menuList.map((menu, index) => (
          <Link key={index} href={menu.path}>
            <h2
              className={`flex items-center gap-3 text-md p-4 hover:bg-sky-500 hover:text-white rounded-lg my-2 ${
                path === menu.path && "bg-sky-500 text-white"
              }`}
            >
              <menu.icon />
              {menu.name}
            </h2>
          </Link>
        ))}
        <div className="flex gap-2 bottom-5 items-center fixed p-4">
          <Image
            src={"/user.png"}
            width={35}
            height={35}
            alt="user"
            className="rounded-full"
          />
          <div>
            <h3 className="font-bold">{user.fullName ? user.fullName : user.userName}</h3>
            <p className="text-xs text-gray-500 font-bold">{user.email}</p>
          </div>
        </div>
      </div>
    </>
  );
}
