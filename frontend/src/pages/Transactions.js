import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { transactionService, categoryService } from '../services/api';

function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    type: 'EXPENSE',
    amount: '',
    category: '',
    description: '',
    transactionDate: new Date().toISOString().split('T')[0],
  });
  const [filter, setFilter] = useState({
    type: 'ALL',
    startDate: '',
    endDate: '',
    category: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [user.id]);

  const fetchTransactions = async () => {
    try {
      const response = await transactionService.getAll(user.id);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
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
        await transactionService.update(editingId, data);
      } else {
        await transactionService.create(data);
      }

      setFormData({
        type: 'EXPENSE',
        amount: '',
        category: '',
        description: '',
        transactionDate: new Date().toISOString().split('T')[0],
      });
      setEditingId(null);
      fetchTransactions();
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setFormData({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      transactionDate: transaction.transactionDate,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.delete(id);
        fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter.type !== 'ALL' && transaction.type !== filter.type) return false;
    if (filter.category && transaction.category !== filter.category) return false;
    if (filter.startDate && transaction.transactionDate < filter.startDate) return false;
    if (filter.endDate && transaction.transactionDate > filter.endDate) return false;
    return true;
  });

  return (
    <div className="container mt-4">
      <h2>Manage Transactions</h2>

      {/* Transaction Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{editingId ? 'Edit Transaction' : 'Add New Transaction'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-2">
                <div className="mb-3">
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                  </select>
                </div>
              </div>
              <div className="col-md-2">
                <div className="mb-3">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col-md-3">
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
              <div className="col-md-3">
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.transactionDate}
                    onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
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
            <div className="row">
              <div className="col-12">
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Filters</h5>
          <div className="row">
            <div className="col-md-3">
              <div className="mb-3">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={filter.type}
                  onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                >
                  <option value="ALL">All</option>
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={filter.category}
                  onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={filter.startDate}
                  onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={filter.endDate}
                  onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Transactions</h5>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{transaction.transactionDate}</td>
                    <td>
                      <span className={`badge ${transaction.type === 'INCOME' ? 'bg-success' : 'bg-danger'}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td>{transaction.category}</td>
                    <td>${transaction.amount}</td>
                    <td>{transaction.description}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleEdit(transaction)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(transaction.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transactions;
