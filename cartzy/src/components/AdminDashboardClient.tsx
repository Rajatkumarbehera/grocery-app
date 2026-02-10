"use client";

import { IndianRupee, Package, Truck, Users } from "lucide-react";
import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

interface Earning {
  today: number;
  sevenDays: number;
  total: number;
}

interface Stats {
  title: string;
  value: number;
}

interface ChartData {
  day: string;
  orders: any;
}

export default function AdminDashboardClient({
  earning,
  stats,
  chartData,
}: {
  earning: Earning;
  stats: Stats[];
  chartData: ChartData[];
}) {
  const [filter, setFilter] = useState<"today" | "sevenDays" | "total">();

  const currentEarnings =
    filter === "today"
      ? earning.today
      : filter === "sevenDays"
        ? earning.sevenDays
        : earning.total;

  const title =
    filter === "today"
      ? "Today's earning"
      : filter === "sevenDays"
        ? "Last 7 days earning"
        : "Total earning";

  return (
    <div>
      <div className="flex justify-evenly">
        <h1>AdminDashboardClient</h1>
        <div>
          <select
            onChange={(e) => setFilter(e.target.value as any)}
            value={filter}
          >
            <option value="total">Total</option>
            <option value="sevenDays">Last 7 days</option>
            <option value="today">Today</option>
          </select>
        </div>
        <div>
          <h2>{title}</h2>
          <p>{currentEarnings.toLocaleString()}</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const icons = [
            <Package key="p" className="text-green-500 w-6 h-6" />,
            <Users key="u" className="text-green-500 w-6 h-6" />,
            <Truck key="t" className="text-green-500 w-6 h-6" />,
            <IndianRupee key="i" className="text-green-500 w-6 h-6" />,
          ];

          return (
            <div key={index} className="shadow-md">
              <div>{icons[index]}</div>
              <div>
                <p>{stat.title}</p>
                <p>{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        {/* add a chart */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="day" />
            <Tooltip />
            <Bar dataKey="orders" fill="#16a34a" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
