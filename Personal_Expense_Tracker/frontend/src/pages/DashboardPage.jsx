import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {Wallet,TrendingUp,TrendingDown,PiggyBank,Calendar,ChevronLeft,ChevronRight,PieChart as PieChartIcon,BarChart3} from "lucide-react";

import {ResponsiveContainer,PieChart,Pie,Cell,Tooltip,Legend,BarChart,Bar,XAxis,YAxis} from "recharts";

import { fetchMonthlySummary } from "../features/summary/summaryThunks";
import { fetchTransactions } from "../features/transactions/transactionThunks";
import {formatCurrency,getCurrentMonth,formatMonth,changeMonth} from "../utils/formatters";

// Colors used for each category in the pie chart.
const CATEGORY_COLORS = {
  FOOD: "#f97316",
  RENT: "#8b5cf6",
  BILLS: "#06b6d4",
  TRAVEL: "#3b82f6",
  SHOPPING: "#ec4899",
  ENTERTAINMENT: "#eab308",
  SALARY: "#10b981",
  OTHERS: "#64748b",
};


function DashboardPage() {
  const dispatch = useDispatch();

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);

  // Read summary information from Redux.
  const {
    data: summary,
    loading: summaryLoading,
  } = useSelector((state) => state.summary);

  // Read transactions from Redux.
  const {
    items: transactions,
  } = useSelector((state) => state.transactions);


  // Fetch the monthly summary and transactions.
  useEffect(() => {
    dispatch(fetchMonthlySummary(selectedMonth));
    dispatch(fetchTransactions({}));
  }, [dispatch, selectedMonth]);

  // Calculate the readable month name.
  const monthDisplay = formatMonth(selectedMonth);

  // Navigate to the previous month.
  const handlePrevMonth = () => {
    setSelectedMonth((currentMonth) =>changeMonth(currentMonth, -1));
  };
  // Navigate to the next month.
  const handleNextMonth = () => {
    setSelectedMonth((currentMonth) =>changeMonth(currentMonth, 1));
  };

  // Read financial totals from the API response.
  const totalIncome = Number(summary?.total_income ?? 0);
  const totalExpense = Number(summary?.total_expense ?? 0);
  const totalBalance = Number(summary?.net_balance ?? 0);

  // Calculate the percentage of income remaining after expenses.
  const savingsRate = totalIncome > 0
      ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100))
      : 0;


  // Prepare category data for the doughnut chart.
  const categoryData = useMemo(() => {
    const categories = summary?.category_summary ?? [];

    return categories.map((cat) => ({
      name: cat.category,
      value: Number(cat.total),
      color: CATEGORY_COLORS[cat.category] || "#6366f1",
    }));
  }, [summary]);



  // Prepare 6-month trend ending at the selected month for the bar chart.
  const monthlyTrends = useMemo(() => {
    // 1. Group transaction totals by month
    const totalsByMonth = {};
    transactions.forEach((transaction) => {
      if (!transaction.date) return;
      const month = transaction.date.slice(0, 7);

      // Initialize the monthly totals
      if (!totalsByMonth[month]) {
        totalsByMonth[month] = { Income: 0, Expenses: 0 };
      }
      const amount = Number(transaction.amount);
      // Add to income or expense based on transaction type
      if (transaction.transaction_type === "INCOME") {
        totalsByMonth[month].Income += amount;
      } else {
        totalsByMonth[month].Expenses += amount;
      }
    });

    // 2. Generate the 6 months ending at selectedMonth
    const [year, month] = selectedMonth.split("-").map(Number);
    const result = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(year, month - 1 - i, 1);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const monthKey = `${y}-${m}`;

      result.push({
        month: monthKey,
        displayMonth: formatMonth(monthKey),
        Income: totalsByMonth[monthKey]?.Income || 0,
        Expenses: totalsByMonth[monthKey]?.Expenses || 0,
      });
    }

    return result;
  }, [transactions, selectedMonth]);



  
  return (
    <div className="space-y-8">

      {/* Page heading and month selector */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Financial Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Real-time summary, cash flow, and spending insights for{" "}
            {monthDisplay}.
          </p>
        </div>

        {/* Month navigation */}

        <div className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Previous month"
            className="cursor-pointer rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="relative flex items-center gap-2 px-3 py-1 text-sm font-semibold text-slate-800">
            <Calendar size={16} className="text-indigo-600" />

            <span>{monthDisplay}</span>

            <input
              type="month"
              value={selectedMonth}
              onChange={(event) => {
                if (event.target.value) {
                  setSelectedMonth(event.target.value);
                }
              }}
              aria-label="Select month"
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next month"
            className="cursor-pointer rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Summary cards */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 rounded-md">

        {/* Total Balance */}

        <div className="relative overflow-hidden border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">
              Total Balance
            </p>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Wallet size={22} />
            </div>
          </div>

          <div className="mt-4">
            <p className="text-2xl font-bold tracking-tight">
              {summaryLoading ? "..." : formatCurrency(totalBalance)}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Net balance for {monthDisplay}
            </p>
          </div>
        </div>

        {/* Total Income */}

        <div className="relative overflow-hidden border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">
              Total Income
            </p>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp size={22} />
            </div>
          </div>

          <div className="mt-4">
            <p className="text-2xl font-bold tracking-tight text-emerald-600">
              {summaryLoading ? "..." : formatCurrency(totalIncome)}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Total earnings this month
            </p>
          </div>
        </div>

        {/* Total Expenses */}

        <div className="relative overflow-hidden border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">
              Total Expenses
            </p>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <TrendingDown size={22} />
            </div>
          </div>

          <div className="mt-4">
            <p className="text-2xl font-bold tracking-tight text-rose-600">
              {summaryLoading ? "..." : formatCurrency(totalExpense)}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Total spent this month
            </p>
          </div>
        </div>

        {/* Savings Rate */}

        <div className="relative overflow-hidden border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">
              Savings Rate
            </p>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <PiggyBank size={22} />
            </div>
          </div>

          <div className="mt-4">
            <p className="text-2xl font-bold tracking-tight text-slate-900">
              {summaryLoading ? "..." : `${savingsRate}%`}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Income saved after expenses
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Expense Breakdown Doughnut Chart */}

        <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Expense Breakdown
              </h3>

              <p className="mt-0.5 text-xs text-slate-500">
                Category-wise spending distribution for {monthDisplay}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
              <PieChartIcon size={18} />
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center justify-center">
            {categoryData.length > 0 ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {categoryData.map((category) => (
                        <Cell
                          key={category.name}
                          fill={category.color}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(value),
                        "Amount",
                      ]}
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        borderRadius: "12px",
                        border: "none",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                      itemStyle={{ color: "#fff" }}
                    />

                    <Legend
                      position="bottom"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span className="text-xs font-medium text-slate-600">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-72 w-full flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                  <PieChartIcon size={44} />
                </div>

                <p className="mt-3 text-sm font-medium text-slate-700">
                  No expenses recorded
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  There are no expense transactions for {monthDisplay}.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Income vs Expenses Bar Chart */}

        <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Income vs. Expenses
              </h3>

              <p className="mt-0.5 text-xs text-slate-500">
                Cash flow comparison across months
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
              <BarChart3 size={18} />
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center justify-center">
            {monthlyTrends.length > 0 ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyTrends}
                    margin={{
                      top: 10,
                      right: 40,
                      left: 10,
                      bottom: 0,
                    }}
                  >
                   
                    <XAxis
                      dataKey="displayMonth"
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                    />

                    <YAxis
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      tickFormatter={(value) =>
                        value >= 1000
                          ? `₹${(value / 1000).toFixed(0)}k`
                          : `₹${value}`
                      }
                    />

                    <Tooltip
                      formatter={(value) => [formatCurrency(value)]}
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        borderRadius: "12px",
                        border: "none",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                      itemStyle={{ color: "#fff" }}
                    />

                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span className="text-xs font-medium text-slate-600">
                          {value}
                        </span>
                      )}
                    />

                    <Bar
                      dataKey="Income"
                      fill="#10b981"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={40}
                    />

                    <Bar
                      dataKey="Expenses"
                      fill="#f43f5e"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-72 w-full flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                  <BarChart3 size={24} />
                </div>

                <p className="mt-3 text-sm font-medium text-slate-700">
                  No transaction data
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Add transactions to view comparison trends over time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;