import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from './actions';

export default function reducer(state = [], action) {

    switch (action.type) {
        case ADD_NOTIFICATION:
            state = [...state, action.payload];
            break;
        case REMOVE_NOTIFICATION:
            state = state.filter(item => item.type !== action.payload.type && item.message !== action.payload.message);
            break;
        default:
            break;
    }

    return state;
}