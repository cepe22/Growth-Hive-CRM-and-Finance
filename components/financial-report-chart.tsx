"use client";

import { financial2024 } from "@/lib/financial-2024";
import { rupiah } from "@/lib/utils";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function FinancialReportChart() {
  return <ResponsiveContainer width="100%" height={300}><AreaChart data={financial2024.months} margin={{ left: 6, right: 10, top: 15 }}><defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0D9488" stopOpacity={.22}/><stop offset="95%" stopColor="#0D9488" stopOpacity={0}/></linearGradient><linearGradient id="netFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#38bdf8" stopOpacity={.18}/><stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/></linearGradient></defs><CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4"/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }}/><YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} tickFormatter={value => `${Math.round(value/1000000)}jt`}/><Tooltip formatter={(value: number, name: string) => [rupiah(value), name === "revenue" ? "Pendapatan" : "Net Income"]} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}/><Area type="monotone" dataKey="revenue" stroke="#0D9488" strokeWidth={3} fill="url(#revenueFill)"/><Area type="monotone" dataKey="netIncome" stroke="#38bdf8" strokeWidth={2} fill="url(#netFill)"/></AreaChart></ResponsiveContainer>;
}
