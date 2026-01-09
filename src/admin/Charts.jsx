import React from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";

const stats = { buyers: 10, sellers: 5, admins: 2 };

const data = [
  { name: "Buyers", value: stats.buyers },
  { name: "Sellers", value: stats.sellers },
  { name: "Admins", value: stats.admins },
];

export default function Charts() {
  return (
    <PieChart width={400} height={400}>
      <Pie dataKey="value" data={data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label />
      <Legend />
    </PieChart>
  );
}
