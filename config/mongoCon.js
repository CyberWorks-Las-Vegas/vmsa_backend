var config = {
	expressPort: 8000,
	client: {
		mongodb: {
			defaultCollection: "login",
			defaultDatabase: "premises",
			defaultUri: "mongodb://localhost:8000"
		},
		mockarooUrl: "http://www.mockaroo.com/536ecbc0/download?count=1000&key=48da1ee0"
	},
	mongoURI: "mongodb+srv://boredasfawk:vmsa@school-0-pre-beta-jpaol.mongodb.net/login?retryWrites=true&w=majority",
	secretOrKey: "cyberworks"
};

module.exports = config;
