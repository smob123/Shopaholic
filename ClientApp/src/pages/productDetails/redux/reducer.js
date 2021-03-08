import { GET_CART, RESET_CART, ADD_PRODUCT, EDIT_QUANTITY, REMOVE_PRODUCT } from './actions';

export default function reducer(state = [], action) {
    switch (action.type) {
        case GET_CART:
            state = action.payload;
            break;
        case RESET_CART:
            state = action.payload;
            break;
        case ADD_PRODUCT:
            state = [action.payload, ...state];
            break;
        case EDIT_QUANTITY:
            state = state.map(item => {
                if (item.product.id === action.payload.product.id) {
                    item.quantity = action.payload.newQuantity;
                }

                return item;
            });
            break;
        case REMOVE_PRODUCT:
            state = state.filter(item => item.product.id !== action.payload);
            break;
        default:
            break;
    }

    return state;
}