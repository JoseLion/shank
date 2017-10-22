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

import {FontAwesome, Entypo} from '@expo/vector-icons'; // 5.2.0
import * as Constants from '../../../core/Constans';
import Spinner from 'react-native-loading-spinner-overlay';
import SortableListView from 'react-native-sortable-listview'

const ImageHeader = navigation => (
    <View style={{backgroundColor: '#eee', height: '16%'}}>
        <Image
            style={[MainStyles.imageOpacity, LocalStyles.absoluteFill]}
            source={{uri: 'http://cdn.snappages.com/txd52k/assets/731979_1517216_1464724369.png'}}>
            <Text style={LocalStyles.singleGroupTitle}>{navigation.state.params.data.currentGroup.name}</Text>
            <Text style={LocalStyles.singleGroupTitleBold}>{navigation.state.params.data.tName}</Text>
        </Image>
        <Header onPress={() => console.log('hueheuhSSeuSSeu')} {...navigation}
                style={{backgroundColor: 'transparent', height: '100%'}}
                leftComponent={<Entypo
                    onPress={() => {
                        navigation.goBack(null)
                    }}
                    style={{backgroundColor: 'transparent', marginBottom: '100%'}}
                    name="chevron-left" size={33} color="white"/>}
        />
    </View>
    /*leftComponent={{icon: 'chevron-left', color: '#fff', onPress: () => navigation.goBack(null)}}*/
);

class RowComponent extends React.Component {

    constructor(props) {
        super(props);
        this.onNewPlayer = this.onNewPlayer.bind(this);
    }

    onNewPlayer = newPlayer => {
        let obj = {}
        newPlayer.onNewPlayer.position = this.state.playerSelectionPosition
        obj[this.state.playerSelectionPosition - 1] = newPlayer.onNewPlayer
        let oldReportCopy = Object.assign(this.state.playerRankings, obj)
        console.log("newPlayernewPlayer")
        console.log(newPlayer)
        this.setState({newPlayer, playerRankings: oldReportCopy})
    };

    render() {
        if (this.props.data.name) {
            return (
                <ListItem
                    {...this.props.sortHandlers}
                    roundAvatar
                    titleContainerStyle={{marginLeft: '7%'}}
                    subtitleContainerStyle={{marginLeft: '7%'}}
                    title={`${this.props.data.name} ${this.props.data.lastName}`}
                    titleStyle={[MainStyles.shankGreen, LocalStyles.titleStyle]}
                    subtitle={`${'   TR: ' + '15' + '   SCORE: ' + this.props.data.position}`}
                    avatar={{uri: this.props.data.urlPhoto}}
                    containerStyle={{borderBottomWidth: 0}}
                    hideChevron
                    badge={{
                        element: <FontAwesome
                            onPress={() => {
                                this.setState({playerSelectionPosition: this.props.data.position});
                                this.props.navigation.navigate('PlayerSelection', {
                                    tPlayers: this.props.playerRankings,
                                    userGroupId: this.props.groupLoggedUser._id,
                                    groupId: this.props.navigation.state.params.data.currentGroup._id,
                                    currentPosition: this.props.data.position,
                                    onNewPlayer: this.onNewPlayer
                                })
                            }}
                            name="pencil" size={29} color="green"/>
                    }}
                 /*   rightIcon={<TouchableOpacity style={{
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: 'black',
                        marginLeft: '2%',
                        paddingHorizontal: '3%'
                    }} onPress={() => {
                        this.setState({playerSelectionPosition: this.props.data.position});
                        this.props.navigation.navigate('PlayerSelection', {
                            tPlayers: this.props.playerRankings,
                            userGroupId: this.props.groupLoggedUser._id,
                            groupId: this.props.navigation.state.params.data.currentGroup._id,
                            currentPosition: this.props.data.position,
                            onNewPlayer: this.onNewPlayer
                        })
                    }}><Text>REPLACE</Text></TouchableOpacity>}*/
                    key={this.props.data.position}
                    leftIcon={<Text
                        style={[MainStyles.shankGreen, LocalStyles.positionParticipants]}>{this.props.data.position}</Text>}
                />
            )
        } else {
            return (
                <ListItem
                    {...this.props.sortHandlers}
                    hideChevron
                    titleContainerStyle={{marginLeft: '3%', paddingHorizontal: '40%'}}
                    label={<Text style={{
                        marginRight: '43%',
                        color: '#3c3c3c',
                        alignSelf: 'center'
                    }}>EMPTY SLOT</Text>}
                    leftIcon={<Text
                        style={[MainStyles.shankGreen, LocalStyles.positionParticipants]}>{this.props.data.position}</Text>}
                    containerStyle={{borderBottomWidth: 0}}
                    onPress={() => {
                        this.setState({playerSelectionPosition: this.props.data.position});
                        this.props.navigation.navigate('PlayerSelection', {
                            tPlayers: this.props.playerRankings,
                            userGroupId: this.props.groupLoggedUser._id,
                            groupId: this.props.navigation.state.params.data.currentGroup._id,
                            currentPosition: this.props.data.position,
                            onNewPlayer: this.onNewPlayer
                        })
                    }}
                    key={this.props.data.position}
                />
            )
        }
    }
}


export default class SingleGroup extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.onClickScroll = this.onClickScroll.bind(this);
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
            currentUser: {},
            sliderPosition: 0,
            newPlayer: {},
            playerRankings: [{none: true, position: 1}, {none: true, position: 2}, {
                none: true,
                position: 3
            }, {none: true, position: 4}, {none: true, position: 5}],
            playerSelectionPosition: 0
        };
        this.lastPosition = 1;
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

    setSlidingState(index) {
        this.setState({sliderPosition: index});
    }

    onClickScroll(index) {
        return;
        let currentIndex = this.lastPosition;
        console.log("before currentIndex")
        console.log(currentIndex)
        if (currentIndex !== index) {
            switch (index) {
                case 1:
                    if (currentIndex == 2) {
                        this.refs.swiper.scrollBy(2, true);
                    }
                    if (currentIndex == 3) {
                        this.refs.swiper.scrollBy(1, true);
                    }
                    break;
                case 2:
                    if (currentIndex == 1) {
                        this.refs.swiper.scrollBy(1, true);
                    }
                    if (currentIndex == 3) {
                        this.refs.swiper.scrollBy(2, true);
                    }
                    break;
                case 3:
                    if (currentIndex == 1) {
                        this.refs.swiper.scrollBy(2, true);
                    }
                    if (currentIndex == 2) {
                        this.refs.swiper.scrollBy(1, true);
                    }
                    break;
            }
            this.lastPosition = index;
            console.log("after currentIndex")
            console.log(this.lastPosition);
        }
    }

    componentDidMount() {

    }

    renderSeparator = () => {
        return (
            <View style={MainStyles.listRenderSeparator}/>
        );
    };

    addPlayer = () => {
        return (
            <View style={MainStyles.listRenderSeparator}/>
        );
    };

    updatePlayerRankings = async (groupId, userGroupId, playerRankings) => {
        this.setLoading(true);
        let data = {
            userGroupId: userGroupId,
            playerRankings: playerRankings,
            groupId: groupId,
        }
        console.log("datadatadataupdatePlayerRanksssingsupdatePlayerRankingsupdatePlayerRankings")
        console.log(data)
        try {
            const currentGroup = await BaseModel.create('updateUserPlayerRankingByGroup', data)
        } catch (e) {
            console.log('error in initialRequest: SingleGroup.js')
            console.log(e)
        }
    };

    render() {
        console.log('got in render')
        console.log('playerRankingsplayerRankings')
        console.log(this.state.playerRankings)
        let navigation = this.props.navigation;
        let whistleIcon = require('../../../../resources/singleGroup/ios/Recurso18.png');
        let notAbsoluteDiff = new Date(navigation.state.params.data.tStartingDate) - this.state.currentDate.getTime();
        let diffDays = 0;
        if (notAbsoluteDiff > 0) {
            let daysLeft = Math.abs(notAbsoluteDiff);
            diffDays = Math.ceil(daysLeft / (1000 * 3600 * 24));
        }
        let playerRankings = this.state.playerRankings
        let groupLoggedUser = navigation.state.params.data.currentGroup.users.find(user => user.userId === navigation.state.params.currentUser._id);
        if (groupLoggedUser.playerRanking.length > 0) {
            playerRankings = groupLoggedUser.playerRanking
        }
        let orderedPlayerRankings = playerRankings.reduce(function (obj, item) {
            obj[item.position] = item;
            return obj;
        }, {});
        console.log("orderedPlayerRankingsorderedPlayerRankissngs")
        console.log(orderedPlayerRankings)
        let order = Object.keys(orderedPlayerRankings) //Array of keys positions
        console.log("orderorderorderorder")
        console.log(order)
        /*console.log('ssdsdsdsadasczxczxc')
          console.log(playerRankings)*/
        console.log('playerRankingsplayerRankingsplayerRankingsplayerRasssnkingsplayerRankings')
        console.log(playerRankings)
        return (
            <View style={MainStyles.stretchContainer}>
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
                                {groupLoggedUser.score}
                            </Text>
                            <Text style={LocalStyles.singleGroupScoreTabDescription}>
                                Score
                            </Text>
                        </View>
                        <View style={MainStyles.centeredObject}>
                            <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupScoreTab]}>
                                {groupLoggedUser.currentRanking + '/' + navigation.state.params.data.currentGroup.users.length}
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
                        <TouchableOpacity style={[MainStyles.centeredObject]}
                                          onPress={() => {
                                              this.onClickScroll(1)
                                          }}>
                            <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupSliderText]}>
                                Participants
                            </Text>
                            <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupSliderText]}>
                                rankings
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[MainStyles.centeredObject]}
                                          onPress={() => {
                                              this.onClickScroll(2)
                                          }}>
                            <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupSliderText]}>
                                My players
                            </Text>
                            <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupSliderText]}>
                                rankings
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[MainStyles.centeredObject]}
                                          onPress={() => {
                                              this.onClickScroll(3)
                                          }}>
                            <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupSliderText]}>
                                Tournament
                            </Text>
                            <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupSliderText]}>
                                rankings
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Swiper ref='swiper' showsHorizontalScrollIndicator={true} showsVerticalScrollIndicator={true}
                        showsButtons={false}
                        showsPagination={false} loop={false}>
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
                                        titleContainerStyle={{marginLeft: '6%'}}
                                        title={`${item.name}`}
                                        hideChevron
                                        titleStyle={[MainStyles.shankGreen, LocalStyles.titleStyle]}
                                        rightTitle={`${'Score: ' + item.score}`}
                                        rightTitleStyle={LocalStyles.participantsScore}
                                        containerStyle={{borderBottomWidth: 0}}
                                     /*   rightIcon={<Image style={{marginHorizontal: '2%'}}
                                                          source={whistleIcon}/>}*/
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
                        <View style={LocalStyles.GroupList}>
                            <SortableListView
                                style={[LocalStyles.listContainer, {flex: 1}]}
                                data={orderedPlayerRankings}
                                order={order}
                                onRowMoved={e => {

                                    /*                                    console.log("SortableListViewSortableListView RANKS")
                                                                        console.log(orderedPlayerRankings)
                                                                        this.updatePlayerRankings(navigation.state.params.data.currentGroup._id,groupLoggedUser._id,playerRankings).then(() => {
                                                                            console.log("Updated Player Ranking on swap")
                                                                        })*/
                                    order.splice(e.to, 0, order.splice(e.from, 1)[0])
                                }}
                                renderRow={row => <RowComponent data={row} navigation={this.props.navigation}
                                                                playerRankings={playerRankings}
                                                                groupLoggedUser={groupLoggedUser}/>}/>
                            {/*<List containerStyle={LocalStyles.listContainer}>*/}
                        </View>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity
                                onPress={() => this._handleNewRegistry()}
                                style={[{position: 'absolute', bottom: '4%'}, MainStyles.goldenShankButtonPayment]}>
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
                                    name: 'Si Woo Kim',
                                    tr: '1',
                                    score: '150',
                                    position: 1,
                                    photo: {path: 'http://www.golfchannel.com/sites/golfchannel.prod.acquia-sites.com/files/styles/blog_header_image_304x176/public/9/C/C/%7B9CC84FBA-BEE3-482B-9EA7-16CB3EF643AF%7Dkim_si_woo_q-school12_final_day_610.jpg?itok=DCgt_CPy'}
                                }, {
                                    name: 'William Wheeler',
                                    tr: '2',
                                    score: '260',
                                    position: 2,
                                    photo: {path: 'http://media.golfdigest.com/photos/592442b5c45e221ebef6e668/master/w_768/satoshi-kodaira-sony-open-2017.jpg'}
                                }, {
                                    name: 'Issac Hines',
                                    tr: '3',
                                    score: '510',
                                    position: 3,
                                    photo: {path: 'https://static1.squarespace.com/static/58abbdb120099e0b12538e67/t/5923a3a1c534a5397b32c34b/1495507887454/Richie3.jpg?format=300w'}
                                }, {
                                    name: 'Jared Williams',
                                    tr: '4',
                                    score: '185',
                                    position: 4,
                                    photo: {path: 'http://s3.amazonaws.com/golfcanada/app/uploads/golfcanada/production/2017/06/09093500/17.06.09-Ryan-Williams-370x213.jpg'}
                                }, {
                                    name: 'Keegan Taylor',
                                    tr: '5',
                                    score: '225',
                                    position: 5,
                                    photo: {path: 'http://media.gettyimages.com/photos/may-2000-kevin-keegan-the-england-manager-plays-out-of-a-bunker-on-picture-id1030959'}
                                }, {
                                    name: 'Boo Weekly',
                                    tr: '6',
                                    score: '350',
                                    position: 6,
                                    photo: {path: 'https://progolfnow.com/wp-content/blogs.dir/120/files/2014/12/boo-weekley-golf-u.s.-open-first-round.jpg'}
                                }, {
                                    name: 'Bernard Ford',
                                    tr: '7',
                                    score: '100',
                                    position: 7,
                                    photo: {path: 'http://ichef.bbci.co.uk/onesport/cps/480/mcs/media/images/71780000/jpg/_71780044_gallacherpa.jpg'}
                                }, {
                                    name: 'Shawn Harper',
                                    tr: '8',
                                    score: '110',
                                    position: 8,
                                    photo: {path: 'http://media.jrn.com/images/photo-0627bc6sacc_6137489_ver1.0_640_480.jpg'}
                                }]}
                                renderItem={({item}) => (
                                    <ListItem
                                        roundAvatar
                                        titleNumberOfLines={2}
                                        titleContainerStyle={{marginLeft: '3%'}}
                                        title={`${item.name}`}
                                        titleStyle={[MainStyles.shankGreen, LocalStyles.titleStyle]}
                                        subtitle={`${'   TR: ' + item.tr + '   SCORE: ' + item.score}`}
                                        avatar={{uri: item.photo.path}}
                                        containerStyle={{borderBottomWidth: 0}}
                                        hideChevron
                                        leftIcon={<Text
                                            style={[MainStyles.shankGreen, LocalStyles.positionParticipants]}>{item.position}</Text>}
                                    />
                                )}
                                keyExtractor={item => item.name}
                                ItemSeparatorComponent={this.renderSeparator}
                            />
                        </List>
                    </View>
                </Swiper>
            </View>);
    }
}