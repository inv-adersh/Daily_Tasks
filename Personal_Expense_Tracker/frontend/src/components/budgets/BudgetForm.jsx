import { useState } from "react";
import { X } from "lucide-react";

export const CATEGORIES = [
  "FOOD",
  "RENT",
  "BILLS",
  "TRAVEL",
  "SHOPPING",
  "ENTERTAINMENT",
  "OTHERS",
];

function BudgetForm({
  onClose,
  onSubmit,
  saving,
  defaultMonth,
  budget = null,
  existingBudgets = [],
}){
  
  
  const [formData, setFormData] = useState({
    category: budget?.category ?? "",
    month: budget?.month
      ? budget.month.slice(0, 7)
      : defaultMonth || new Date().toISOString().slice(0, 7),
    limit: budget?.limit ?? "",
  });

  const [error, setError] = useState("");

  // 1. Categories already added this month (skip the current one if editing)
  const usedCategories = existingBudgets
    .filter((item) => item.id !== budget?.id)
    .map((item) => item.category);

  // 2. Filter available categories (keep unassigned ones, plus current one if editing)
  const availableCategories = CATEGORIES.filter(
    (cat) => !usedCategories.includes(cat) || cat === budget?.category
  );

  // 3. True if all categories are already used
  const allCategoriesAdded = !budget && availableCategories.length === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.category) {
      setError("Please select a category.");
      return;
    }
    if (!formData.limit || Number(formData.limit) <= 0) {
      setError("Budget limit must be greater than zero.");
      return;
    }

    // Backend expects full Date format (e.g. "YYYY-MM-01")
    const formattedMonth =
      formData.month.length === 7
        ? `${formData.month}-01`
        : formData.month;

    try {
      await onSubmit({
        category: formData.category,
        month: formattedMonth,
        limit: formData.limit,
      });
    } catch {
      setError("Unable to save the budget. Please try again.");
    }
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
    <div className="w-full max-w-md min-h-[460px] rounded-xl bg-white shadow-xl flex flex-col">
          {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {budget ? "Edit Budget" : "Add Budget"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {budget
                ? "Update your spending limit for this category."
                : "Set a monthly spending limit for a category."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close form"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col justify-between p-6">
          <div className="space-y-7">
            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            {allCategoriesAdded && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                All categories already have a budget configured for this month. You can edit an existing budget instead.
              </div>
            )}

            {/* Category Dropdown */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={allCategoriesAdded}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer"
              >
                <option value="">Select a category</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Limit Amount */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Budget Limit (₹)
              </label>
              <input
                id="limit"
                name="limit"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="e.g. 5000"
                value={formData.limit}
                onChange={handleChange}
                required
                className="no-spinner w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || allCategoriesAdded}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
            >
              {saving
                ? "Saving..."
                : allCategoriesAdded
                ? "All Categories Added"
                : budget
                ? "Update Budget"
                : "Add Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BudgetForm;
