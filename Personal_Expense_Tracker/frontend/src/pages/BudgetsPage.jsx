import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Wallet,Calendar,ChevronLeft,ChevronRight,Plus,Pencil,Trash2,} from "lucide-react";
import {fetchBudgets,createBudget,updateBudget,deleteBudget,} from "../features/budgets/budgetThunks";
import { clearBudgetError } from "../features/budgets/budgetSlice";
import { formatCurrency, getCurrentMonth, formatMonth, changeMonth } from "../utils/formatters";
import BudgetForm from "../components/budgets/BudgetForm";
import toast from "react-hot-toast";



function BudgetsPage() {

  const dispatch = useDispatch();

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);


  const { items: budgets, loading, saving, error } = useSelector(
    (state) => state.budgets
  );

  useEffect(() => {
    dispatch(fetchBudgets(selectedMonth));
  }, [dispatch, selectedMonth]);

  const handleOpenAddForm = () => {
    dispatch(clearBudgetError());
    setEditingBudget(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (budget) => {
    dispatch(clearBudgetError());
    setEditingBudget(budget);
    setIsFormOpen(true);
  };

  const handleCreateBudget = async (budgetData) => {
    try {
      await dispatch(createBudget(budgetData)).unwrap();
      toast.success("Budget added successfully!");
      setIsFormOpen(false);
      dispatch(fetchBudgets(selectedMonth));

    } catch (err) {
      toast.error(
        typeof err === "string" ? err : "Failed to add budget."
      );
      throw err;
    }
  };

  const handleUpdateBudget = async (budgetData) => {
    if (!editingBudget) return;
    try {
      await dispatch(updateBudget({ id: editingBudget.id, budgetData })).unwrap();
      toast.success("Budget updated successfully!");
      setIsFormOpen(false);
      setEditingBudget(null);
      dispatch(fetchBudgets(selectedMonth));

    } catch (err) {
      toast.error(
        typeof err === "string" ? err : "Failed to update budget."
      );
      throw err;
    }
  };

  const handleDeleteBudget = async (budget) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the ${budget.category} budget?`
    );
    if (!confirmed) return;

    try {
      await dispatch(deleteBudget(budget.id)).unwrap();
      toast.success("Budget deleted successfully!");
      dispatch(fetchBudgets(selectedMonth));
    } catch (err) {
      toast.error(
        typeof err === "string" ? err : "Failed to delete budget."
      );
    }
  };




  const handlePrevMonth = () => {
    setSelectedMonth((curr) => changeMonth(curr, -1));
  };
  const handleNextMonth = () => {
    setSelectedMonth((curr) => changeMonth(curr, 1));
  };


  const summary = useMemo(() => {
    let totalBudget = 0;
    let totalSpent = 0;
    let exceededCount = 0;

    budgets.forEach((budget) => {
      const limit = Number(budget.limit || 0);
      const spent = Number(budget.total_expenses || 0);
      totalBudget += limit;
      totalSpent += spent;
      if (spent > limit) {
        exceededCount += 1;
      }
    });

    const remainingBudget = totalBudget - totalSpent;

    return {
      totalBudget,
      totalSpent,
      remainingBudget,
      exceededCount,
    };
  }, [budgets]);





  return (
    <div className="space-y-8">
      {/* Header & Month Selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Monthly Budgets
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Set spending limits and track your progress across categories.
          </p>
        </div>

        {/* Controls: Month Navigation & Add Budget */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Month Navigation */}
          <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Previous month"
              className="rounded-xl p-2  text-slate-600 transition hover:bg-slate-100 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2 px-0 text-sm font-semibold text-slate-800 min-w-[140px] justify-center ">
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

          {/* Add Budget Button */}
          <button
            type="button"
            onClick={handleOpenAddForm}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 cursor-pointer"
          >
            <Plus size={18} />
            <span>Add Budget</span>
          </button>
        </div>
      </div>



      {/* Overview Summary Cards */}
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4 rounded-md">
        {/* Total Budget */}
        <div className="border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Total Budget</p>
            
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {formatCurrency(summary.totalBudget)} 
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Monthly planned allocation
          </p>
        </div>

        {/* Total Spent */}
        <div className="border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Total Spent</p>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {formatCurrency(summary.totalSpent)}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Actual expenses recorded
          </p>
        </div>

        {/* Remaining Budget */}
        <div className="border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Remaining</p>
          </div>
          <p
            className={`mt-3 text-2xl font-bold ${
              summary.remainingBudget >= 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {formatCurrency(summary.remainingBudget)}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {summary.remainingBudget >= 0 ? "Left to spend" : "Budget overspent"}
          </p>
        </div>

        {/* Budget Alerts */}
        <div className="border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Budget Alerts</p>
          </div>
          <p
            className={`mt-3 text-2xl font-bold ${
              summary.exceededCount > 0 ? "text-rose-600" : "text-slate-900"
            }`}
          >
            {summary.exceededCount}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {summary.exceededCount === 1
              ? "1 category exceeded"
              : `${summary.exceededCount} categories exceeded`}
          </p>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Category Budgets
            </h3>
            <p className="text-xs text-slate-500">
              Detailed breakdown of limits and expenditures for {formatMonth(selectedMonth)}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex h-48 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <p className="text-sm text-slate-500 animate-pulse">Loading budgets...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {typeof error === "string" ? error : "Failed to load budgets."}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && budgets.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-12 text-center shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Wallet size={24} />
            </div>
            <h4 className="mt-4 text-base font-semibold text-slate-800">
              No budgets found for this month
            </h4>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              No spending limits set for {formatMonth(selectedMonth)}.
            </p>
          </div>
        )}




        {/* Budgets List Cards */}
        {!loading && !error && budgets.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ">
            
            {budgets.map((budget) => {
              const limit = Number(budget.limit || 0);
              const spent = Number(budget.total_expenses || 0);
              const remaining = limit - spent;
              const rawPercent = limit > 0 ? (spent / limit) * 100 : 0;
              const percentUsed = Math.round(rawPercent);
              const isExceeded = budget.exceeded || spent > limit || rawPercent > 100;
              const isNearLimit = !isExceeded && rawPercent >= 80;

              return (
                <div
                  key={budget.id}
                  className={`rounded-md border p-8 transition hover:shadow-md ${
                    isExceeded
                      ? "border-rose-100 bg-rose-50 shadow-sm"
                      : isNearLimit
                      ? "border-amber-200 bg-amber-50/50 shadow-sm"
                      : "border-slate-200 bg-white shadow-sm"
                  }`}

                >
                  {/* Card Header: Category, Status Badge & Actions */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 text-base">
                      {budget.category}
                    </span>

                    <div className="flex items-center gap-1">
                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditForm(budget)}
                        aria-label={`Edit ${budget.category} budget`}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition cursor-pointer"
                      >
                        <Pencil size={20} color="grey" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteBudget(budget)}
                        disabled={saving}
                        aria-label={`Delete ${budget.category} budget`}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition disabled:opacity-50 cursor-pointer"
                      >
                        <Trash2 size={20} color="grey" />
                      </button>
                    </div>
                  </div>

                  {/* Limit & Spent Numbers */}
                  <div className="mt-4 grid grid-cols-3 gap-5 border-y border-slate-100 py-5 text-center">
                    <div>
                      <p className="text-xs text-slate-700">Budget</p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-800">
                        {formatCurrency(limit)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-700">Spent</p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-800">
                        {formatCurrency(spent)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-700">Remaining</p>
                      <p
                        className={`mt-0.5 text-sm font-semibold ${
                          remaining >= 0 ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {formatCurrency(remaining)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar & Subtitle */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-slate-700 mb-1.5">
                      <span>Usage</span>
                      <span
                        className={`font-semibold ${
                          isExceeded
                            ? "text-rose-600"
                            : isNearLimit
                            ? "text-amber-600"
                            : "text-slate-700"
                        }`}
                      >
                        {percentUsed}%
                      </span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isExceeded
                            ? "bg-rose-500"
                            : isNearLimit
                            ? "bg-amber-500"
                            : "bg-indigo-600"
                        }`}
                        style={{ width: `${Math.min(rawPercent, 100)}%` }}
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-sm">
                      <div>
                        {isExceeded ? (
                          <span className="font-semibold text-rose-600">
                            Exceeded
                          </span>
                        ) : isNearLimit ? (
                          <span className="font-semibold text-amber-600">
                            Near limit
                          </span>
                        ) : null}
                      </div>

                      <p className="text-right text-[11px] text-slate-400">
                        {remaining >= 0
                          ? `${formatCurrency(remaining)} left to spend`
                          : `Overspent by ${formatCurrency(Math.abs(remaining))}`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Budget Modal Form */}
      {isFormOpen && (
        <BudgetForm
          key={editingBudget?.id ?? "new"}
          budget={editingBudget}
          existingBudgets={budgets}
          onClose={() => {
            setIsFormOpen(false);
            setEditingBudget(null);
          }}
          onSubmit={editingBudget ? handleUpdateBudget : handleCreateBudget}
          saving={saving}
          defaultMonth={selectedMonth}
        />
      )}
    </div>
  );
}

export default BudgetsPage;