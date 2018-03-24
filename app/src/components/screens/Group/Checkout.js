// React components:
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
import { List } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import DropdownAlert from 'react-native-dropdownalert';

// Shank components:
import { BaseComponent, BaseModel, MainStyles, AppConst } from '../BaseComponent';
import ViewStyle from './styles/checkoutStyle';

// Images
import ExchangeIcon from '../../../../resources/exchange-icon.png';

export default class Checkout extends BaseComponent {

	static navigationOptions = ({navigation}) => ({title: 'CHECKOUT'});

	constructor(props) {
		super(props);
		this.playerWasChanged = this.playerWasChanged.bind(this);
		this.saveAndPay = this.saveAndPay.bind(this);
		this.handleError = this.handleError.bind(this);
		this.state = {
			isLoading: false,
			roaster: this.props.navigation.state.params.roaster,
			originalRoaster: this.props.navigation.state.params.originalRoaster,
			total: 0
		};
	}
	
	componentDidMount() {
		let finalCost = 0.0;

		for (let i = 0; i < this.state.roaster.length; i++) {
			if (this.playerWasChanged(i)) {
				finalCost += 1.99;
			}
		}

		this.setState({total: finalCost});
	}

	playerWasChanged(index) {
		if (this.state.roaster[index].player._id == this.state.originalRoaster[index].player._id) {
			return false;
		}

		return true;
	}

	async saveAndPay() {
		this.setState({isLoading: true});
		const group = await BaseModel.post(`group/updateMyRoaster/${this.props.navigation.state.params.groupId}/${this.props.navigation.state.params.tournamentId}`, {roaster: this.state.roaster}).catch(this.handleError);

		this.props.navigation.state.params.managePlayersCallback(group, false);
		this.setState({isLoading: false});
		this.props.navigation.goBack();
	}

	handleError(error) {
		this.setState({isLoading: false});
		this.toasterMsg = error;
	}

	render() {
		return (
			<View style={ViewStyle.container}>
				<ScrollView contentContainerStyle={{width: '100%', alignItems: 'center', backgroundColor: AppConst.COLOR_WHITE}}>
					<Spinner visible={this.state.isLoading} animation='fade'/>

					<View style={[ViewStyle.titleView]}>
						<Text style={[ViewStyle.titleText]}>Round {this.props.navigation.state.params.round} Changes Summary</Text>
					</View>

					{this.state.roaster.map((item, index) => {
						return (
							<View key={item._id} style={[ViewStyle.rowView]}>
								<Text style={[ViewStyle.rowNum, {flex: 1}]} numberOfLines={1}>{index + 1}</Text>

								<Text style={[ViewStyle.rowName, {flex: 6}]} numberOfLines={1}>{item.player.firstName + ' ' + item.player.lastName}</Text>

								<Image style={[ViewStyle.exchangeIcon, {flex: 1.5}]} source={ExchangeIcon} resizeMode={'contain'} resizeMethod={'resize'} />

								<Text style={[ViewStyle.rowName, {flex: 6}]} numberOfLines={1}>{this.state.originalRoaster[index].player.firstName + ' ' + this.state.originalRoaster[index].player.lastName}</Text>

								<Text style={[ViewStyle.rowPrice, {flex: 2.5}]} numberOfLines={1}>{this.playerWasChanged(index) ? '$1.99' : null}</Text>
							</View>
						);
					})}

					<View style={[ViewStyle.totalView]}>
						<Text style={[ViewStyle.totalLabel]}>Total</Text>

						<Text style={[ViewStyle.totalValue]}>${this.state.total.toFixed(2)}</Text>
					</View>

					<View style={[ViewStyle.buttonsView]}>
						<TouchableOpacity style={[MainStyles.button, MainStyles.primary, {flex: 1, marginRight: '1%'}]} onPress={() => { this.props.navigation.goBack(null); }}>
							<Text style={MainStyles.buttonText}>Keep Changing</Text>
						</TouchableOpacity>

						<TouchableOpacity style={[MainStyles.button, MainStyles.success, {flex: 1, marginLeft: '1%'}]} onPress={this.saveAndPay}>
							<Text style={MainStyles.buttonText}>Confirm</Text>
						</TouchableOpacity>
					</View>

					<DropdownAlert ref={ref => this.toasterMsg = ref} />
				</ScrollView>
			</View>
		);
	}
}