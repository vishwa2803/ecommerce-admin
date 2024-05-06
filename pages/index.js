import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Chart from "chart.js/auto";

export default function Home() {
  const { data: session } = useSession();
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const chartRef = useRef(null);

  const renderChart = (orders) => {
    const ctx = document.getElementById("myChart");
    if (ctx) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      chartRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: getAllDaysOfWeek(),
          datasets: [
            {
              label: "Order Price (₹)",
              data: getDataForDaysOfWeek(orders),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
              ],
              borderColor: [
                'rgb(255, 99, 132,0.5)',
                'rgb(255, 159, 64,0.5)',
                'rgb(255, 205, 86,0.5)',
                'rgb(75, 192, 192,0.5)',
                'rgb(54, 162, 235,0.5)',
                'rgb(153, 102, 255,0.5)',
                'rgb(201, 203, 207,0.5)'
              ],
              borderWidth: 1,
            },
          ],
        },
      });
    }
  };

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
    axios.get("/api/orders").then((response) => {
      const sortedOrders = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      const recentOrders = sortedOrders.slice(0, 10);
      setOrders(recentOrders);
      renderChart(recentOrders);
    });
  }, []);

  useEffect(() => {
    const canvasElement = document.getElementById("myChart");
    if (canvasElement) {
      return () => {
        if (chartRef.current) {
          chartRef.current.destroy();
        }
      };
    }
  }, []);

  useEffect(() => {
    const canvasElement = document.getElementById("myChart");
    if (!canvasElement) {
      const observer = new MutationObserver(() => {
        const canvasElement = document.getElementById("myChart");
        if (canvasElement) {
          renderChart(orders);
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }, [orders]);

  const calculateTotalAmount = (order) => {
    let totalAmount = 0;
    order.line_items.forEach((item) => {
      totalAmount += item.quantity * item.price_data.unit_amount;
    });
    return totalAmount / 100;
  };

  const getAllDaysOfWeek = () => {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  };

  const getDataForDaysOfWeek = (orders) => {
    const daysOfWeekData = Array(7).fill(0); 
    orders.forEach((order) => {
      const dayOfWeekIndex = new Date(order.createdAt).getDay(); 
      daysOfWeekData[dayOfWeekIndex] += calculateTotalAmount(order); 
    });
    return daysOfWeekData;
  };

  return (
    <Layout>
      <div className="text-blue-900 text-lg flex justify-between items-center my-2 ">
        <h2>
          Hello, <b>{session?.user?.name}</b>
        </h2>
        <div className="flex gap-1 text-blue-900 rounded-lg overflow-hidden ">
          <img src={session?.user?.image} alt="" className="w-7 h-7 rounded-full" />
          <span className="px-2">{session?.user?.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 my-5 gap-4">
        <div className="bg-blue-100 border border-gray-200 rounded-lg shadow p-4">
          <h5 className="mb-2 font-semibold text-2xl text-blue-900">Total Products: {productCount}</h5>
          <Link href="/products" className="text-blue-600 hover:underline">View</Link>
        </div>
        <div className="bg-blue-100 border border-gray-200 rounded-lg shadow p-4">
          <h5 className="mb-2 font-semibold text-2xl text-blue-900">Total Categories: {categoryCount}</h5>
          <Link href="/categories" className="text-blue-600 hover:underline">View</Link>
        </div>
        <div className="bg-blue-100 border border-gray-200 rounded-lg shadow p-4">
          <h5 className="mb-2 font-semibold text-2xl text-blue-900">All Orders: {orderCount}</h5>
          <Link href="/orders" className=" text-blue-600 hover:underline">View</Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <div className="w-full md:w-3/5 bg-gray-50 border border-gray-200 rounded-lg shadow">
          <h1 className="p-4 text-2xl font-semibold text-blue-900">Filled Line Chart</h1>
          <div className="p-4">
            <canvas id="myChart"></canvas>
          </div>
        </div>
        <div className="w-full md:w-2/5 bg-gray-50 border border-gray-200 rounded-lg shadow">
          <div className="p-4">
            <h1 className="mb-4 text-2xl font-semibold text-blue-900">Recent Orders</h1>
            <table className="w-full table-auto">
              <thead className="text-blue-900">
                <tr>
                  <th className="px-4 py-2">Id</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order._id} className="hover:bg-blue-50 text-blue-900">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{order.name}</td>
                    <td className="px-4 py-2">
                      {order.line_items.map((item, innerIndex) => (
                        <span key={innerIndex}>{item.price_data?.product_data.name}<br /></span>
                      ))}
                    </td>
                    <td className="px-4 py-2">₹{calculateTotalAmount(order)}</td>
                    <td className="px-4 py-2">{order.paid ? <b className="text-green-800">Paid</b> : <b className="text-red-800">Unpaid</b>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
