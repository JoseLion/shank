import React, {Component} from 'react';
import {ActivityIndicator, ListView, Text, View, Image} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'

export default class TournamentsScreen extends Component {
    static navigationOptions = {
        title: 'TOURNAMENTS',
        headerTitleStyle: {alignSelf: 'center', color: '#fff'},
        headerStyle: {
            backgroundColor: '#556E3E'
        },
        headerLeft: null,
        showIcon: true,
        tabBarIcon: () => {
            return (
                <Image
                    source={require('../../../../resources/mainMenu/menuTaskBar/ios/Recurso10.png')}
                    style={MainStyles.iconXS}/>
            )
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
        }
    }

    componentDidMount() {

        return fetch('https://facebook.github.io/react-native/movies.json')
            .then((response) => response.json())
            .then((responseJson) => {
                let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                let dataSource = ds.cloneWithRows(responseJson.movies);
                this.setState({
                    isLoading: false,
                    data: dataSource,
                }, function () {

                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 20}}>
                    <ActivityIndicator/>
                </View>
            );
        }
        return (
            <View style={{flex: 1, paddingTop: 20}}>
                <ListView
                dataSource={this.state.data}
                renderRow={(rowData) => <Text>{rowData.title}</Text>}
                />
            </View>
        );


    }
}