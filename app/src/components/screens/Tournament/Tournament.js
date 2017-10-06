import React, {Component} from 'react';
import {ActivityIndicator, ListView, Text, View, Image, Dimensions} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';
import * as Constants from '../../../core/Constans';
import ProgressBar from '../../../global/ProgressBar';
import {Container, Content, Card, CardItem, Left, Right, Body, Thumbnail, Spinner, Icon, CardImage} from 'native-base';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

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
            showLoader: true,
        }
    }

    renderLoader() {
        return (
            this.state.showLoader ? <View><Spinner/></View> : null
        )
    }

    hideLoader() {
        setTimeout(() => {
            this.setState({showLoader: false})
        }, 1);
    }

    componentDidMount() {

        return fetch('https://newsapi.org/v1/articles?source=bbc-sport&sortBy=top&apiKey=' + Constants.APIKEYNEWS)
            .then((response) => response.json())
            .then((responseJson) => {
                let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                let dataSource = ds.cloneWithRows(responseJson.articles);

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


    renderCards(data) {
        // let httpsUrl = data.urlToImage.replace("http", "https");
        let httpsUrl = data.urlToImage;
        return (
            <View style={LocalStyles.container}>
                <Card style={LocalStyles.card}>
                    <CardItem cardBody>
                        <Image source={{uri: httpsUrl}} style={LocalStyles.gridItemImage}>
                            <View style={LocalStyles.fixedFooter}>
                            <Text style={LocalStyles.headline}>{data.title}</Text>
                            <Text note style={LocalStyles.headline}>{data.author}</Text>
                            </View>
                        </Image>
                    </CardItem>
                    <CardItem style={LocalStyles.gridItemText}>
                        <Text style={MainStyles.mediumShankGreenFont}> {data.description}</Text>
                    </CardItem>
                </Card>
            </View>
        )
    }

    render() {
        return (
            this.state.isLoading ? <View><ProgressBar/></View> :
                <View>
                    <ListView
                        contentContainerStyle={LocalStyles.listView}
                        dataSource={this.state.data}
                        initialListSize={20}
                        stickyHeaderIndices={[]}
                        onEndReachedThreshold={1}
                        scrollRenderAheadDistance={4}
                        pageSize={20}
                        renderFooter={(event) => this.renderLoader(event)}
                        onEndReached={(event) => this.hideLoader(event)}
                        renderRow={this.renderCards}
                    />
                </View>
        );
    }
}