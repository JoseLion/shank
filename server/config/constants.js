// shank.levelaptesting.com
// 192.168.10.152

const END_POINT = '192.168.10.152';
const HOST = `http://${END_POINT}:3000/`;
const DOC_HOST = `http://docs.${END_POINT}/`;

export default {
	FANTASY_HEADER: 'Ocp-Apim-Subscription-Key',
    FANTASY_KEY: '9216f296733346b5827153332969707d',/*'00f042d98b0d44929ba4c631821af129',*/
    BUNDLE_ID: 'com.elevision.shank',
	APNS_KEY_PATH: './certificates/AuthKey_4NGX852253.p8',
	APNS_KEY_ID: '4NGX852253',
	APNS_TEAM_ID: 'X4Q95LZ6Y8',



	photoPath: '/development/shank/', //SHOULD BE DELETED
	docHost: DOC_HOST,
	user: {
		disabled: "Your user is disabled!",
		notFound: "Your user doesn't exists!",
		password: "Incorrect password!"
	}
};