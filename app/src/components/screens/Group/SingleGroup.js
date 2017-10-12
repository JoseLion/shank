/**
 * Created by MnMistake on 10/4/2017.
 */
import PropTypes from 'prop-types';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';

import React, {Component} from 'react';
import {Text, View, StatusBar, FlatList, Image, TouchableOpacity, AsyncStorage} from 'react-native';
import {List, ListItem, Header} from "react-native-elements"; // 0.17.0
import Swiper from 'react-native-swiper';
import {LinearGradient} from 'expo';
import BaseModel from '../../../core/BaseModel';

import {Ionicons} from '@expo/vector-icons'; // 5.2.0
import * as Constants from '../../../core/Constans';
import Spinner from 'react-native-loading-spinner-overlay';

const ImageHeader = navigation => (
    <View style={{backgroundColor: '#eee', height: '16%'}}>
        <Image
            style={[MainStyles.imageOpacity, LocalStyles.absoluteFill]}
            source={{uri: 'http://cdn.snappages.com/txd52k/assets/731979_1517216_1464724369.png'}}>
            <Text style={LocalStyles.singleGroupTitle}>{navigation.state.params.data.currentGroup.name}</Text>
            <Text style={LocalStyles.singleGroupTitleBold}>{navigation.state.params.data.tName}</Text>
        </Image>
        <Header onPress={() => console.log('hueheuheueu')} {...navigation}
                style={{backgroundColor: 'transparent', height: '100%'}}
                leftComponent={{icon: 'chevron-left', color: '#fff', onPress: () => navigation.goBack(null)}}
                outerContainerStyles={{width: '50', paddingVertical: '40%'}}
        />
    </View>
);

export default class SingleGroup extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        // this._removeStorage = this._removeStorage.bind(this);
        this.state = {
            tournamentRankings: [],
            currentGroup: {},
            initialState: false,
            stillLoading: false,
            tournamentName: '',
            tournamentEndDate: '',
            tournamentStartDate: '',
            loading: false,
            currentDate: new Date(),
            currentUser: {}
        };
    }

    static navigationOptions = ({navigation}) => ({
        title: 'The Masters',
        headerTintColor: 'white',
        headerTitleStyle: {alignSelf: 'center', color: '#fff'},
        header: (<ImageHeader {...navigation}/>),
    });

    setLoading(loading) {
        this.setState({loading: loading});
    }

    componentDidMount() {

    }

    renderSeparator = () => {
        return (
            <View style={MainStyles.listRenderSeparator}/>
        );
    };

    render() {
        let navigation = this.props.navigation;
        let whistleIcon = require('../../../../resources/singleGroup/ios/Recurso18.png');
        let notAbsoluteDiff = new Date(navigation.state.params.data.tStartingDate) - this.state.currentDate.getTime();
        let diffDays = 0;
        if (notAbsoluteDiff > 0) {
            let daysLeft = Math.abs(notAbsoluteDiff);
            diffDays = Math.ceil(daysLeft / (1000 * 3600 * 24));
        }
        let playerRankings = [{none:true,position:1},{none:true,position:2},{none:true,position:3},{none:true,position:4},{none:true,position:5}];
        let groupLoggedUser = navigation.state.params.data.currentGroup.users.find(user => user.userId === navigation.state.params.currentUser._id);
        if (groupLoggedUser.playerRanking.length > 0) {
            playerRankings = groupLoggedUser.playerRanking
        }
        console.log('ssdsdsdsadasczxczxc')
        console.log(playerRankings)
        return (
            <View style={MainStyles.stretchContainer}>
                <Spinner visible={this.state.loading}/>
                <StatusBar hidden={true}/>
                <View style={LocalStyles.singleGroupBoxes}>
                    <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupPrize]}>
                        PRIZE
                    </Text>
                    <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupPrizeDescription]}>
                        {navigation.state.params.data.currentGroup.prize}
                    </Text>
                </View>
                <View style={LocalStyles.singleGroupBoxes}>
                    <View style={LocalStyles.innerScoreGroupBox}>
                        <View style={MainStyles.centeredObject}>
                            <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupScoreTab]}>
                                230
                            </Text>
                            <Text style={LocalStyles.singleGroupScoreTabDescription}>
                                Score
                            </Text>
                        </View>
                        <View style={MainStyles.centeredObject}>
                            <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupScoreTab]}>
                                3/9
                            </Text>
                            <Text style={LocalStyles.singleGroupScoreTabDescription}>
                                Ranking
                            </Text>
                        </View>
                        <View style={MainStyles.centeredObject}>
                            <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupScoreTab]}>
                                {diffDays}
                            </Text>
                            <Text style={LocalStyles.singleGroupScoreTabDescription}>
                                Days Left
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={LocalStyles.singleGroupBoxes}>
                    <View style={{flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-between'}}>
                        <View style={[MainStyles.centeredObject]}>
                            <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupSliderText]}>
                                Participants
                            </Text>
                            <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupSliderText]}>
                                rankings
                            </Text>
                        </View>
                        <View style={[MainStyles.centeredObject]}>
                            <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupSliderText]}>
                                My players
                            </Text>
                            <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupSliderText]}>
                                rankings
                            </Text>
                        </View>
                        <View style={[MainStyles.centeredObject]}>
                            <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupSliderText]}>
                                Tournament
                            </Text>
                            <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupSliderText]}>
                                rankings
                            </Text>
                        </View>
                    </View>
                </View>
                <Swiper showsHorizontalScrollIndicator={true} showsVerticalScrollIndicator={true} showsButtons={false}
                        showsPagination={false}>
                    <View style={LocalStyles.slideBorderStyle}>
                        <LinearGradient
                            start={{x: 0, y: 1}}
                            end={{x: 1, y: 1}}
                            colors={['#556E3E', '#C0C0C1', '#C0C0C1']}
                            locations={[0, 0.5, 1]}
                            style={LocalStyles.linearGradient}
                        />
                        <List containerStyle={LocalStyles.listContainer}>
                            <FlatList
                                data={navigation.state.params.data.currentGroup.users}
                                renderItem={({item}) => (
                                    <ListItem
                                        key={item.userId}
                                        titleContainerStyle={{marginLeft: '3%'}}
                                        title={`${item.name}`}
                                        titleStyle={[MainStyles.shankGreen, LocalStyles.titleStyle]}
                                        rightTitle={`${'Score: ' + item.score}`}
                                        rightTitleStyle={LocalStyles.participantsScore}
                                        containerStyle={{borderBottomWidth: 0}}
                                        rightIcon={<Image style={{marginHorizontal: '2%'}}
                                                          source={whistleIcon}/>}
                                        leftIcon={<Text
                                            style={[MainStyles.shankGreen, LocalStyles.positionParticipants]}>1</Text>}
                                    />
                                )}
                                keyExtractor={item => item.name}
                                ItemSeparatorComponent={this.renderSeparator}
                            />
                        </List>
                    </View>
                    <View style={[LocalStyles.slideBorderStyle]}>
                        <LinearGradient
                            start={{x: 0, y: 1}}
                            end={{x: 1, y: 1}}
                            colors={['#C0C0C1', '#556E3E', '#C0C0C1']}
                            locations={[0, 0.5, 1]}
                            style={LocalStyles.linearGradient}
                        />
                        <List containerStyle={LocalStyles.listContainer}>
                            <FlatList
                                data={playerRankings}
                                renderItem={({item}) => (
                                    (item.none ?
                                        <ListItem
                                            hideChevron
                                            titleContainerStyle={{marginLeft: '3%',paddingHorizontal:'40%'}}
                                            label={<Text style={{marginRight:'43%', color:'#3c3c3c', alignSelf:'center'}}>EMPTY SLOT</Text>}
                                            leftIcon={<Text style={[MainStyles.shankGreen, LocalStyles.positionParticipants]}>{item.position}</Text>}
                                            containerStyle={{borderBottomWidth: 0}}
                                            onPress={() => navigation.navigate('PlayerSelection', {tPlayers: navigation.state.params.data.players})}
                                            key={1}
                                        />
                                        :
                                        <ListItem
                                            roundAvatar
                                            titleNumberOfLines={2}
                                            titleContainerStyle={{marginLeft: '3%'}}
                                            title={`${item.name}`}
                                            titleStyle={[MainStyles.shankGreen, LocalStyles.titleStyle]}
                                            subtitle={`${'   TR: ' + item.phone + '   SCORE: ' + item.score}`}
                                            avatar={{uri: item.photo.path}}
                                            containerStyle={{borderBottomWidth: 0}}
                                            badge={{
                                                element: <Ionicons
                                                    onPress={() => navigation.navigate('PlayerSelection', {tPlayers: navigation.state.params.data.players})}
                                                    name="md-menu" size={29} color="green"/>
                                            }}
                                            rightIcon={<TouchableOpacity style={{
                                                justifyContent: 'center',
                                                borderWidth: 1,
                                                borderColor: 'black',
                                                marginLeft: '2%',
                                                paddingHorizontal: '3%'
                                            }}><Text>REPLACE</Text></TouchableOpacity>}
                                            onPressRightIcon={() => navigation.dispatch({type: 'Main'})}
                                            key={1}
                                            leftIcon={<Text
                                                style={[MainStyles.shankGreen, LocalStyles.positionParticipants]}>1</Text>}
                                        />)

                                )}
                                keyExtractor={item => item.position}
                               /* keyExtractor={item => item.name}*/
                                ItemSeparatorComponent={this.renderSeparator}
                            />
                        </List>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                            <TouchableOpacity
                                onPress={() => this._handleNewRegistry()}
                                style={[{position: 'absolute', bottom: '4%'}, MainStyles.goldenShankButton]}>
                                <Text style={LocalStyles.buttonText}>2 movements ($1.99)</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={LocalStyles.slideBorderStyle}>
                        <LinearGradient
                            start={{x: 0, y: 1}}
                            end={{x: 1, y: 1}}
                            colors={['#C0C0C1', '#C0C0C1', '#556E3E']}
                            locations={[0, 0.5, 1]}
                            style={LocalStyles.linearGradient}
                        />
                        <List containerStyle={LocalStyles.listContainer}>
                            <FlatList
                                data={[{
                                    name: 'raul',
                                    phone: '12',
                                    score: '150',
                                    photo: {path: 'https://cdn4.iconfinder.com/data/icons/basic-1/64/basic_link-512.png'}
                                }, {
                                    name: 'awww',
                                    phone: '092928383',
                                    score: '150',
                                    photo: {path: 'https://cdn4.iconfinder.com/data/icons/basic-1/64/basic_link-512.png'}
                                }, {
                                    name: 'awww2',
                                    phone: '092928383',
                                    score: '150',
                                    photo: {path: 'https://cdn4.iconfinder.com/data/icons/basic-1/64/basic_link-512.png'}
                                }]}
                                renderItem={({item}) => (
                                    <ListItem
                                        roundAvatar
                                        titleNumberOfLines={2}
                                        titleContainerStyle={{marginLeft: '3%'}}
                                        title={`${item.name}`}
                                        titleStyle={[MainStyles.shankGreen, LocalStyles.titleStyle]}
                                        subtitle={`${'   TR: ' + item.phone + '   SCORE: ' + item.score}`}
                                        avatar={{uri: item.photo.path}}
                                        containerStyle={{borderBottomWidth: 0}}
                                        hideChevron
                                        leftIcon={<Text
                                            style={[MainStyles.shankGreen, LocalStyles.positionParticipants]}>1</Text>}
                                    />
                                )}
                                keyExtractor={item => item.name}
                                ItemSeparatorComponent={this.renderSeparator}
                            />
                        </List>
                    </View>
                </Swiper>
            </View>
        );
    }
}