import { Dimensions, Platform, StyleSheet } from 'react-native';
import Style from '../../../../styles/Stylesheet';

import * as Constants from '../../../../core/Constants';

const LocalStyles = StyleSheet.create({
    contentColor: {
        color: Constants.PRIMARY_COLOR
    },
    subtitlePage: {
        fontSize: Style.EM(1.5),
        marginTop: Style.EM(2.5),
        marginBottom: Style.EM(0.5)
    },
    descriptionPage: {
        fontSize: Style.EM(1),
        marginTop: Style.EM(0.5),
        marginBottom: Style.EM(1.5)
    },
    formContainer: {
        width: '80%'
    },
    buttonLinkText: {
        color: Constants.TERTIARY_COLOR_ALT,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16
    }
});

export default LocalStyles;
