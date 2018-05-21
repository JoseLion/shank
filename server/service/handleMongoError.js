export default error => {
	throw "MongoDB operation exception: " + error
	console.log("MongoDB operation exception: ", error);
}