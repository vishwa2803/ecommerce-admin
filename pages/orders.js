import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrderPage(){
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        axios.get('/api/orders').then(response => {
            setOrders(response.data);
        });
    }, []);
    return(
        <Layout>
            <h1>Orders</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Paid</th>
                        <th>Recipient</th>
                        <th>Products</th>
                    </tr>
                </thead>
                <tbody>
                {orders.length > 0 && orders.map(order => (
                    <tr>
                        <td>
                            {(new Date(order.createdAt))
                            .toLocaleString()}
                        </td>
                        <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
                           {order.paid ? ' YES ' : ' NO '} 
                        </td>
                        <td>
                            <b>Name: </b>{order.name}<br/> 
                            <b>Email: </b>{order.email}<br/>
                            <b>City: </b>{order.city} <br/>
                            <b>PostalCode: </b> {order.postalCode}<br/>
                            <b>Country: </b>{order.country}<br/> 
                            <b>Address: </b>{order.streetAddress}
                        </td>
                        <td>
                            {order.line_items.map(l => (
                                <>
                                {l.price_data?.product_data.name} x {l.quantity}<br />
                                <b>Amount: </b>{l.price_data?.unit_amount/100}<br />
                                {/* {JSON.stringify(l)}<br /> */}
                                </>
                            ))}
                        </td>
                        
                    </tr>
                ))}
                </tbody>
            </table>
        </Layout>
    )
}