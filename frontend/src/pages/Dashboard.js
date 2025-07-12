import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { transactionService, budgetService } from '../services/api';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, budgetsRes] = await Promise.all([
          transactionService.getAll(user.id),
          budgetService.getAll(user.id),
        ]);

        setTransactions(transactionsRes.data);
        setBudgets(budgetsRes.data);

        // Calculate summary
        const income = transactionsRes.data
          .filter(t => t.type === 'INCOME')
          .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactionsRes.data
          .filter(t => t.type === 'EXPENSE')
          .reduce((sum, t) => sum + t.amount, 0);

        setSummary({
          totalIncome: income,
          totalExpenses: expenses,
          netSavings: income - expenses,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [user.id]);

  const getCategoryData = () => {
    const categoryMap = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  };

  const getBudgetVsActual = () => {
    return budgets.map(budget => {
      const actual = transactions
        .filter(t => t.category === budget.category && t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        category: budget.category,
        budget: budget.amount,
        actual: actual,
      };
    });
  };

  return (
    <div className="container mt-4">
      <h2>Financial Dashboard</h2>
      
      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Total Income</h5>
              <h3 className="card-text">${summary.totalIncome.toFixed(2)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <h5 className="card-title">Total Expenses</h5>
              <h3 className="card-text">${summary.totalExpenses.toFixed(2)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Net Savings</h5>
              <h3 className="card-text">${summary.netSavings.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Expenses by Category</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getCategoryData()}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Budget vs Actual Spending</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getBudgetVsActual()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="budget" fill="#8884d8" name="Budget" />
                  <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
