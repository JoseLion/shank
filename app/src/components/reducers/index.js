import {combineReducers} from 'redux';
import {NavigationActions} from 'react-navigation';
import {AppNavigator} from '../navigators/AppNavigator';


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
                NavigationActions.navigate({routeName: 'Slider'}),
                state
            );
            break;
        // case 'Login':
        //     nextState = AppNavigator.router.getStateForAction(
        //         NavigationActions.back(),
        //         state
        //     );
        //     break;
        case 'Login':
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({routeName: 'Main'}),
                state
            );
            break;
        case 'Logout':
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({routeName: 'Login'}),
                state
            );
            break;
        case 'Main':
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({routeName: 'Groups'}),
                state
            );
            break;
        case 'Slider':
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({routeName: 'Main'}),
                state
            );
            break;
        case 'Groups':
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({routeName: 'Main'}),
                state
            );
            break;
        default:
            nextState = AppNavigator.router.getStateForAction(action, state);
            break;

    }

    // Simply return the original `state` if `nextState` is null or undefined.
    return nextState || state;
}

const initialAuthState = {isLoggedIn: false};

function auth(state = initialAuthState, action) {
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