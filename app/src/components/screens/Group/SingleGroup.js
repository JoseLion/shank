/**
 * Created by MnMistake on 10/4/2017.
 */
import PropTypes from 'prop-types';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';

import React, {Component} from 'react';
import {Text, View, StatusBar, FlatList, Image, TouchableOpacity} from 'react-native';
import {List, ListItem, Header} from "react-native-elements"; // 0.17.0
import Swiper from 'react-native-swiper';
import { LinearGradient } from 'expo';

import {Ionicons} from '@expo/vector-icons'; // 5.2.0

const ImageHeader = props => (
    <View style={{backgroundColor: '#eee', height: '16%'}}>
        <Image
            style={[MainStyles.imageOpacity, LocalStyles.absoluteFill]}
            source={{uri: 'https://www.bigonsports.com/wp-content/uploads/2016/04/2016-the-Masters-golf-tournament.jpg'}}>
            <Text style={LocalStyles.singleGroupTitle}>AMIGOS DEL CLUB</Text>
            <Text style={LocalStyles.singleGroupTitleBold}>The Masters</Text>
        </Image>
        <Header style={{backgroundColor: 'transparent'}}/>
    </View>
);

export default class SingleGroup extends Component {

    constructor(props) {
        super(props);
        // this._removeStorage = this._removeStorage.bind(this);
        this.state = {};
    }

    static navigationOptions = {
        title: 'The Masters',
        headerTintColor: 'white',
        headerTitleStyle: {alignSelf: 'center', color: '#fff'},
        header: (props => <ImageHeader {...props} />),
    };


    componentDidMount() {
        console.log("this.propsthis.sdada.props")
        console.log(this.props)
    }

    renderSeparator = () => {
        return (
            <View style={MainStyles.listRenderSeparator}/>
        );
    };

    render() {
        return (
            <View style={MainStyles.stretchContainer}>
                <StatusBar hidden={true}/>
                <View style={LocalStyles.singleGroupBoxes}>
                    <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupPrize]}>
                        PRIZE
                    </Text>
                    <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupPrizeDescription]}>
                        A Johnny Walker Black Label Whisky
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
                                2
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
                            <Text style={[MainStyles.shankGreen,  LocalStyles.singleGroupSliderText]}>
                                Participants
                            </Text>
                            <Text style={[MainStyles.shankGreen,  LocalStyles.singleGroupSliderText]}>
                                rankings
                            </Text>
                        </View>
                        <View style={[MainStyles.centeredObject]}>
                            <Text style={[MainStyles.shankGreen,  LocalStyles.singleGroupSliderText]}>
                                My players
                            </Text>
                            <Text style={[MainStyles.shankGreen,  LocalStyles.singleGroupSliderText]}>
                                rankings
                            </Text>
                        </View>
                        <View style={[MainStyles.centeredObject]}>
                            <Text style={[MainStyles.shankGreen,  LocalStyles.singleGroupSliderText]}>
                                Tournament
                            </Text>
                            <Text style={[MainStyles.shankGreen,  LocalStyles.singleGroupSliderText]}>
                                rankings
                            </Text>
                        </View>
                    </View>
                </View>
              {/*  <View style={{ flex: 1 }}>
                    <View style={{ backgroundColor: 'orange', flex: 1 }} />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.8)', 'transparent']}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            height: 300,
                        }}
                    />
                </View>*/}
                <Swiper>
                    <View style={LocalStyles.slideBorderStyle}>
                        <LinearGradient
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            colors={['#556E3E', '#C0C0C1', '#C0C0C1']}
                            locations={[0, 0.5, 1]}
                            style={LocalStyles.linearGradient}
                        />
                        <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
                            <FlatList
                                data={[{
                                    name: 'raulss',
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
                                        titleContainerStyle={{marginLeft: '3%'}}
                                        title={`${item.name}`}
                                        rightTitle={`${'Score: ' + item.score}`}
                                        containerStyle={{borderBottomWidth: 0}}
                                        hideChevron
                                        rightIcon={<Image style={{width: 50, height: 50}}
                                                          source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}/>}
                                        leftIcon={<Text
                                            style={{color: 'black', marginTop: '3%', marginRight: '2%'}}>1</Text>}
                                    />
                                )}
                                keyExtractor={item => item.name}
                                ItemSeparatorComponent={this.renderSeparator}
                            />
                        </List>
                    </View>
                    <View style={LocalStyles.slideBorderStyle}>
                        <LinearGradient
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            colors={['#C0C0C1', '#556E3E', '#C0C0C1']}
                            locations={[0, 0.5, 1]}
                            style={LocalStyles.linearGradient}
                        />
                        <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
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
                                        subtitle={`${'   TR: ' + item.phone + '   SCORE: ' + item.score}`}
                                        avatar={{uri: item.photo.path}}
                                        containerStyle={{borderBottomWidth: 0}}
                                        badge={{element: <Ionicons name="md-menu" size={29} color="green"/>}}
                                        rightIcon={<TouchableOpacity style={{
                                            justifyContent: 'center',
                                            borderWidth: 1,
                                            borderColor: 'black',
                                            marginLeft: '2%',
                                            paddingHorizontal: '3%'
                                        }}><Text>REPLACE</Text></TouchableOpacity>}
                                        key={1}
                                        leftIcon={<Text
                                            style={{color: 'black', marginTop: '3%', marginRight: '2%'}}>1</Text>}
                                    />
                                )}
                                keyExtractor={item => item.name}
                                ItemSeparatorComponent={this.renderSeparator}
                            />
                        </List>
                    </View>
                    <View style={LocalStyles.slideBorderStyle}>
                        <LinearGradient
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            colors={['#C0C0C1', '#C0C0C1', '#556E3E']}
                            locations={[0, 0.5, 1]}
                            style={LocalStyles.linearGradient}
                        />
                        <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
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
                                        subtitle={`  'TR: ' ${item.phone + '           SCORE: ' + item.score}`}
                                        avatar={{uri: item.photo.path}}
                                        containerStyle={{borderBottomWidth: 0}}
                                        hideChevron
                                        leftIcon={<Text
                                            style={{color: 'black', marginTop: '3%', marginRight: '2%'}}>1</Text>}
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