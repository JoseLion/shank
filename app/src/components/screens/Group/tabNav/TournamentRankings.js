/**
 * Created by MnMistake on 10/10/2017.
 */
import React, {Component} from 'react';

import LocalStyles from '../styles/local';
import MainStyles from '../../../../styles/main';
import {Text, View, FlatList} from 'react-native';
import {List, ListItem} from "react-native-elements"; // 0.17.0

export default class TournamentRankings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            tPLayers: this.props.tPlayers,
            data: {
                "A": [{"name": "Anh Tuan", "lastName": "Nguyen", "urlPhoto":"https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"},{"name": "Anh Tuan", "lastName": "Nguyen", "urlPhoto":"https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"} ],
                "B": [{"name": "Anh Tuan", "lastName": "Nguyen", "urlPhoto":"https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"},{"name": "Anh Tuan", "lastName": "Nguyen", "urlPhoto":"https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"} ],
                "C": [{"name": "Anh Tuan", "lastName": "Nguyen", "urlPhoto":"https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"},{"name": "Anh Tuan", "lastName": "Nguyen", "urlPhoto":"https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"} ],
                "X": [{"name": "Anh Tuan", "lastName": "Nguyen", "urlPhoto":"https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"},{"name": "Anh Tuan", "lastName": "Nguyen", "urlPhoto":"https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"} ],
                "Z": [{"name": "Anh Tuan", "lastName": "Nguyen", "urlPhoto":"https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"},{"name": "Anh Tuan", "lastName": "Nguyen", "urlPhoto":"https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"} ],
            }
        };
    }

    static navigationOptions = ({navigation}) => ({
        title: 'TournamentRankings',
        headerTitleStyle: {alignSelf: 'center', color: '#fff'},
        headerStyle: {
            backgroundColor: '#556E3E',
            paddingHorizontal: '3%'
        },
    });

    componentDidMount() {

    }

    renderSeparator = () => {
        return (
            <View style={MainStyles.listRenderSeparator}/>
        );
    };

    render() {
        return (
            <View style={LocalStyles.slideBorderStyle}>
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
        )
    }
}