"use client";
import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function GrowthChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="92.7%">
      <LineChart
        width={500}
        height={200}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="prev" stroke="#711D1C" />
        <Line type="monotone" dataKey="current" stroke="#000" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default GrowthChart;
