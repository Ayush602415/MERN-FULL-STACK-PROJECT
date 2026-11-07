
import api from "./api";

export const addToWishlist = async (productId) => {
    const { data } = await api.post("/wishlist/addWishlist", { productId });
    return data;
};

export const getWishlist = async () => {
    const { data } = await api.get("/wishlist");
    return data;
};

export const removeFromWishlist = async (productId) => {
    const { data } = await api.delete(`/wishlist/remove/${productId}`);
    return data;
};
