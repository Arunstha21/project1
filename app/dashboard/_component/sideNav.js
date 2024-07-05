'use client'
import { GraduationCap, HandIcon, LayoutIcon, ScanBarcode, Settings, User, User2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SideNav() {
    const [user, setUser] = useState({});
    const [menuList, setMenuList] = useState([]);
    const adminMenuList = [
        {
            id:1,
            name: 'Dashboard',
            icon: LayoutIcon,
            path: '/dashboard'
        },
        {
            id:2,
            name: 'Members',
            icon: GraduationCap,
            path: '/dashboard/students'
        },
        {
            id:3,
            name: 'Attendance',
            icon: HandIcon,
            path: '/dashboard/attendance'
        },
        {
            id:4,
            name: 'User',
            icon: User2Icon,
            path: '/dashboard/user'
        },{
            id:5,
            name: 'Payment',
            icon: ScanBarcode,
            path: '/dashboard/payment'
        },
    ];
    const staffMenuList = [
        {
            id:1,
            name: 'Dashboard',
            icon: LayoutIcon,
            path: '/dashboard'
        },
        {
            id:2,
            name: 'Students',
            icon: GraduationCap,
            path: '/dashboard/students'
        },
        {
            id:3,
            name: 'Attendance',
            icon: HandIcon,
            path: '/dashboard/attendance'
        },
        {
            id:5,
            name: 'Payment',
            icon: ScanBarcode,
            path: '/dashboard/payment'
        },
    ];
    const studentMenuList = [
        {
            id:1,
            name: 'Dashboard',
            icon: LayoutIcon,
            path: '/dashboard'
        },
        {
            id:3,
            name: 'Attendance',
            icon: HandIcon,
            path: '/dashboard/attendance'
        },
        {
            id:5,
            name: 'Payment',
            icon: ScanBarcode,
            path: '/dashboard/payment'
        }
    ];
    const path = usePathname();

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
                    if(profileData.role === "student"){
                        setMenuList(studentMenuList)
                    }else if(profileData.role === "staff"){
                        setMenuList(staffMenuList)
                    }else {
                        setMenuList(adminMenuList)
                    }

                } else {
                    console.error('Failed to fetch profile');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

  return (
    <>
      <div className="border-2 border-sky-500 rounded-lg mr-2 shadow-md bg-white text-gray-900 dark:bg-cyan-950 dark:text-gray-300 h-screen p-5">
        <Image src={"/logo.svg"} width={180} height={50} className="" alt="logo"/>
        <hr className="my-5"></hr>
        {menuList.map((menu, index)=>(
            <Link key={index} href={menu.path}>
            <h2 className={`flex items-center gap-3 text-md p-4 hover:bg-sky-500 hover:text-white rounded-lg my-2 ${path===menu.path&&'bg-sky-500 text-white'}`} key={index}>
                <menu.icon/>
                {menu.name}
            </h2>
            </Link>
        ))}
        <div className="flex gap-2 bottom-5 items-center fixed p-4">
            <Image src={'/user.png'} width={35} height={35} alt="user" className="rounded-full"/>
            <h3 className="font-bold">
                {user.userName}
            </h3>
        </div>
      </div>
    </>
  );
}
