"use client";
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  YAxis,
} from "recharts";

function SaleChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="93%">
      <AreaChart width={500} height={200} data={data} margin={{ top : 15 , right : 20}}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date"/>
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="sale" stroke="#000" fill="#711D1C"/>
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default SaleChart;

// const data = [
//   {
//     date: "02/1/1",
//     sale: 2000,
//   },
//   {
//     date: "02/2/1",
//     sale: 20,
//   },

//   {
//     date: "02/3/1",
//     sale: 6500,
//   },
//   {
//     date: "02/4/1",
//     sale: 100,
//   },
//   {
//     date: "02/5/1",
//     sale: 12000,
//   },
// ];
