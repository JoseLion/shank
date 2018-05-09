/**
 * Created by MnMistake on 9/30/2017.
 */
import {AsyncStorage} from 'react-native';
import * as AppConst from 'Core/AppConst';

async function  _isItLoggedAsync(){
    return await AsyncStorage.getItem(AppConst.AUTH_TOKEN)
}

export default _isItLoggedAsync
