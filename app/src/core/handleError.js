import { EventRegister } from 'react-native-event-listeners';
import * as AppConst from 'Core/AppConst';

export default function(error) {
    if (error == null) {
        error = "Could not determine error";
    }

    if (typeof error === 'object') {
        if (error.error) {
            error = error.error;
        } else if (error.message) {
            error = error.message;
        } else if (error.data) {
            error = error.data;
        } else {
            error = JSON.stringify(error);
        }
    }

    global.setLoading(false);
    EventRegister.emit(AppConst.EVENTS.showErrorMessageBar, error);
}