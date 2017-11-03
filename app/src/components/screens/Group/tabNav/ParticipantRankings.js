/**
 * Created by MnMistake on 10/10/2017.
 */
import React, {Component} from 'react';

import LocalStyles from '../styles/local';
import MainStyles from '../../../../styles/main';
import {Text, View, FlatList} from 'react-native';
import {List, ListItem} from "react-native-elements"; // 0.17.0

export default class ParticipantRankings extends Component {
    // Define your own renderRow
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
        title: 'Participant Rankings',
        headerTitleStyle: {alignSelf: 'center', color: '#fff'},
        headerStyle: {
            backgroundColor: '#556E3E',
            paddingHorizontal: '3%'
        },
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
        return (
            <View style={LocalStyles.slideBorderStyle}>
                <List containerStyle={LocalStyles.listContainer}>
                    <FlatList
                        data={this.props.screenProps.groupUsers}
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
        )
    }
}