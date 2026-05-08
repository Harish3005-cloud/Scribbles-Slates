import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, Edit2, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { resolveCatalogImage } from '../utils/productImages.js';

const API = 'http://localhost:5000/api';

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    productId: '', name: '', category: '', description: '', price: '', stock: ''
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    } else {
      fetchProducts();
    }
  }, [user, navigate]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API}/inventory`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`${API}/inventory/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        productId: product.productId,
        name: product.name,
        category: product.category,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        productId: '', name: '', category: '', description: '', price: '', stock: ''
      });
    }
    setImageFile(null);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) data.append('image', imageFile);

    const url = editingProduct 
      ? `${API}/inventory/${editingProduct.productId}` 
      : `${API}/inventory`;
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to save product');
        return;
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to save product');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="page-container py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={32} className="animate-spin text-ink" /></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[600px]">
            <thead className="bg-parchment text-gray-600 border-b border-gray-100">
              <tr>
                <th className="p-4 font-medium">Image</th>
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(p => (
                <tr key={p.productId} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <img src={resolveCatalogImage({ name: p.name, image: p.image })} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                  </td>
                  <td className="p-4 font-medium text-gray-800">
                    {p.name} 
                    <div className="text-xs text-slate font-normal mt-0.5">{p.productId}</div>
                  </td>
                  <td className="p-4 text-slate">{p.category}</td>
                  <td className="p-4 text-ink font-semibold">₹{p.price.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.stock > 10 ? 'bg-success/10 text-success' : p.stock > 0 ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(p)} className="p-2 text-slate hover:text-ink hover:bg-gray-100 rounded-lg transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(p.productId)} className="p-2 text-slate hover:text-danger hover:bg-danger/5 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 animate-fade-in backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="font-serif text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate hover:text-ink p-1"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product ID (SKU)</label>
                  <input required disabled={!!editingProduct} type="text" className="input-field disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed" value={formData.productId} onChange={e => setFormData({...formData, productId: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input required type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input required type="text" className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input required type="number" step="0.01" className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input required type="number" className="input-field" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows="3" className="input-field resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="space-y-2 text-center">
                    <ImageIcon className="mx-auto h-10 w-10 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label className="relative cursor-pointer rounded-md font-medium text-ink hover:text-inkLight focus-within:outline-none">
                        <span>Upload a file</span>
                        <input type="file" accept="image/*" className="sr-only" onChange={e => setImageFile(e.target.files[0])} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate">{imageFile ? imageFile.name : 'PNG, JPG, GIF, WEBP up to 10MB'}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="btn-primary text-sm px-6 py-2.5">{editingProduct ? 'Save Changes' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
