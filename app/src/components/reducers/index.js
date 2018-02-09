import {combineReducers} from 'redux';
import {NavigationActions} from 'react-navigation';
import {AppNavigator} from '../navigators/AppNavigator';
import {AsyncStorage} from 'react-native';
import * as ShankConstants from '../../core/ShankConstants';


const firstAction = AppNavigator.router.getActionForPathAndParams('Splash');
const tempNavState = AppNavigator.router.getStateForAction(firstAction);
const secondAction = AppNavigator.router.getActionForPathAndParams('Slider');
const initialNavState = AppNavigator.router.getStateForAction(firstAction);

function nav(state = initialNavState, action) {
    let nextState;
    switch (action.type) {
        case 'Splash':
            nextState = AppNavigator.router.getStateForAction( NavigationActions.navigate({routeName: 'Splash'}), state );
            break;
        case 'Slider':
            nextState = AppNavigator.router.getStateForAction( NavigationActions.navigate({routeName: 'Slider'}), state );
            break;
        case 'Login':
            nextState = AppNavigator.router.getStateForAction( NavigationActions.navigate({routeName: 'Login'}), state );
            break;
        case 'Logout':
            nextState = AppNavigator.router.getStateForAction( NavigationActions.navigate({routeName: 'Logout'}), state );
            break;
        case 'Register':
            nextState = AppNavigator.router.getStateForAction( NavigationActions.navigate({routeName: 'Register'}), state );
            break;
        case 'Main':
            nextState = AppNavigator.router.getStateForAction( NavigationActions.navigate({routeName: 'Main'}), state );
            break;
        case 'AddGroup':
            nextState = AppNavigator.router.getStateForAction( NavigationActions.navigate({routeName: 'AddGroup'}), state );
            break;
        case 'EditGroup':
            nextState = AppNavigator.router.getStateForAction( NavigationActions.navigate({routeName: 'EditGroup'}), state );
            break;
        case 'Group':
            nextState = AppNavigator.router.getStateForAction( NavigationActions.navigate({routeName: 'Group'}), state );
            break;
        case 'PlayerSelection':
            nextState = AppNavigator.router.getStateForAction( NavigationActions.navigate({routeName: 'PlayerSelection'}), state );
            break;
        case 'PlayerSelectionSearch':
            nextState = AppNavigator.router.getStateForAction( NavigationActions.navigate({routeName: 'PlayerSelectionSearch'}), state );
            break;
        case 'Profile':
            nextState = AppNavigator.router.getStateForAction( NavigationActions.navigate({routeName: 'Profile'}), state );
            break;
        case 'Checkout':
            nextState = AppNavigator.router.getStateForAction( NavigationActions.navigate({routeName: 'Checkout'}), state );
            break;
        case 'Settings':
            nextState = AppNavigator.router.getStateForAction( NavigationActions.navigate({routeName: 'Settings'}), state );
            break;
        default:
            nextState = AppNavigator.router.getStateForAction(action, state); break;
    }
    return nextState || state;
}

const initialAuthState = {isLoggedIn: false};

async function _isItLoggedAsync() {
    return await AsyncStorage.getItem(ShankConstants.AUTH_TOKEN)
}

function _isUserLogged() {
    _isItLoggedAsync().then((authToken) => {
        console.log("current logged");
        alert(authToken);
        return authToken
    })
}
//TODO: HOW TO GET PROMISES IN REDUX STATES (assign to auth.isAuthenticated)

function auth(state = {
    isFetching: false,
    isAuthenticated: false
}, action) {
    switch (action.type) {
        case 'Login':
        return {...state, isLoggedIn: true};
        case 'Logout':
        return {...state, isLoggedIn: false};
        default:
        return state;
    }
}

const AppReducer = combineReducers({
    nav,
    auth,
});

export default AppReducer;
