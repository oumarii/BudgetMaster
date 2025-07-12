import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { budgetService, categoryService, transactionService } from '../services/api';
import { ProgressBar } from 'react-bootstrap';

function Budgets() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [user.id]);

  const fetchData = async () => {
    try {
      const [budgetsRes, categoriesRes, transactionsRes] = await Promise.all([
        budgetService.getAll(user.id),
        categoryService.getAll(),
        transactionService.getAll(user.id)
      ]);

      setBudgets(budgetsRes.data);
      setCategories(categoriesRes.data);
      setTransactions(transactionsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        userId: user.id,
      };

      if (editingId) {
        await budgetService.update(editingId, data);
      } else {
        await budgetService.create(data);
      }

      setFormData({
        category: '',
        amount: '',
      });
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const handleEdit = (budget) => {
    setEditingId(budget.id);
    setFormData({
      category: budget.category,
      amount: budget.amount,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await budgetService.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  const calculateProgress = (budget) => {
    const spent = transactions
      .filter(t => t.category === budget.category && t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      amount: spent,
      percentage: (spent / budget.amount) * 100,
    };
  };

  const getProgressBarVariant = (percentage) => {
    if (percentage >= 100) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  return (
    <div className="container mt-4">
      <h2>Budget Management</h2>

      {/* Budget Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{editingId ? 'Edit Budget' : 'Add New Budget'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-5">
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-5">
                <div className="mb-3">
                  <label className="form-label">Budget Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="mb-3">
                  <label className="form-label">&nbsp;</label>
                  <button type="submit" className="btn btn-primary w-100">
                    {editingId ? 'Update' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Budgets List */}
      <div className="row">
        {budgets.map(budget => {
          const progress = calculateProgress(budget);
          const variant = getProgressBarVariant(progress.percentage);

          return (
            <div key={budget.id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">{budget.category}</h5>
                    <div>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleEdit(budget)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(budget.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="card-text">
                    Budget: ${budget.amount}
                  </p>
                  <p className="card-text">
                    Spent: ${progress.amount} ({progress.percentage.toFixed(1)}%)
                  </p>
                  <ProgressBar
                    now={Math.min(progress.percentage, 100)}
                    variant={variant}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Budgets;
