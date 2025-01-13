import { setCart, setLoading, setError } from "../slices/cartSlice";
import { cartService } from "../../services";

export const getCartByUser = () => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const cart = await cartService.getCartByUser();
            dispatch(setCart(cart.data));
            dispatch(setError(null));
        } catch (error) {
            console.error("Error fetching logged-in cart:", error.response?.data || error.message);
            dispatch(setError(error.message || "Failed to fetch cart data."));
        } finally {
            dispatch(setLoading(false));
        }
    };
};

export const addToCart = (data) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await cartService.addToCart(data);
            dispatch(setCart(response.data));
        } catch (error) {
            console.error("Error adding to cart:", error.response?.data);
            dispatch(setError(error.response?.data?.message || "Failed to add to cart."));
        } finally {
            dispatch(setLoading(false));
        }
    };
};

export const updateCartItem = (data) => {
    return async (dispatch) => {
        try {
            const response = await cartService.updateCartItem(data);
            dispatch(setCart(response.data));
        }
        catch (error) {
            console.error("Update profile error:", error.response?.data);
            dispatch(setError(error.response?.data?.message || "Failed to update profile."));
        }
    }
}

export const removeFromCart = (id) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await cartService.removeFromCart(id);
            dispatch(setCart(response.data));
        } catch (error) {
            console.error("Error removing from cart:", error.response?.data);
            dispatch(setError(error.response?.data?.message || "Failed to remove from cart."));
        } finally {
            dispatch(setLoading(false));
        }
    };
}