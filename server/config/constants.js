// shank.levelaptesting.com
// 192.168.100.6

const END_POINT = '192.168.10.152';
const HOST = `http://${END_POINT}:3000/`;
const DOC_HOST = `http://docs.${END_POINT}/`;

export default {
	FANTASY_HEADER: 'Ocp-Apim-Subscription-Key',
	FANTASY_KEY: 'c9c0062b61e7427ea036a05ecb8bf11b',/*'2c3eac2a290f44d09305e3f195ef36da',*/



	photoPath: '/development/shank/', //SHOULD BE DELETED
	docHost: DOC_HOST,
	user: {
		disabled: "Your user is disabled!",
		notFound: "Your user doesn't exists!",
		password: "Incorrect password!"
	}
}