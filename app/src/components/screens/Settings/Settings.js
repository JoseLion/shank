// React components:
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, View, TouchableHighlight, AsyncStorage } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import SortableListView from 'react-native-sortable-listview'

// Third party components:
import { FontAwesome } from '@expo/vector-icons';

// Shank components:
import NoAuthModel from '../../../core/NoAuthModel';
import MainStyles from '../../../styles/MainStyles';
import LocalStyles from './styles/local';
import * as Constants from '../../../core/Constants';
import * as BarMessages from '../../../core/BarMessages';

const DismissKeyboardView = Constants.DismissKeyboardHOC(View);

class RowComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableHighlight
                onPress={this.props.data.action}
                style={{
                    flex: 1,
                    padding: 20,
                    backgroundColor: '#ffffff',
                    borderBottomWidth: 0,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <Text>{this.props.data.name}</Text>
                    <FontAwesome name="chevron-right" size={29} />
                </View>
            </TouchableHighlight >
        );
    }
}

export default class Settings extends Component {

    static propTypes = { navigation: PropTypes.object.isRequired };
    static navigationOptions = ({navigation}) => ({
        title: 'SETTINGS',
        headerTintColor: Constants.TERTIARY_COLOR,
        headerTitleStyle: {alignSelf: 'center', color: Constants.TERTIARY_COLOR},
        headerStyle: { backgroundColor: Constants.PRIMARY_COLOR },
        headerLeft: (
            <TouchableHighlight onPress={() => navigation.dispatch({type: 'Main'})}>
                <FontAwesome name='chevron-left' style={MainStyles.headerIconButton} />
            </TouchableHighlight>
        ),
        headerRight: (<View></View>)
    });

    constructor(props) {
        super(props);
        let self = this;
        console.log(':::IT\'S ON SETTINGS:::');
        this._removeStorage = this._removeStorage.bind(this);
        this.state = {
            loading: false,
            data: [
                {
                    id: 0,
                    name: 'Edit Profile',
                    action: function() {
                        self.setLoading(true);
                        AsyncStorage.getItem(Constants.USER_PROFILE).then(user => {
                            self.props.navigation.navigate('Profile', {currentUser: JSON.parse(user)})
                            self.setLoading(false);
                        });
                    }
                },
                {
                    id: 1,
                    name: 'Privacy Policy',
                    action: function() {
                    }
                },
                {
                    id: 2,
                    name: 'Terms of Service',
                    action: function() {
                    }
                },
                {
                    id: 3,
                    name: 'Rules',
                    action: function() {
                    }
                },
            ]
        };
    }

    setLoading(loading) { this.setState({loading: loading}); }
    doLogOut() { this._removeStorage(); }

    async _removeStorage() {
        try {
            let token = await AsyncStorage.removeItem(Constants.AUTH_TOKEN);
            this.props.navigation.dispatch({type: 'Main'})
        } catch (error) {
            console.log('error on :Token removed from disk.');
        }
    }

    render() {
        let navigation = this.props.navigation;
        let completeData = this.state.data;
        return (
            <View style={{backgroundColor: '#FFFFFF', flex:1, width:'100%'}} >
                <Spinner visible={this.state.loading} animation="fade"/>
                <SortableListView
                    style={{flex: 1, marginBottom: '5%'}}
                    data={this.state.data}
                    renderRow= { (row) => <RowComponent data={row} navigation={navigation}/> }/>

                <TouchableOpacity
                    onPress={() => this.doLogOut()}
                    style={[{ width: '80%' }, MainStyles.button, MainStyles.error]}>
                    <Text style={MainStyles.buttonText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        )
    }

}