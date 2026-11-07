import api from "./api.js";

export const getAllProduct = async () => {
    const response = await api.get("/products");
    return response.data;
}
export const getProductById = async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data.data.product;
}
export const createProduct = async (productData) => {
    const response = await api.post("/products/create/product", productData);
    return response.data;
}
export const updateProduct = async (productId, productData) => {
    const response = await api.patch(`/products/update/product/${productId}`, productData);
    return response.data;
}
export const deleteProduct = async (productId) => {
    const response = await api.delete(`/products/delete/product/${productId}`);
    return response.data;
}
export const uploadimage = async (files) => {
    const formData = new FormData();
    for (const file of files) {
        formData.append("images", file);
    }

    const { data } = await api.post("/products/upload", formData);
    if (Array.isArray(data.images)) {
        return data.images.map((image) => typeof image === "string" ? image : image.url).filter(Boolean);
    }
    if (data.image?.url) {
        return [data.image.url];
    }
    throw new Error(data.message || "Image upload response did not contain an image URL");
}