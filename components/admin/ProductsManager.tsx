"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Trash2, Plus, Package } from "lucide-react";
import toast from "react-hot-toast";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/env";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import type { ProductRow } from "@/types";

export function ProductsManager({ products: initialProducts }: { products: ProductRow[] }) {
  const [products, setProducts] = useState<ProductRow[]>(initialProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const reload = async () => {
    if (!isSupabaseBrowserConfigured()) return;
    const supabase = createSupabaseBrowserClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProducts(data as ProductRow[]);
  };

  const handleAdd = () => { setEditing(null); setModalOpen(true); };
  const handleEdit = (product: ProductRow) => { setEditing(product); setModalOpen(true); };

  const handleDelete = async (product: ProductRow) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    if (!isSupabaseBrowserConfigured()) { toast.error("Configure Supabase in .env.local"); return; }
    setDeletingId(product.id);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.from("products").delete().eq("id", product.id);
      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      toast.success(`"${product.name}" deleted`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const StockBadge = ({ stock }: { stock: number | null }) => (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
      (stock ?? 0) === 0
        ? "bg-red-50 text-red-700 border-red-200"
        : (stock ?? 0) < 10
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-green-50 text-green-700 border-green-200"
    }`}>
      {stock ?? 0} left
    </span>
  );

  const ProductImage = ({ product }: { product: ProductRow }) => (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
      {product.image_url ? (
        <Image src={product.image_url} alt={product.name} fill className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-gray-300">
          <Package className="h-5 w-5" />
        </div>
      )}
    </div>
  );

  const ActionButtons = ({ product }: { product: ProductRow }) => (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => handleEdit(product)}
        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors"
      >
        <Pencil className="h-3 w-3" />
        Edit
      </button>
      <button
        type="button"
        onClick={() => void handleDelete(product)}
        disabled={deletingId === product.id}
        className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 shadow-sm hover:bg-red-100 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {deletingId === product.id ? (
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
        ) : (
          <Trash2 className="h-3 w-3" />
        )}
        Delete
      </button>
    </div>
  );

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">
            {products.length} product{products.length !== 1 ? "s" : ""} in catalogue
          </p>
        </div>
        <Button variant="primary" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-1.5" />
          Add Product
        </Button>
      </div>

      {/* ── Empty state ── */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
          <Package className="h-12 w-12 text-gray-300 mb-3" />
          <p className="font-semibold text-gray-500">No products yet</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Product" to create your first one.</p>
        </div>
      ) : (
        <>
          {/* ── Mobile: card layout ── */}
          <div className="flex flex-col gap-4 lg:hidden">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm space-y-3"
              >
                {/* Top row: image + name */}
                <div className="flex items-center gap-3">
                  <ProductImage product={product} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                    {product.description && (
                      <p className="text-xs text-gray-400 truncate">{product.description}</p>
                    )}
                  </div>
                </div>

                {/* Meta row: category, price, stock, badge */}
                <div className="flex flex-wrap gap-2">
                  {product.category && (
                    <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700 border border-orange-100">
                      {product.category}
                    </span>
                  )}
                  <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-semibold text-gray-700 border border-gray-200">
                    {formatCurrency(product.price)}
                  </span>
                  <StockBadge stock={product.stock} />
                  {product.badge && (
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-100">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-1 border-t border-gray-100">
                  <ActionButtons product={product} />
                </div>
              </div>
            ))}
          </div>

          {/* ── Desktop: table layout ── */}
          <div className="hidden lg:block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Badge</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/70 transition-colors align-middle">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <ProductImage product={product} />
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate max-w-[200px]">{product.name}</p>
                            {product.description && (
                              <p className="text-xs text-gray-400 truncate max-w-[200px]">{product.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {product.category ? (
                          <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700 border border-orange-100">
                            {product.category}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-4 py-3">
                        <StockBadge stock={product.stock} />
                      </td>
                      <td className="px-4 py-3">
                        {product.badge ? (
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-100">
                            {product.badge}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <ActionButtons product={product} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── Add / Edit Modal ── */}
      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={editing}
        onSaved={reload}
      />
    </div>
  );
}