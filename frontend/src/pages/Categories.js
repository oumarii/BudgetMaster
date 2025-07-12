import React, { useState, useEffect } from 'react';
import { categoryService } from '../services/api';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      setError('Category name cannot be empty');
      return;
    }

    try {
      await categoryService.create(newCategory.trim());
      setNewCategory('');
      setError('');
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      setError('Failed to create category. It might already exist.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryService.delete(id);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        setError('Failed to delete category');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Categories</h2>

      {/* Add Category Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Add New Category</h5>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Enter category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <button type="submit" className="btn btn-primary w-100">
                Add Category
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Categories List */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Existing Categories</h5>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(category.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan="2" className="text-center">
                      No categories found. Add some categories to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categories;
