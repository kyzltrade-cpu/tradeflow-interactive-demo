'use client';

import { useState } from 'react';
import { useLang } from '@/lib/lang';
import { useDemo } from '@/lib/mock-store';
import { useToast } from '@/components/Toast';

interface ProductFormData {
  name: string;
  description: string;
  moq: string;
  price_range: string;
  category: string;
}

export default function ProductsPage() {
  const { t } = useLang();
  const { products, addProduct, updateProduct, deleteProduct } = useDemo();
  const { showToast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<ProductFormData>({ name: '', description: '', moq: '', price_range: '', category: '' });
  const [editForm, setEditForm] = useState<ProductFormData>({ name: '', description: '', moq: '', price_range: '', category: '' });

  const handleAdd = () => {
    if (!newProduct.name.trim()) {
      showToast(t('Product name is required', '產品名稱為必填'), 'error');
      return;
    }
    addProduct(newProduct);
    setNewProduct({ name: '', description: '', moq: '', price_range: '', category: '' });
    setShowAdd(false);
    showToast(t('Product added', '產品已新增'), 'success');
  };

  const handleEdit = () => {
    if (!editingProduct || !editForm.name.trim()) return;
    updateProduct(editingProduct, editForm);
    setEditingProduct(null);
    showToast(t('Product updated', '產品已更新'), 'success');
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    showToast(t('Product deleted', '產品已刪除'), 'success');
  };

  const startEditing = (product: { id: string; name: string; description: string; moq: string; price_range: string; category: string }) => {
    setEditingProduct(product.id);
    setEditForm({ name: product.name, description: product.description, moq: product.moq, price_range: product.price_range, category: product.category });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[20px] md:text-[24px] font-semibold tracking-[-0.5px]">{t('Products', '產品')}</h1>
          <p className="text-[13px] md:text-[14px] mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('Manage your product catalog — the AI uses these to answer customer inquiries', '管理您的產品目錄——AI 使用這些資料回覆客戶查詢')}
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="text-[13px] md:text-[14px] font-medium px-4 py-2.5 rounded-[4px] text-white w-full sm:w-auto"
          style={{ background: 'var(--accent)' }}
        >
          {t('Add product', '新增產品')}
        </button>
      </div>

      {/* Add Product Form */}
      {showAdd && (
        <div className="border rounded-[4px] p-4 md:p-5 mb-6" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <h2 className="text-[14px] md:text-[15px] font-semibold mb-4">{t('New product', '新產品')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <input
              placeholder={t('Product name', '產品名稱')}
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="border rounded-[4px] px-3 py-2 text-[13px] md:text-[14px] focus:outline-none"
              style={{ borderColor: 'var(--border)' }}
            />
            <input
              placeholder={t('Category', '類別')}
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="border rounded-[4px] px-3 py-2 text-[13px] md:text-[14px] focus:outline-none"
              style={{ borderColor: 'var(--border)' }}
            />
            <input
              placeholder={t('MOQ (e.g. 500 pcs)', 'MOQ（例如 500個）')}
              value={newProduct.moq}
              onChange={(e) => setNewProduct({ ...newProduct, moq: e.target.value })}
              className="border rounded-[4px] px-3 py-2 text-[13px] md:text-[14px] focus:outline-none"
              style={{ borderColor: 'var(--border)' }}
            />
            <input
              placeholder={t('Price range (e.g. USD 2.80–3.50)', '價格範圍（例如 USD 2.80–3.50）')}
              value={newProduct.price_range}
              onChange={(e) => setNewProduct({ ...newProduct, price_range: e.target.value })}
              className="border rounded-[4px] px-3 py-2 text-[13px] md:text-[14px] focus:outline-none"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>
          <input
            placeholder={t('Description', '描述')}
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="border rounded-[4px] px-3 py-2 text-[13px] md:text-[14px] w-full mb-4 focus:outline-none"
            style={{ borderColor: 'var(--border)' }}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowAdd(false)}
              className="text-[12px] md:text-[13px] px-4 py-2 rounded-[4px] border"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            >
              {t('Cancel', '取消')}
            </button>
            <button
              onClick={handleAdd}
              className="text-[12px] md:text-[13px] font-medium px-4 py-2 rounded-[4px] text-white"
              style={{ background: 'var(--accent)' }}
            >
              {t('Add product', '新增產品')}
            </button>
          </div>
        </div>
      )}

      {/* Edit Product Form */}
      {editingProduct && (
        <div className="border rounded-[4px] p-4 md:p-5 mb-6" style={{ borderColor: 'var(--accent)', background: 'var(--surface)' }}>
          <h2 className="text-[14px] md:text-[15px] font-semibold mb-4">{t('Edit product', '編輯產品')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <input
              placeholder={t('Product name', '產品名稱')}
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="border rounded-[4px] px-3 py-2 text-[13px] md:text-[14px] focus:outline-none"
              style={{ borderColor: 'var(--border)' }}
            />
            <input
              placeholder={t('Category', '類別')}
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              className="border rounded-[4px] px-3 py-2 text-[13px] md:text-[14px] focus:outline-none"
              style={{ borderColor: 'var(--border)' }}
            />
            <input
              placeholder={t('MOQ (e.g. 500 pcs)', 'MOQ（例如 500個）')}
              value={editForm.moq}
              onChange={(e) => setEditForm({ ...editForm, moq: e.target.value })}
              className="border rounded-[4px] px-3 py-2 text-[13px] md:text-[14px] focus:outline-none"
              style={{ borderColor: 'var(--border)' }}
            />
            <input
              placeholder={t('Price range (e.g. USD 2.80–3.50)', '價格範圍（例如 USD 2.80–3.50）')}
              value={editForm.price_range}
              onChange={(e) => setEditForm({ ...editForm, price_range: e.target.value })}
              className="border rounded-[4px] px-3 py-2 text-[13px] md:text-[14px] focus:outline-none"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>
          <input
            placeholder={t('Description', '描述')}
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            className="border rounded-[4px] px-3 py-2 text-[13px] md:text-[14px] w-full mb-4 focus:outline-none"
            style={{ borderColor: 'var(--border)' }}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setEditingProduct(null)}
              className="text-[12px] md:text-[13px] px-4 py-2 rounded-[4px] border"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            >
              {t('Cancel', '取消')}
            </button>
            <button
              onClick={handleEdit}
              className="text-[12px] md:text-[13px] font-medium px-4 py-2 rounded-[4px] text-white"
              style={{ background: 'var(--accent)' }}
            >
              {t('Save changes', '儲存變更')}
            </button>
          </div>
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden md:block border rounded-[4px]" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <table className="w-full text-[14px]">
          <thead>
            <tr className="border-b text-left" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              <th className="px-5 py-3 font-medium">{t('Product', '產品')}</th>
              <th className="px-5 py-3 font-medium">{t('Category', '類別')}</th>
              <th className="px-5 py-3 font-medium">{t('MOQ', '最低訂購量')}</th>
              <th className="px-5 py-3 font-medium">{t('Price Range', '價格範圍')}</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
                <td className="px-5 py-3">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-[12px] mt-0.5 truncate max-w-[300px]" style={{ color: 'var(--text-muted)' }}>{product.description}</p>
                </td>
                <td className="px-5 py-3">
                  <span className="text-[11px] px-2 py-0.5 rounded font-medium" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                    {product.category}
                  </span>
                </td>
                <td className="px-5 py-3" style={{ color: 'var(--text-muted)' }}>{product.moq}</td>
                <td className="px-5 py-3 font-medium">{product.price_range}</td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => startEditing(product)}
                    className="text-[13px] px-3 py-1 rounded mr-2"
                    style={{ color: 'var(--accent)' }}
                  >
                    {t('Edit', '編輯')}
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-[13px] px-3 py-1 rounded"
                    style={{ color: 'var(--error)' }}
                  >
                    {t('Delete', '刪除')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {products.map((product) => (
          <div key={product.id} className="border rounded-[4px] p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <div className="flex items-start justify-between mb-2">
              <p className="text-[14px] font-medium flex-1">{product.name}</p>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-medium ml-2" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                {product.category}
              </span>
            </div>
            <p className="text-[12px] mb-3" style={{ color: 'var(--text-muted)' }}>{product.description}</p>
            <div className="flex items-center justify-between text-[12px] mb-3">
              <span style={{ color: 'var(--text-muted)' }}>MOQ: {product.moq}</span>
              <span className="font-medium">{product.price_range}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEditing(product)}
                className="text-[12px] px-3 py-1.5 rounded border flex-1"
                style={{ borderColor: 'var(--border)', color: 'var(--accent)' }}
              >
                {t('Edit', '編輯')}
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="text-[12px] px-3 py-1.5 rounded border flex-1"
                style={{ borderColor: 'var(--border)', color: 'var(--error)' }}
              >
                {t('Delete', '刪除')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
