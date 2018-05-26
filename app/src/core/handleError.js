import { EventRegister } from 'react-native-event-listeners';
import * as AppConst from 'Core/AppConst';

export default function(error) {
    setTimeout(() => {
        global.setLoading(false);
    }, 0);

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

    EventRegister.emit(AppConst.EVENTS.showErrorMessageBar, error);
    console.log("HANDLE ERROR EXCEPTION: ", error);
}