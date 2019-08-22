//Universal Unique Identifier generator package
const uuidv4 = require("uuid/v4");

/*
 *	createUser
 *	Creates a user.
 *	@prop id {string} created with "uuidv4" nmp package.
 *	@prop name {string} which will be defaulted to "" if it doesn't get another value at execution time.
 *	@param {object}
 *		name {string}
 */
const createUser = ({ name = "" } = {}) => {
  return {
    id: uuidv4(),
    name
  };
};

/*
 *	createMessage
 *	Creates a messages object.
 * 	@prop id {string} created with "uuidv4" nmp package.
 * 	@prop time {Date} the time in 24hr format i.e. 14:22
 * 	@prop message {string} actual string message which will be defaulted to "" if it doesn't get another value at execution time.
 * 	@prop sender {string} sender of the message which will be defaulted to "" if it doesn't get another value at execution time.
 *	@param {object}
 *		message {string}
 *		sender {string}
 */
const createMessage = ({ message = "", sender = "" } = {}) => {
  return {
    id: uuidv4(),
    //Calls the "getTime" function and passes on an argument with the current time.
    time: getTime(new Date(Date.now())),
    message,
    sender
  };
};

/*
 *	createChat
 *	Creates a Chat object
 * 	@prop id {string} created with "uuidv4" nmp package.
 * 	@prop name {string} which will be defaulted to "Communitiy" if it doesn't get another value at execution time.
 * 	@prop messages {Array.Message}
 * 	@prop users {Array.string}
 * 	@prop typingUsers {Array.string}
 *	@param {object}
 *		messages {Array.Message}
 *		name {string}
 *		users {Array.string}
 *		typingUsers {Array.string}
 *
 */
const createChat = ({ messages = [], name = "Community", users = [] } = {}) => {
  return {
    id: uuidv4(),
    name,
    messages,
    users,
    typingUsers: []
  };
};

/*
 *	@param date {Date}
 *	@return a string represented in 24hr time i.e. '11:30', '19:30'
 */
const getTime = date => {
  //This returns a string that concats the hours from the passed on "date" argument with its munutes. Since the minutes come in integer numbers, the concatenations adds a "0" at the left and then takes the firs two digits from right, this will include that "0" if the minutes value was less than "10".
  return `${date.getHours()}:${("0" + date.getMinutes()).slice(-2)}`;
};

//Exporting the above created functions except for "getTime" which is a helper function.
module.exports = {
  createUser,
  createMessage,
  createChat
};
