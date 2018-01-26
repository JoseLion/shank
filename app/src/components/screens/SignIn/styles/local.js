import { Dimensions, Platform, StyleSheet, ShankConstants, Style } from '../../BaseComponent';

const LocalStyles = StyleSheet.create({
    contentColor: {
        color: ShankConstants.PRIMARY_COLOR
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
        color: ShankConstants.TERTIARY_COLOR_ALT,
    }
});

export default LocalStyles;
