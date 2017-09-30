/**
 * Created by MnMistake on 9/30/2017.
 */
import {AsyncStorage} from 'react-native';
import * as Constants from '../core/Constans';

async function  _isItLoggedAsync(){
    return await AsyncStorage.getItem(Constants.AUTH_TOKEN)
}

export default _isItLoggedAsync
