"use client";

import { FinancialReportChart } from "@/components/financial-report-chart";
import { Header } from "@/components/header";
import { Button, Card } from "@/components/ui";
import { financialReports } from "@/lib/financial-2024";
import { rupiah } from "@/lib/utils";
import { Download, ExternalLink, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

type ReportYear = keyof typeof financialReports;

const percent = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "percent", maximumFractionDigits: 1 }).format(value);

const signedRupiah = (value: number) => `${value < 0 ? "-" : ""}${rupiah(Math.abs(value))}`;

export default function ReportsPage() {
  const [year, setYear] = useState<ReportYear>("2026");
  const report = financialReports[year];
  const maxExpense = report.expenseCategories[0].amount;
  const isProfitable = report.netIncome >= 0;
  const balanceRows = [
    ["Kas & Setara Kas", report.balanceSheet.cash],
    ["Piutang Usaha", report.balanceSheet.receivables],
    ["Pajak Dibayar Dimuka", report.balanceSheet.prepaidTax],
    ["Total Aktiva", report.balanceSheet.totalAssets],
    ["Utang Pajak", report.balanceSheet.taxPayable],
    ["Modal", report.balanceSheet.capital],
    ["Laba Periode Berjalan", report.balanceSheet.currentProfit],
    ["Laba Ditahan", report.balanceSheet.retainedEarnings],
    ["Pendapatan Diterima Dimuka", report.balanceSheet.unearnedRevenue],
    ["Dividen", report.balanceSheet.dividend],
    ["Total Pasiva", report.balanceSheet.totalLiabilitiesEquity],
  ].filter((row): row is [string, number] => row[1] !== undefined);

  return (
    <>
      <Header title="Laporan Keuangan" subtitle="Laporan historis PT. Growth Hive Indonesia." />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-teal-100 bg-teal-50/70 p-4 text-sm dark:border-teal-900 dark:bg-teal-950/30">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-black text-teal-800 dark:text-teal-200">Data aktual {report.year}</p>
            <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-teal-700 dark:bg-teal-900 dark:text-teal-200">
              {report.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-teal-700/70 dark:text-teal-300/70">
            Periode {report.period} · Sumber: {report.source}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(financialReports) as ReportYear[]).map((reportYear) => (
            <Button
              key={reportYear}
              variant={year === reportYear ? "primary" : "outline"}
              onClick={() => setYear(reportYear)}
            >
              {reportYear}
            </Button>
          ))}
          <a href={report.sourceUrl} target="_blank" rel="noreferrer">
            <Button variant="outline"><ExternalLink size={15} />Buka sumber</Button>
          </a>
          <Button variant="outline" onClick={() => window.print()}>
            <Download size={15} />Cetak / Ekspor PDF
          </Button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Pendapatan</p><p className="mt-3 text-xl font-black">{rupiah(report.revenue)}</p><p className="mt-2 text-xs text-slate-400">{report.period}</p></Card>
        <Card className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Biaya</p><p className="mt-3 text-xl font-black">{rupiah(report.totalExpenses)}</p><p className="mt-2 text-xs text-slate-400">{percent(report.totalExpenses / report.revenue)} dari pendapatan</p></Card>
        <Card className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Laba Usaha</p><p className={`mt-3 text-xl font-black ${report.operatingProfit < 0 ? "text-rose-600" : ""}`}>{signedRupiah(report.operatingProfit)}</p><p className="mt-2 text-xs text-slate-400">Sebelum pajak final</p></Card>
        <Card className={`${isProfitable ? "bg-ink dark:bg-teal-800" : "bg-rose-700 dark:bg-rose-900"} p-5 text-white`}><p className="text-xs font-bold uppercase tracking-wider text-white/70">Net Income</p><p className="mt-3 text-xl font-black">{signedRupiah(report.netIncome)}</p><p className="mt-2 flex items-center gap-1 text-xs font-bold text-white/70">{isProfitable ? <TrendingUp size={13} /> : <TrendingDown size={13} />}Margin {percent(report.netMargin)}</p></Card>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card className="p-5"><h2 className="font-black">Tren Pendapatan & Net Income</h2><p className="mb-3 text-xs text-slate-400">Performa bulanan {report.period}</p><FinancialReportChart report={report} /></Card>
        <Card className="p-5"><h2 className="font-black">Ringkasan P&L</h2><p className="mb-4 text-xs text-slate-400">Akumulasi {report.period}</p>{[["Pendapatan Usaha", report.revenue], ["HPP", report.costOfRevenue], ["Biaya Operasional", report.operatingExpenses], ["Total Biaya", report.totalExpenses], ["Laba Usaha", report.operatingProfit], ["Pajak Final", report.tax], ["Net Income", report.netIncome]].map(([label, value], index) => <div key={String(label)} className={`flex justify-between border-b border-slate-100 py-3 text-xs dark:border-slate-800 ${index >= 3 ? "font-black" : ""}`}><span>{label}</span><span className={Number(value) < 0 ? "text-rose-600" : index === 6 ? "text-teal-700" : ""}>{signedRupiah(Number(value))}</span></div>)}</Card>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_1fr]">
        <Card className="p-5"><h2 className="font-black">Komposisi Biaya</h2><p className="mb-5 text-xs text-slate-400">Kategori pengeluaran terbesar {report.period}</p><div className="space-y-4">{report.expenseCategories.map((item) => <div key={item.label}><div className="mb-1.5 flex justify-between gap-4 text-xs"><span className="font-semibold">{item.label}</span><span className="shrink-0 font-black">{rupiah(item.amount)}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-teal-600" style={{ width: `${Math.max(1, item.amount / maxExpense * 100)}%` }} /></div></div>)}</div></Card>
        <Card className="p-5"><h2 className="font-black">Balance Sheet</h2><p className="mb-4 text-xs text-slate-400">Posisi akhir periode {report.period}</p>{balanceRows.map(([label, value]) => <div key={label} className={`flex justify-between border-b border-slate-100 py-3 text-xs dark:border-slate-800 ${label === "Total Aktiva" || label === "Total Pasiva" ? "font-black text-teal-700" : ""}`}><span>{label}</span><span className={value < 0 ? "text-rose-600" : ""}>{signedRupiah(value)}</span></div>)}</Card>
      </section>
    </>
  );
}
