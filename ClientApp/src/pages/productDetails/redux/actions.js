import ProductDetailsModel from '../productDetailsModel';
import { addNotification } from '../../../components/notification/redux/actions';

export const GET_CART = 'GET_CART';

export const RESET_CART = 'RESET_CART';

export const ADD_PRODUCT = 'ADD_PRODUCT';

export const EDIT_QUANTITY = 'EDIT_QUANTITY';

export const REMOVE_PRODUCT = 'REMOVE_PRODUCT';

export const CART_ERROR = 'CART_ERROR';

export function getCart() {
    return async (dispatch) => {
        const cartItems = await ProductDetailsModel.getCart() || [];

        dispatch({
            type: GET_CART,
            payload: cartItems
        });
    }
}

export function resetCart() {
    return {
        type: RESET_CART,
        payload: []
    }
}

export function addProduct(product, quantity) {
    return async (dispatch) => {
        const response = await ProductDetailsModel.addProduct(product.id, quantity);
        if (response.status === 200) {
            dispatch({
                type: ADD_PRODUCT,
                payload: { product, quantity }
            });

            dispatch(addNotification({
                type: 'Success',
                message: 'Product has been added to your cart'
            }));
        } else {
            dispatch(addNotification({
                type: 'Error',
                message: response.message
            }));
        }
    }
}

export function editQuantity(product, newQuantity) {
    return async (dispatch) => {
        const response = await ProductDetailsModel.updateProduct(product.id, newQuantity);
        if (response.status === 200) {
            dispatch({
                type: EDIT_QUANTITY,
                payload: { product, newQuantity }
            });

            dispatch(addNotification({
                type: 'Success',
                message: 'Your cart has been updated'
            }));
        } else {
            dispatch(addNotification({
                type: 'Error',
                message: response.message
            }));
        }
    }
}

export function removeProduct(productId) {
    return async (dispatch) => {
        const response = await ProductDetailsModel.removeProduct(productId);
        if (response.status === 200) {
            dispatch({
                type: REMOVE_PRODUCT,
                payload: productId
            });

            dispatch(addNotification({
                type: 'Success',
                message: 'Item has been successfully removed'
            }));
        } else {
            dispatch(addNotification({
                type: 'Error',
                message: response.message
            }));
        }
    }
}