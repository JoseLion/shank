// shank.levelaptesting.com
// 192.168.100.6
let END_POINT = 'shank.levelaptesting.com'
let HOST = `http://${END_POINT}:3000/`;
let DOC_HOST = `http://docs.${END_POINT}/`;

module.exports = {
  photoPath: '/development/shank/',
  docHost: DOC_HOST,
  user: {
    disabled: 'Your user is disabled!',
    notFound: `Your user doesn't exist!`,
    password: 'Password incorrect!'
  }
}
