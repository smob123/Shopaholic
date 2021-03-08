export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';

export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';

export function addNotification(notificationDetails) {
    return {
        type: ADD_NOTIFICATION,
        payload: notificationDetails
    }
}

export function removeNotification(notificationDetails) {
    return {
        type: REMOVE_NOTIFICATION,
        payload: notificationDetails
    }
}