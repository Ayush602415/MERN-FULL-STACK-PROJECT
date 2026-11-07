import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, ImagePlus, X } from "lucide-react";
import { createProduct, getProductById, updateProduct, uploadimage } from "../services/product.api";

const emptyForm = {
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
};

const AdminProductForm = () => {
    const { productId } = useParams();
    const isEditing = Boolean(productId);
    const navigate = useNavigate();
    const [form, setForm] = useState(emptyForm);
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(isEditing);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const previewUrls = useRef(new Set());

    useEffect(() => () => {
        previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    }, []);

    useEffect(() => {
        if (!isEditing) return undefined;

        let isCurrent = true;
        const fetchProduct = async () => {
            try {
                const product = await getProductById(productId);
                if (!isCurrent) return;
                setForm({
                    name: product.name || "",
                    description: product.description || "",
                    price: product.price ?? "",
                    category: product.category || "",
                    brand: product.brand || "",
                    stock: product.stock ?? product.stocks ?? "",
                });
                setImages(product.images || product.image || []);
            } catch (requestError) {
                if (isCurrent) setError(requestError.response?.data?.message || "Failed to load product");
            } finally {
                if (isCurrent) setLoading(false);
            }
        };

        fetchProduct();
        return () => {
            isCurrent = false;
        };
    }, [isEditing, productId]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleImageChange = async (event) => {
        const selectedFiles = Array.from(event.target.files || []);
        event.target.value = "";
        if (selectedFiles.length === 0) return;

        const remainingSlots = 5 - images.length;
        if (selectedFiles.length > remainingSlots) {
            setError(`You can add up to ${remainingSlots} more image${remainingSlots === 1 ? "" : "s"}.`);
            return;
        }

        const previewItems = selectedFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        previewItems.forEach((preview) => previewUrls.current.add(preview.url));
        setPreviews((current) => [...current, ...previewItems]);
        setError("");
        setUploading(true);

        try {
            const uploadedUrls = await uploadimage(selectedFiles);
            setImages((current) => [...current, ...uploadedUrls].slice(0, 5));
            setPreviews((current) => current.filter((preview) => !previewItems.includes(preview)));
            previewItems.forEach((preview) => {
                URL.revokeObjectURL(preview.url);
                previewUrls.current.delete(preview.url);
            });
        } catch (requestError) {
            setError(requestError.response?.data?.message || requestError.message || "Image upload failed");
            setPreviews((current) => current.filter((preview) => !previewItems.includes(preview)));
            previewItems.forEach((preview) => {
                URL.revokeObjectURL(preview.url);
                previewUrls.current.delete(preview.url);
            });
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (imageToRemove) => {
        setImages((current) => current.filter((image) => image !== imageToRemove));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (uploading) {
            setError("Wait for image uploads to finish before saving.");
            return;
        }
        if (images.length === 0) {
            setError("Add at least one product image.");
            return;
        }

        setSaving(true);
        setError("");
        const productData = {
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
            images,
        };

        try {
            await (isEditing
                ? updateProduct(productId, productData)
                : createProduct(productData));
            navigate("/admin/products");
        } catch (requestError) {
            setError(requestError.response?.data?.message || requestError.message || "Failed to save product");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen p-10 text-white">Loading product...</div>;
    }

    return (
        <main className="min-h-screen px-5 py-10 text-white md:px-10">
            <div className="mx-auto max-w-3xl">
                <Link to="/admin/products" className="mb-6 inline-flex items-center gap-2 text-gray-400 hover:text-white">
                    <ArrowLeft size={18} />
                    Back to products
                </Link>
                <h1 className="mb-2 text-3xl font-bold">{isEditing ? "Edit Product" : "Create Product"}</h1>
                <p className="mb-8 text-gray-400">Add product details and upload up to five images.</p>

                {error && <p role="alert" className="mb-6 rounded-lg border border-red-400/30 bg-red-400/10 p-4 text-red-300">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/10 bg-[#181818] p-5 md:p-8">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <label className="text-sm text-gray-300">
                            Product name
                            <input name="name" required value={form.name} onChange={handleChange} className="mt-2 w-full rounded-lg border border-white/10 bg-[#101010] px-4 py-3 text-white outline-none focus:border-purple-400" />
                        </label>
                        <label className="text-sm text-gray-300">
                            Brand
                            <input name="brand" required value={form.brand} onChange={handleChange} className="mt-2 w-full rounded-lg border border-white/10 bg-[#101010] px-4 py-3 text-white outline-none focus:border-purple-400" />
                        </label>
                        <label className="text-sm text-gray-300">
                            Category
                            <input name="category" required value={form.category} onChange={handleChange} className="mt-2 w-full rounded-lg border border-white/10 bg-[#101010] px-4 py-3 text-white outline-none focus:border-purple-400" />
                        </label>
                        <label className="text-sm text-gray-300">
                            Price (₹)
                            <input name="price" type="number" min="0.01" step="0.01" required value={form.price} onChange={handleChange} className="mt-2 w-full rounded-lg border border-white/10 bg-[#101010] px-4 py-3 text-white outline-none focus:border-purple-400" />
                        </label>
                        <label className="text-sm text-gray-300 sm:col-span-2">
                            Stock
                            <input name="stock" type="number" min="0" step="1" required value={form.stock} onChange={handleChange} className="mt-2 w-full rounded-lg border border-white/10 bg-[#101010] px-4 py-3 text-white outline-none focus:border-purple-400" />
                        </label>
                        <label className="text-sm text-gray-300 sm:col-span-2">
                            Description
                            <textarea name="description" required rows="5" value={form.description} onChange={handleChange} className="mt-2 w-full rounded-lg border border-white/10 bg-[#101010] px-4 py-3 text-white outline-none focus:border-purple-400" />
                        </label>
                    </div>

                    <section>
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="font-semibold">Product images ({images.length}/5)</h2>
                            {uploading && <span className="text-sm text-purple-300">Uploading...</span>}
                        </div>
                        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-[#101010] px-4 py-6 text-sm text-gray-300 transition hover:border-purple-400">
                            <ImagePlus size={18} />
                            Choose images
                            <input type="file" accept="image/*" multiple disabled={uploading || images.length >= 5} onChange={handleImageChange} className="sr-only" />
                        </label>
                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {images.map((image, index) => (
                                <div key={`${image}-${index}`} className="group relative">
                                    <img src={image} alt={`Product ${index + 1}`} className="h-32 w-full rounded-lg object-cover" />
                                    <button type="button" onClick={() => removeImage(image)} aria-label="Remove image" className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-red-600">
                                        <X size={15} />
                                    </button>
                                </div>
                            ))}
                            {previews.map((preview) => (
                                <img key={preview.url} src={preview.url} alt="Uploading preview" className="h-32 w-full rounded-lg object-cover opacity-60" />
                            ))}
                        </div>
                    </section>

                    <button type="submit" disabled={saving || uploading} className="w-full rounded-lg bg-purple-600 px-5 py-3 font-semibold transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50">
                        {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default AdminProductForm;
