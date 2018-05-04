// React components:
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, Image, Platform, AlertIOS, Alert } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import DropdownAlert from 'react-native-dropdownalert';
import InAppBilling from 'react-native-billing';
import InAppHelper from 'InAppHelper';

// Shank components:
import { BaseComponent, BaseModel, MainStyles, AppConst, IsAndroid } from '../BaseComponent';
import ViewStyle from './styles/checkoutStyle';

// Images
import ExchangeIcon from '../../../../resources/exchange-icon.png';

export default class Checkout extends BaseComponent {

	static navigationOptions = ({navigation}) => ({title: 'CHECKOUT'});

	constructor(props) {
		super(props);
		this.product = {};
		this.movements = 0;
		this.playerWasChanged = this.playerWasChanged.bind(this);
		this.saveAndPay = this.saveAndPay.bind(this);
		this.handleError = this.handleError.bind(this);
		this.state = {
			isLoading: false,
			roaster: this.props.navigation.state.params.roaster,
			originalRoaster: this.props.navigation.state.params.originalRoaster,
			priceString: '$0.0',
			total: 0.0
		};
	}

	playerWasChanged(index) {
		if (this.state.originalRoaster[index].player && this.state.roaster[index].player._id == this.state.originalRoaster[index].player._id) {
			return false;
		}

		return true;
	}

	async saveAndPay() {
		let wasPaymentSuccessful = false;

		if (IsAndroid) {
			await InAppBilling.open().catch(this.handleError);
			let details = await InAppBilling.purchase(AppConst.SKUS[this.movements-1]).catch(error => {
				Alert.alert('In-app Billing', error.message, [{text: 'OK'}]);
			});

			if (details != null && details.purchaseState === 'PurchasedSuccessfully') {
				wasPaymentSuccessful = await InAppBilling.consumePurchase(AppConst.SKUS[this.movements-1]).catch(error => {
					Alert.alert('In-app Billing', error.message, [{text: 'OK'}]);
				});
			}

			await InAppBilling.close().catch(this.handleError);
		} else {
			const response = await InAppHelper.purchaseProduct(this.product.identifier).catch(error => {
				AlertIOS.alert("In-app Purchase", error.message);
			});

			if (response && response.productIdentifier) {
				wasPaymentSuccessful = true;
				AlertIOS.alert('Success!', 'Purchase successfull');
			}
		}

		if (wasPaymentSuccessful) {
			this.setState({isLoading: true});
			const body = {
				originalRoaster: this.state.originalRoaster,
				roaster: this.state.roaster,
				round: this.props.navigation.state.params.round,
				payment: this.state.total,
				movements: this.movements
			};
			const group = await BaseModel.post(`group/updateMyRoaster/${this.props.navigation.state.params.groupId}/${this.props.navigation.state.params.tournamentId}`, body).catch(this.handleError);

			this.props.navigation.state.params.managePlayersCallback(group, false);
			this.setState({isLoading: false});
			this.props.navigation.goBack();
		}
	}

	handleError(error) {
		this.setState({isLoading: false});
		this.dropDown.alertWithType('error', "Error", error);
	}

	async componentDidMount() {
		for (let i = 0; i < this.state.roaster.length; i++) {
			if (this.playerWasChanged(i)) {
				this.movements++;
			}
		}

		if (IsAndroid) {
			await InAppBilling.open().catch(this.handleError);
			this.product = await InAppBilling.getProductDetails(AppConst.SKUS[this.movements-1]).catch(error => {
				return Alert.alert("In-app Billing", error, [{text: "OK", onPress: () => this.props.navigation.goBack(null)}], {cancelable: false});
			});
			await InAppBilling.close().catch(this.handleError);
			this.setState({priceString: this.product.priceText, total: this.product.priceValue});
		} else {
			const canPay = await InAppHelper.canMakePayments();

			if (canPay) {
				const productArray = await InAppHelper.loadProducts(AppConst.SKUS).catch(error => {
					return AlertIOS.alert("In-app Purchase", error.message, () => this.props.navigation.goBack(null));
				});

				if (productArray == null || productArray.length <= 0) {
					return AlertIOS.alert("In-app Purchase", "The product couldn't be found in the AppStore", () => this.props.navigation.goBack(null));
				}

				this.product = productArray[this.movements-1];
				this.setState({priceString: this.product.priceString, total: this.product.price});
			}
		}
	}

	render() {
		return (
			<View style={ViewStyle.container}>
				<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{width: '100%', alignItems: 'center', backgroundColor: AppConst.COLOR_WHITE}}>
					<Spinner visible={this.state.isLoading} animation='fade'/>

					<View style={[ViewStyle.titleView]}>
						<Text style={[ViewStyle.titleText]}>Round {this.props.navigation.state.params.round} Changes Summary</Text>
					</View>

					{this.state.roaster.map((item, index) => {
						return (
							<View key={item._id} style={[ViewStyle.rowView]}>
								<Text style={[ViewStyle.rowNum, {flex: 1}]} numberOfLines={1}>{index + 1}</Text>

								<Text style={[ViewStyle.rowName, {flex: 6, textAlign: 'right'}]} numberOfLines={1}>{item.player.firstName + ' ' + item.player.lastName}</Text>

								<Image style={[ViewStyle.exchangeIcon, {flex: 1.5}]} source={ExchangeIcon} resizeMode={'contain'} resizeMethod={'resize'} />

								<Text style={[ViewStyle.rowName, {flex: 6}]} numberOfLines={1}>{this.state.originalRoaster[index].player ? (this.state.originalRoaster[index].player.firstName + ' ' + this.state.originalRoaster[index].player.lastName) : 'Empty Slot'}</Text>

								<Text style={[ViewStyle.rowPrice, {flex: 2.5}]} numberOfLines={1}>{this.playerWasChanged(index) ? this.state.priceString : null}</Text>
							</View>
						);
					})}

					<View style={[ViewStyle.totalView]}>
						<Text style={[ViewStyle.totalLabel]}>Total</Text>

						<Text style={[ViewStyle.totalValue]}>${this.state.total.toFixed(2)}</Text>
					</View>

					<View style={[ViewStyle.buttonsView]}>
						<TouchableOpacity style={[MainStyles.button, MainStyles.primary, {flex: 1, marginRight: '1%'}]} onPress={() => this.props.navigation.goBack(null)}>
							<Text style={MainStyles.buttonText}>Keep Changing</Text>
						</TouchableOpacity>

						<TouchableOpacity style={[MainStyles.button, MainStyles.success, {flex: 1, marginLeft: '1%'}]} onPress={this.saveAndPay}>
							<Text style={MainStyles.buttonText}>Confirm</Text>
						</TouchableOpacity>
					</View>

					<DropdownAlert ref={ref => this.dropDown = ref} />
				</ScrollView>
			</View>
		);
	}
}