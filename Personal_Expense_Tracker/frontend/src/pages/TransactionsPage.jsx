import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, ArrowDownLeft, ArrowUpRight, Pencil, Trash2, Filter, RotateCcw, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import toast from "react-hot-toast";

import { fetchTransactions, createTransaction, updateTransaction, deleteTransaction } from "../features/transactions/transactionThunks";
import { fetchBudgets } from "../features/budgets/budgetThunks";
import { clearTransactionError } from "../features/transactions/transactionSlice";
import TransactionForm from "../components/transactions/TransactionsForm";
import { formatCurrency, getCurrentMonth, formatMonth, changeMonth } from "../utils/formatters";

function TransactionsPage() {

  const dispatch = useDispatch();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);

  const { items, loading, saving, error } = useSelector(
    (state) => state.transactions
  );

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [filters, setFilters] = useState({
    transaction_type: "",
    category: "",
    start_date: "",
    end_date: "",
  });

  const [selectedDate, setSelectedDate] = useState("");

  const handlePrevMonth = () => {
    setSelectedMonth((curr) => changeMonth(curr, -1));
    setSelectedDate("");
  };

  const handleNextMonth = () => {
    setSelectedMonth((curr) => changeMonth(curr, 1));
    setSelectedDate("");
  };


  useEffect(() => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const lastDay = new Date(year, month, 0).getDate();
    const monthStartDate = `${selectedMonth}-01`;
    const monthEndDate = `${selectedMonth}-${String(lastDay).padStart(2, "0")}`;


    dispatch(
      fetchTransactions({
        ...filters,
        start_date: filters.start_date || monthStartDate,
        end_date: filters.end_date || monthEndDate,
      })
    );
  }, [dispatch, filters, selectedMonth]);



  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      transaction_type: "",
      category: "",
      start_date: "",
      end_date: "",
    });
    setSelectedDate("");
  };

  const isFiltered = Boolean(
    filters.transaction_type || filters.category || filters.start_date || filters.end_date
  );

  const displayedTransactions = selectedDate
    ? items.filter((item) => item.date === selectedDate)
    : items;

  // Check if an expense causes a budget warning or exceeds budget
  const checkBudgetWarning = async (category, date) => {
    if (!category || !date) return;
    try {
      const month = date.slice(0, 7);
      const budgets = await dispatch(fetchBudgets(month)).unwrap();
      const budget = budgets.find((b) => b.category === category);
      if (!budget) return;

      const limit = Number(budget.limit || 0);
      const spent = Number(budget.total_expenses || 0);

      if (budget.exceeded || spent > limit) {
        toast(
          (t) => (
            <div className="text-center">
              <p className="font-semibold text-rose-800">
                Budget Warning: {category} budget exceeded!
              </p>
              <p className="mt-0.5 text-sm text-rose-700">
                Spent {formatCurrency(spent)} of {formatCurrency(limit)} limit.
              </p>
            </div>
          ),
          {
            position: "top-center",
            duration: 6000,
            style: {
              border: "1px solid #fecdd3",
              backgroundColor: "#fff1f2",
              padding: "10px 14px",
            },
          }
        );
      } else if (budget.percentage_used >= 80) {
        toast(
          (t) => (
            <div className="text-center">
              <p className="font-semibold text-amber-800">
                Budget Alert: {category} is near limit!
              </p>
              <p className="mt-0.5 text-sm text-amber-700">
                Spending reached {Math.round(budget.percentage_used)}% of {formatCurrency(limit)} limit.
              </p>
            </div>
          ),
          {
            position: "top-center",
            duration: 5000,
            style: {
              border: "1px solid #fde68a",
              backgroundColor: "#fffbeb",
              padding: "10px 14px",
            },
          }
        );
      }
    } catch {
      // Ignore budget check errors
    }
  };

  const handleCreateTransaction = async (transactionData) => {
    try {
      await dispatch(createTransaction(transactionData)).unwrap();
      toast.success("Transaction created successfully!");
      setIsFormOpen(false);

      if (transactionData.transaction_type === "EXPENSE") {
        checkBudgetWarning(transactionData.category, transactionData.date);
      }
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "Failed to create transaction. Please check the fields."
      );
      throw error;
    }
  };


  const handleUpdateTransaction = async (transactionData) => {
    if (!editingTransaction) {
      return;
    }

    try {
      await dispatch(updateTransaction({ id: editingTransaction.id, transactionData, })).unwrap();

      toast.success("Transaction updated successfully!");
      setIsFormOpen(false);
      setEditingTransaction(null);

      if (transactionData.transaction_type === "EXPENSE") {
        checkBudgetWarning(transactionData.category, transactionData.date);
      }
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "Failed to update transaction."
      );

      throw error;
    }
  };


  const handleDeleteTransaction = async (transaction) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${transaction.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(deleteTransaction(transaction.id)).unwrap();
      toast.success("Transaction deleted successfully!");


    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "Failed to delete transaction."
      );
    }
  };



  const handleOpenForm = () => {
    dispatch(clearTransactionError());
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header & Month Selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Manage Transactions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            View and manage all your income and expenses.
          </p>
        </div>

        {/* Controls: Month Navigation & Add Transaction */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Month Navigation */}
          <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Previous month"
              className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2 px-0 text-sm font-semibold text-slate-800 min-w-[140px] justify-center">
              <Calendar size={16} className="text-indigo-600" />
              <span>{formatMonth(selectedMonth)}</span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next month"
              className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Add Transaction Button */}
          <button
            type="button"
            onClick={handleOpenForm}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 cursor-pointer"
          >
            <Plus size={18} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Filter size={16} className="text-indigo-600" />
            <span>Filter Transactions</span>
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 cursor-pointer"
            >
              <RotateCcw size={13} />
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Transaction Type */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Transaction Type
            </label>
            <select
              id="filter_type"
              name="transaction_type"
              value={filters.transaction_type}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2  text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
            >
              <option value="">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Category
            </label>
            <select
              id="filter_category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
            >
              <option value="">All Categories</option>
              <option value="SALARY">Salary</option>
              <option value="RENT">Rent</option>
              <option value="FOOD">Food</option>
              <option value="TRAVEL">Travel</option>
              <option value="SHOPPING">Shopping</option>
              <option value="BILLS">Bills</option>
              <option value="ENTERTAINMENT">Entertainment</option>
              <option value="OTHERS">Others</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Start Date
            </label>
            <input
              id="filter_start_date"
              name="start_date"
              type="date"
              value={filters.start_date}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              End Date
            </label>
            <input
              id="filter_end_date"
              name="end_date"
              type="date"
              value={filters.end_date}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Transaction list */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        {/* Date Filter Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <h3 className="text-sm font-semibold text-slate-800">
            Transactions
          </h3>

          <div className="flex items-center gap-2">
            <label htmlFor="select_date" className="text-xs font-medium text-slate-600">
              Select Date:
            </label>
            <input
              id="select_date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
            />
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate("")}
                className="text-xs font-medium text- hover:underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {loading && (
          <p className="py-8 text-center text-sm text-slate-500">
            Loading transactions...
          </p>
        )}

        {!loading && error && items.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-sm text-red-600">
              Failed to load transactions.
            </p>

            <button
              type="button"
              onClick={() => dispatch(fetchTransactions(filters))}
              className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && displayedTransactions.length === 0 && (
          <div className="py-12 text-center">
            <p className="font-medium text-slate-800">
              {selectedDate
                ? `No transactions on ${selectedDate}`
                : isFiltered
                  ? "No transactions found matching your filters"
                  : "No transactions yet"}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {selectedDate
                ? "Try switching to another date or click Show All Days."
                : isFiltered
                  ? "Try adjusting or clearing your filters to see more results."
                  : "Add your first transaction to get started."}
            </p>

            {selectedDate ? (
              <button
                type="button"
                onClick={() => setSelectedDate("")}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Show All Days
              </button>
            ) : isFiltered ? (
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <RotateCcw size={14} />
                Clear Filters
              </button>
            ) : null}
          </div>
        )}

        {!loading && displayedTransactions.length > 0 && (
          <div className="divide-y divide-slate-100">

            {displayedTransactions.map((transaction) => {
              const isIncome = transaction.transaction_type === "INCOME";

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isIncome
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                        }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft size={20} />
                      ) : (
                        <ArrowUpRight size={20} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">
                        {transaction.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {transaction.category} · {transaction.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <p
                      className={`text-sm font-semibold ${isIncome ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {isIncome ? "+" : "-"}₹
                      {Number(transaction.amount).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingTransaction(transaction);
                        setIsFormOpen(true);
                      }}
                      aria-label={`Edit ${transaction.title}`}
                      className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleDeleteTransaction(transaction)}
                      aria-label={`Delete ${transaction.title}`}
                      className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 cursor-pointer"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add transaction modal */}
      {isFormOpen && (
        <TransactionForm
          key={editingTransaction?.id ?? "new"}
          transaction={editingTransaction}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTransaction(null);
          }}
          onSubmit={
            editingTransaction
              ? handleUpdateTransaction
              : handleCreateTransaction
          }
          saving={saving}
        />
      )}
    </div>
  );
}

export default TransactionsPage;