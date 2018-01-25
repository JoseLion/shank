/**
 * Created by MnMistake on 9/30/2017.
 */
import {AsyncStorage} from 'react-native';
import * as ShankConstants from '../core/ShankConstants';

async function  _isItLoggedAsync(){
    return await AsyncStorage.getItem(ShankConstants.AUTH_TOKEN)
}

export default _isItLoggedAsync
