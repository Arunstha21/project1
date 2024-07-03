import { Inter } from "next/font/google";
import "../ui/globals.css";
import SideNav from "./_component/sideNav";
import Header from "./_component/header";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen dark:bg-sky-950 bg-gray-100">
        <div className="md:w-64 fixed hidden md:block"><SideNav/></div>
        <div className="md:ml-64">
          <Header/>
          <div className="m-2">
            {children}
          </div>
          </div>
        </div>
        </body>
    </html>
  );
}
