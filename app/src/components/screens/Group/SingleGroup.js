/**
 * Created by MnMistake on 10/4/2017.
 */
import PropTypes from 'prop-types';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';

import React, { Component } from 'react';
import { Text, View,StatusBar, FlatList, Image, TouchableOpacity} from 'react-native';
import {List, ListItem} from "react-native-elements"; // 0.17.0

import { Ionicons } from '@expo/vector-icons'; // 5.2.0


export default class SingleGroup extends Component {

    constructor(props) {
        super(props);
       // this._removeStorage = this._removeStorage.bind(this);
        this.state = {};
    }

    componentDidMount() {
      console.log("this.propsthis.propsthis.props")
      console.log(this.props)
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "76%",
                    backgroundColor: "#CED0CE",
                    marginBottom: "5%",
                    marginHorizontal: '10%'
                }}
            />
        );
    };

    render() {
        return (
            // Try setting `alignItems` to 'flex-start'
            // Try setting `justifyContent` to `flex-end`.
            // Try setting `flexDirection` to `row`.
            <View style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'stretch',
            }}>
                <StatusBar hidden={true} />
                <View style={{height: 50, backgroundColor: 'white',borderBottomColor: '#2F1C1C',borderBottomWidth: 2, paddingHorizontal:'8%'}} >
                    <Text style={{color: 'red'}}>
                        title{'\n'}
                        prize
                    </Text>
                </View>
                <View style={{height: 50, backgroundColor: 'white', borderBottomColor: '#2F1C1C',borderBottomWidth: 2, paddingHorizontal:'9%'}}>
                    <View style={{flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-between'}}>
                        <Text style={{color: 'red'}}>
                            title{'\n'}
                            prize
                        </Text>
                        <Text style={{color: 'red'}}>
                            title{'\n'}
                            prize
                        </Text>
                        <Text style={{color: 'red'}}>
                            title{'\n'}
                            prize
                        </Text>
                    </View>
                </View>

                <View style={{height: 50, backgroundColor: 'white', borderBottomColor: '#2F1C1C',borderBottomWidth: 2, paddingHorizontal:'8%'}}>
                    <View style={{flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-between'}}>
                        <Text style={{color: 'black'}}>
                            ma players{'\n'}
                            rankings
                        </Text>
                        <Text style={{color: 'black'}}>
                            ma player{'\n'}
                            rankings
                        </Text>
                        <Text style={{color: 'black'}}>
                            ma players{'\n'}
                            rankings
                        </Text>
                    </View>
                </View>

                <View style={{backgroundColor: 'white', paddingHorizontal:'8%'}}>
                    <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
                        <FlatList
                            data={[{name:'raul',phone:'12',score:'150',photo:{path:'https://cdn4.iconfinder.com/data/icons/basic-1/64/basic_link-512.png'}},{name:'raul',phone:'092928383',score:'150',photo:{path:'https://cdn4.iconfinder.com/data/icons/basic-1/64/basic_link-512.png'}},{name:'raul',phone:'092928383',score:'150',photo:{path:'https://cdn4.iconfinder.com/data/icons/basic-1/64/basic_link-512.png'}}]}
                            renderItem={({item}) => (
                                <ListItem
                                    titleContainerStyle={{marginLeft:'3%'}}
                                    title={`${item.name}`}
                                    rightTitle={`${'Score: ' + item.score}`}
                                    containerStyle={{borderBottomWidth: 0}}
                                    hideChevron
                                    rightIcon={<Image style={{width: 50, height: 50}} source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}} />}
                                    leftIcon={<Text style={{color: 'black', marginTop:'3%',marginRight:'2%'}}>1</Text>}
                                />
                            )}
                            keyExtractor={item => item.name}
                            ItemSeparatorComponent={this.renderSeparator}
                        />
                    </List>
                </View>
                <View style={{backgroundColor: 'white', paddingHorizontal:'8%'}}>
                    <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
                        <FlatList
                            data={[{name:'raul',phone:'12',score:'150',photo:{path:'https://cdn4.iconfinder.com/data/icons/basic-1/64/basic_link-512.png'}},{name:'raul',phone:'092928383',score:'150',photo:{path:'https://cdn4.iconfinder.com/data/icons/basic-1/64/basic_link-512.png'}},{name:'raul',phone:'092928383',score:'150',photo:{path:'https://cdn4.iconfinder.com/data/icons/basic-1/64/basic_link-512.png'}}]}
                            renderItem={({item}) => (
                                <ListItem
                                    roundAvatar
                                    titleNumberOfLines = {2}
                                    titleContainerStyle={{marginLeft:'3%'}}
                                    title={`${item.name}`}
                                    subtitle={`${'   TR: ' + item.phone + '   SCORE: ' + item.score}`}
                                    avatar={{uri: item.photo.path}}
                                    containerStyle={{borderBottomWidth: 0}}
                                    badge={{element:<Ionicons name="md-menu" size={29} color="green" />}}
                                    rightIcon={<TouchableOpacity style = {{justifyContent: 'center',borderWidth: 1, borderColor: 'black', marginLeft:'2%', paddingHorizontal:'3%'}}><Text>REPLACE</Text></TouchableOpacity>}
                                    key={1}
                                    leftIcon={<Text style={{color: 'black', marginTop:'3%',marginRight:'2%'}}>1</Text>}
                                />
                            )}
                            keyExtractor={item => item.name}
                            ItemSeparatorComponent={this.renderSeparator}
                        />
                    </List>
                </View>
                <View style={{backgroundColor: 'white', paddingHorizontal:'8%'}}>
                    <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
                        <FlatList
                            data={[{name:'raul',phone:'12',score:'150',photo:{path:'https://cdn4.iconfinder.com/data/icons/basic-1/64/basic_link-512.png'}},{name:'raul',phone:'092928383',score:'150',photo:{path:'https://cdn4.iconfinder.com/data/icons/basic-1/64/basic_link-512.png'}},{name:'raul',phone:'092928383',score:'150',photo:{path:'https://cdn4.iconfinder.com/data/icons/basic-1/64/basic_link-512.png'}}]}
                            renderItem={({item}) => (
                                <ListItem
                                    roundAvatar
                                    titleNumberOfLines = {2}
                                    titleContainerStyle={{marginLeft:'3%'}}
                                    title={`${item.name}`}
                                    subtitle={`  'TR: ' ${item.phone + '           SCORE: ' + item.score}`}
                                    avatar={{uri: item.photo.path}}
                                    containerStyle={{borderBottomWidth: 0}}
                                    hideChevron
                                    leftIcon={<Text style={{color: 'black', marginTop:'3%',marginRight:'2%'}}>1</Text>}
                                />
                            )}
                            keyExtractor={item => item.name}
                            ItemSeparatorComponent={this.renderSeparator}
                        />
                    </List>
                </View>
            </View>
        );
    }
}