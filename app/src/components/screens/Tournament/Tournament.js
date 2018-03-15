import React, {Component} from 'react';
import {ActivityIndicator, ListView, Text, View, Image, Dimensions, ScrollView,Linking} from 'react-native';
import MainStyles from '../../../styles/MainStyles';
import LocalStyles from './styles/local';
import * as ShankConstants from '../../../core/ShankConstants';
import ProgressBar from '../../../global/ProgressBar';
import {FontAwesome,Ionicons} from '@expo/vector-icons';
import {Container, Content, Card, CardItem, Left, Right, Body, Thumbnail, Spinner, Icon, CardImage} from 'native-base';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

export default class TournamentsScreen extends Component {
    static navigationOptions = {
        title: 'TOURNAMENTS',
        showIcon: true,
        headerTintColor: ShankConstants.TERTIARY_COLOR,
        headerTitleStyle: {alignSelf: 'center', color: ShankConstants.TERTIARY_COLOR},
        headerStyle: { backgroundColor: ShankConstants.PRIMARY_COLOR },
        headerLeft: null,
        tabBarIcon: ({tintColor}) => {
            return (
                <Ionicons name="md-trophy" style={[MainStyles.tabBarIcon, {color: tintColor}]} />
            )
        },
        tabBarLabel: 'Tournaments'
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
            this.state.showLoader ? <View><Spinner color="black"/></View> : null
        )
    }

    hideLoader() {
        setTimeout(() => {
            this.setState({showLoader: false})
        }, 1);
    }

    componentDidMount() {

        /*return fetch('https://newsapi.org/v1/articles?source=bbc-sport&sortBy=top&apiKey=' + ShankConstants.APIKEYNEWS)
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
            });*/
    }


    renderCards(data) {
        // let httpsUrl = data.urlToImage.replace("http", "https");
        let httpsUrl = data.urlToImage;
        return (
            <View>
                <Card style={LocalStyles.card}>
                    <CardItem cardBody>
                        <Image source={{uri: httpsUrl}} style={LocalStyles.gridItemImage}>
                            <View style={LocalStyles.fixedFooter}>
                                <FontAwesome name="chain" size={25} color="white" onPress={()=> {
                                    Linking.canOpenURL(data.url).then(supported => {
                                        if (!supported) {
                                            console.log('Can\'t handle url: ' + data.url);
                                        } else {
                                            return Linking.openURL(data.url);
                                        }
                                    }).catch(err => console.error('An error occurred', err));
                                }}/>
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
            this.state.isLoading ? <View style={LocalStyles.justifyCenterContent}><ProgressBar/></View> :
                <Container>
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
                </Container>
        );
    }
}
