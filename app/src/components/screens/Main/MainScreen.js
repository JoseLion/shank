// React components:
import React from 'react';
import { AsyncStorage, FlatList, Image, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { List } from 'react-native-elements';
import Swipeable from 'react-native-swipeable';

// Shank components:
import { BarMessages, BaseComponent, BaseModel, Constants, DropdownAlert, Entypo, FontAwesome, GolfApiModel, MainStyles, Spinner } from '../BaseComponent';
import LocalStyles from './styles/local';

export default class MainScreen extends BaseComponent {

    static navigationOptions = ({navigation}) => ({
        title: 'GROUPS',
        showIcon: true,
        headerTintColor: Constants.TERTIARY_COLOR,
        headerTitleStyle: {alignSelf: 'center', color: Constants.TERTIARY_COLOR},
        headerStyle: { backgroundColor: Constants.PRIMARY_COLOR },
        headerLeft: (
            <TouchableHighlight style={[MainStyles.headerIconButtonContainer]} onPress={() => navigation.state.params.tapCenterButton('AddGroup')}>
                <Entypo name='plus' style={[MainStyles.headerIconButton]} />
            </TouchableHighlight>
        ),
        headerRight: (
            <TouchableHighlight style={[MainStyles.headerIconButtonContainer]} onPress={() => navigation.state.params.tapCenterButton('Settings')}>
                <Entypo name='user' style={[MainStyles.headerIconButton]} />
            </TouchableHighlight>
        ),
        tabBarIcon: ({tintColor}) => (
            <Entypo name='users' style={[MainStyles.tabBarIcon, {color: tintColor}]} />
        ),
        tabBarLabel: 'Groups'
    });

    constructor(props) {
        super(props);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.tapCenterButton = this.tapCenterButton.bind(this);
        this.state = {
            loading: false,
            data: [],
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
            auth: null
        };
    }
    componentDidMount() {
        this.props.navigation.setParams({
            tapCenterButton: this.tapCenterButton
        });
        AsyncStorage.getItem(Constants.AUTH_TOKEN).then(authToken => {
            this.setState({auth: authToken});
            if (authToken) {
                AsyncStorage.getItem(Constants.USER_PROFILE).then(user => {
                    this.setState({currentUser: JSON.parse(user)})
                    this.onListGroupAsync();
                });
            }
        });
    }

    setLoading(loading) { this.setState({loading: loading}); }
    tapCenterButton(onLogin) {
        if(this.state.auth) {
            super.navigateToScreen(onLogin);
        } else {
            super.navigateToScreen('Login');
        }
    }
    handleRefresh = () => {
        this.setState(
            { page: 1, seed: this.state.seed + 1, refreshing: true },
            () => { this.onListGroupAsync(); }
        );
    };

    // Async methods:
    onListGroupAsync = async(data) => {
        const {page, currentUser} = this.state;
        this.setState({refreshing: true, loading: true});
        await BaseModel.get(`groups/myList/${currentUser._id}`).then((groups) => {
            this.setState({
                data: page === 1 ? groups : [...this.state.data, ...groups],
                loading: false,
                refreshing: false
            });
        }).catch((error) => {
            this.setLoading(false);
            if (error === 401) {
                try {
                    AsyncStorage.removeItem(Constants.AUTH_TOKEN);
                } catch (error) {
                    console.log('ERROR ON REMOVING TOKEN: ', error);
                }
            } else {
                console.log('ERROR: ', error);
                BarMessages.showError(error, this.validationMessage);
            }
        });
    };

    render() {
        let addPhoto = require('../../../../resources/add_edit_photo.png');
        if (this.state.auth && this.state.data.length > 0) {
            return (
                <View style={[MainStyles.container]}>
                    <Spinner visible={this.state.loading} animation='fade'/>
                    <View style={[MainStyles.viewFlexItems]}>
                        <List containerStyle={[MainStyles.noBorder, {height:'100%'}]}>
                            <FlatList data={this.state.data} renderItem={({item}) => (
                                    <Swipeable rightButtons={[
                                        (
                                            <TouchableHighlight style={[MainStyles.button, MainStyles.error, LocalStyles.trashButton]}>
                                                <FontAwesome name='trash-o' style={MainStyles.headerIconButton} />
                                            </TouchableHighlight>
                                        )
                                    ]}>
                                        <TouchableHighlight style={[MainStyles.listItem]} underlayColor={Constants.HIGHLIGHT_COLOR}
                                            onPress={() => super.navigateToScreen('SingleGroup', item)}>
                                            <View style={[MainStyles.viewFlexItemsR]}>
                                                <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart]}>
                                                    { item.photo != null
                                                        ?
                                                            <Image style={{height:50,width:50}} source={{uri: item.photo.path}}></Image>
                                                        :
                                                            <Image style={{height:50,width:50}} source={addPhoto}></Image>
                                                    }
                                                </View>
                                                <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart, {flex:4}]}>
                                                    <Text numberOfLines={1} style={[LocalStyles.titleText]}>{item.name}</Text>
                                                    <Text numberOfLines={1} style={[MainStyles.shankGreen, LocalStyles.subtitleText]}>{item.tournamentName}</Text>
                                                    <Text numberOfLines={1} style={[MainStyles.shankGreen, LocalStyles.subtitleText]}>
                                                        {`Score: ${item.myScore}     Rank: ${item.myRanking}/${item.users.length}`}
                                                    </Text>
                                                </View>
                                                <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsEnd]}>
                                                    <FontAwesome name='chevron-right' size={29} color={Constants.TERTIARY_COLOR_ALT}/>
                                                </View>
                                            </View>
                                        </TouchableHighlight>
                                    </Swipeable>
                                )}
                                keyExtractor={item => item._id}
                                onRefresh={this.handleRefresh}
                                refreshing={this.state.refreshing}
                                onEndReachedThreshold={1} />
                        </List>
                    </View>
                    <DropdownAlert ref={ref => this.validationMessage = ref} />
                </View>
            );
        } else {
            return (
                <View style={[MainStyles.mainContainer, LocalStyles.noneButtonView]}>
                    <Spinner visible={this.state.loading} animation='fade' />
                    <TouchableOpacity onPress={() => {this.tapCenterButton('AddGroup')}}>
                        <Text style={[MainStyles.withoutGroups]}>
                            Tap the {'"+"'} button to create{'\n'}
                            or join a group
                        </Text>
                    </TouchableOpacity>
                    <DropdownAlert ref={ref => this.validationMessage = ref} />
                </View>
            );
        }
    }
}
