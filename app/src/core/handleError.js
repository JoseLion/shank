import DropdownAlert from 'react-native-dropdownalert';

export default function(error) {
    global.dropDownRef.alertWithType('error', 'Error', error);
    global.setLoading(false);
}