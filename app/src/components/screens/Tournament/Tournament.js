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
            <Card>
                <CardItem>
                    <Left style={{flex: 0.8}}>
                        <Icon name="ios-book"/>
                        <Body>
                        <Text style={{fontWeight: 'bold', fontSize: 17}}>{data.title}</Text>
                        <Text note style={{fontSize: 15}}>{data.author}</Text>
                        </Body>
                    </Left>
                    {/*<Right style={{flex: 0.2}}>*/}
                    {/*<Icon name="ios-heart"/>*/}
                    {/*</Right>*/}
                </CardItem>
                <CardItem cardBody>
                    <Image source={{uri: httpsUrl}} style={{height: 200, width: viewportWidth, flex: 1}}/>
                </CardItem>
                <CardItem content>
                    <Text>{data.description}</Text>
                </CardItem>
            </Card>
        )
    }

    render() {
        return (
            this.state.isLoading ? <View><ProgressBar/></View> :
                <View>
                    <ListView
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