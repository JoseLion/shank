import { Dimensions, Platform, StyleSheet, AppConst, Style } from '../../BaseComponent';

const LocalStyles = StyleSheet.create({
    contentColor: {
        color: AppConst.COLOR_BLUE
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
        color: AppConst.COLOR_GRAY,
    }
});

export default LocalStyles;
