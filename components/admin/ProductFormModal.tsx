"use client";

import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/env";
import type { ProductRow } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export type ProductFormModalProps = {
  open: boolean;
  onClose: () => void;
  product: ProductRow | null;
  onSaved: () => void;
};

const BUCKET = "product-images";

async function uploadImage(file: File, productId: string): Promise<string | null> {
  const supabase = createSupabaseBrowserClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${productId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type,
  });
  if (error) {
    toast.error(error.message);
    return null;
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function ProductFormModal({
  open,
  onClose,
  product,
  onSaved,
}: ProductFormModalProps) {
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(product);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSupabaseBrowserConfigured()) {
      toast.error("Configure Supabase in .env.local");
      return;
    }

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const price = Number(fd.get("price"));
    const category = String(fd.get("category") || "").trim();
    const description = String(fd.get("description") || "").trim();
    const badge = String(fd.get("badge") || "").trim();
    const stock = Number(fd.get("stock"));
    const imageFile = fd.get("image") as File | null;

    if (!name || Number.isNaN(price)) {
      toast.error("Name and price are required.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      let imageUrl = product?.image_url ?? null;

      const payload = {
        name,
        price,
        category: category || null,
        description: description || null,
        badge: badge || null,
        stock: Number.isNaN(stock) ? 100 : stock,
        image_url: imageUrl,
      };

      if (isEdit && product) {
        if (imageFile && imageFile.size > 0) {
          const url = await uploadImage(imageFile, product.id);
          if (url) payload.image_url = url;
        }
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", product.id);
        if (error) throw error;
        toast.success("Product updated");
      } else {
        const { data: inserted, error } = await supabase
          .from("products")
          .insert({ ...payload, image_url: null })
          .select("id")
          .single();
        if (error || !inserted) throw error ?? new Error("Insert failed");

        if (imageFile && imageFile.size > 0) {
          const url = await uploadImage(imageFile, inserted.id);
          if (url) {
            await supabase
              .from("products")
              .update({ image_url: url })
              .eq("id", inserted.id);
          }
        }
        toast.success("Product created");
      }

      onSaved();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit product" : "Add product"}
      className="max-w-xl"
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <Input label="Name" name="name" required defaultValue={product?.name ?? ""} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={product?.price ?? ""}
          />
          <Input
            label="Stock"
            name="stock"
            type="number"
            min="0"
            defaultValue={product?.stock ?? 100}
          />
        </div>
        <Input label="Category" name="category" defaultValue={product?.category ?? ""} />
        <Input label="Badge" name="badge" defaultValue={product?.badge ?? ""} />
        <div className="space-y-1.5">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={product?.description ?? ""}
            className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/30"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-green-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-green-800"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Saving…" : isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
