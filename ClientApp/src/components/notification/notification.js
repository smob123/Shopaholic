/**
 * displays various notifications on the top-right of the screen
 */

import { useState } from 'react';
import { Toast } from 'react-bootstrap';

import { removeNotification } from './redux/actions';
import { useDispatch } from 'react-redux';

export default function Notification({ type, message }) {

    const [show, setShow] = useState(true);
    const dispatch = useDispatch();

    const hideNotification = () => {
        setShow(false);
        dispatch(removeNotification({ type, message }));
    }

    return (
        <Toast className='notification-container'
            autohide
            show={show}
            onClose={() => hideNotification()}>
            <Toast.Header>
                <strong>{type}</strong>
            </Toast.Header>

            <Toast.Body>
                <p>{message}</p>
            </Toast.Body>
        </Toast>
    );
}