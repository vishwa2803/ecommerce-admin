import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";


export default function Home() {
  const { data: session } = useSession();
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);

  useEffect(() => {
    axios.get("/api/productCount").then((res) => {
      setProductCount(res.data.count);
    });
    axios.get("/api/orderCount").then((res) => {
      setOrderCount(res.data.count);
    });
    axios.get("/api/categoryCount").then((res) => {
      setCategoryCount(res.data.count);
    });
  }, []);
  // console.log(session)
  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>
          Hello, <b>{session?.user?.name}</b>
        </h2>
        <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
          <img src={session?.user?.image} alt="" className="w-6 h-6 " />
          <span className="px-2">{session?.user?.name}</span>
        </div>
      </div>

    <div className="flex grid grid-cols-4">
      <div className="max-w-sm my-6 p-6 bg-blue-100 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-blue-700">
        <div className="flex">
          <h5 className="mb-2 text-2xl font-semibold tracking-tight text-blue-900 dark:text-white">
            Total Products : {productCount}
          </h5>
        </div>
        <Link
          href={"/products"}
          className="inline-flex font-medium items-center text-blue-600 hover:underline"
        >
          View
          <svg
            className="w-3 h-3 ms-2.5 rtl:rotate-[270deg]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
            />
          </svg>
        </Link>
      </div>


      <div className="max-w-sm my-6 p-6 bg-blue-100 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-blue-700">
        <div className="flex">
          <h5 className="mb-2 text-2xl font-semibold tracking-tight text-blue-900 dark:text-white">
            Total Categories : {categoryCount}
          </h5>
        </div>
        <Link
          href={"/categories"}
          className="inline-flex font-medium items-center text-blue-600 hover:underline"
        >
          View
          <svg
            className="w-3 h-3 ms-2.5 rtl:rotate-[270deg]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
            />
          </svg>
        </Link>
      </div>


      <div className="max-w-sm my-6 p-6 bg-blue-100 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-blue-700">
        <div className="flex">
          <h5 className="mb-2 text-2xl font-semibold tracking-tight text-blue-900 dark:text-white">
            All Orders : {orderCount}
          </h5>
        </div>
        <Link
          href={"/orders"}
          className="inline-flex font-medium items-center text-blue-600 hover:underline"
        >
          View
          <svg
            className="w-3 h-3 ms-2.5 rtl:rotate-[270deg]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
            />
          </svg>
        </Link>
      </div>
      </div>
    </Layout>
  );
}
