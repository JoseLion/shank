import {combineReducers} from 'redux';
import {NavigationActions} from 'react-navigation';
import {AppNavigator} from '../navigators/AppNavigator';
import {AsyncStorage} from 'react-native';
import * as Constants from '../../core/Constans';


const firstAction = AppNavigator.router.getActionForPathAndParams('Splash');
const tempNavState = AppNavigator.router.getStateForAction(firstAction);
const secondAction = AppNavigator.router.getActionForPathAndParams('Slider');
const initialNavState = AppNavigator.router.getStateForAction(
    firstAction,
);

function nav(state = initialNavState, action) {
    let nextState;
    switch (action.type) {
        case 'Splash':
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({routeName: 'Splash'}),
                state
            );
            break;
        case 'Slider':
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({routeName: 'Slider'}),
                state
            );
            break;
        case 'Login':
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({routeName: 'Login'}),
                state
            );
            break;
        case 'Logout':
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({routeName: 'Logout'}),
                state
            );
            break;
        case 'Main':
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({routeName: 'Main'}),
                state
            );
            break;
        case 'Group':
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({routeName: 'Group'}),
                state
            );
            break;
        case 'Register':
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({routeName: 'Register'}),
                state
            );
            break;
        default:
            nextState = AppNavigator.router.getStateForAction(action, state);
            break;
    }
    return nextState || state;
}

const initialAuthState = {isLoggedIn: false};

function auth(state = {
    isFetching: false,
    isAuthenticated: !!AsyncStorage.getItem(Constants.AUTH_TOKEN)
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