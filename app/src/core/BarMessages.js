import DropdownAlert from 'react-native-dropdownalert';

export function showSuccess(message, messenger) {
    messenger.alertWithType('success', 'Success', message);
}

export function showError(message, messenger) {
    messenger.alertWithType('error', 'Error', message);
}

export function showWarning(message, messenger) {
    messenger.alertWithType('warning', 'Warning', message);
}
