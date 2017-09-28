import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View, Image, FlatList, ActivityIndicator} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';
import { List, ListItem, SearchBar } from "react-native-elements";

let Icon = require('react-native-vector-icons/Ionicons');

import LoginStatusMessage from './LoginStatusMessage';
import AuthButton from './AuthButton';


export default class MainScreen extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            page: 1,
            seed: 1,
            error: null,
            refreshing: false
        };
    }

    static handleSave() {

    }

    static navigationOptions = ({navigation}) => ({
        title: 'BETTING GROUPS',
        headerTitleStyle: {alignSelf: 'center'},
        headerStyle: {
            backgroundColor: MainStyles.shankGreen
        },
        headerLeft: null,
        headerRight: <Button title='+' onPress={() => navigation.dispatch({type: 'Groups'})}/>,
        showIcon: true,
        tabBarIcon: () => {
            return (
                <Image
                    source={require('../../../../resources/mainMenu/menuTaskBar/ios/Recurso9.png')}
                    style={MainStyles.iconXS}
                />
            )
        },
    });

    componentDidMount() {
        this.makeRemoteRequest();
    }

    makeRemoteRequest = () => {
        const {page, seed} = this.state;
        const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
        this.setState({loading: true});

        fetch(url)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    data: page === 1 ? res.results : [...this.state.data, ...res.results],
                    error: res.error || null,
                    loading: false,
                    refreshing: false
                });
            })
            .catch(error => {
                this.setState({error, loading: false});
            });
    };

    handleRefresh = () => {
        this.setState(
            {
                page: 1,
                seed: this.state.seed + 1,
                refreshing: true
            },
            () => {
                this.makeRemoteRequest();
            }
        );
    };

    handleLoadMore = () => {
        this.setState(
            {
                page: this.state.page + 1
            },
            () => {
                this.makeRemoteRequest();
            }
        );
    };

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "86%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "14%"
                }}
            />
        );
    };

    renderHeader = () => {
        return <SearchBar placeholder="Type Here..." lightTheme round/>;
    };

    renderFooter = () => {
        if (!this.state.loading) return null;

        return (
            <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE"
                }}
            >
                <ActivityIndicator animating size="large"/>
            </View>
        );
    };


    render() {
        let navigation = this.props.navigation;
        return (
            <View>
                {/* <Text style={MainStyles.groupsNone}>
                    Tap on the "+"  {"\n"} or join a betting group"
                </Text>*/}
                <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
                    <FlatList
                        data={this.state.data}
                        renderItem={({item}) => (
                            <ListItem
                                roundAvatar
                                title={`${item.name.first} ${item.name.last}`}
                                subtitle={item.email}
                                avatar={{uri: item.picture.thumbnail}}
                                containerStyle={{borderBottomWidth: 0}}
                            />
                        )}
                        keyExtractor={item => item.email}
                        ItemSeparatorComponent={this.renderSeparator}
                        ListHeaderComponent={this.renderHeader}
                        ListFooterComponent={this.renderFooter}
                        onRefresh={this.handleRefresh}
                        refreshing={this.state.refreshing}
                        onEndReached={this.handleLoadMore}
                        onEndReachedThreshold={50}
                    />
                </List>
            </View>
        );
    }
}