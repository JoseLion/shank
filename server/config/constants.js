// shank.levelaptesting.com
// 192.168.100.6

const END_POINT = '192.168.10.152';
const HOST = `http://${END_POINT}:3000/`;
const DOC_HOST = `http://docs.${END_POINT}/`;

export default {
	uploadsPath: 'public/uploads',
	photoPath: '/development/shank/', //SHOULD BE DELETED
	docHost: DOC_HOST,
	user: {
		disabled: "Your user is disabled!",
		notFound: "Your user doesn't exist!",
		password: "Password incorrect!"
	}
}