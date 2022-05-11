const { loadJSON } = require("../json_manip");

/**
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {user} - user object
 *
 * function that ask a user id and returns the user object
 */
function getUser(req, res) {
	const { id } = req.query;

	// get the user from files
	const user = loadJSON(`private/users/${id}.json`);

	// check if user exists
	if (!user) {
		res.status(404).send("User not found");
		return;
	}

	res.status(200).json(user);
}

/**
 * @param {Request} req
 * @param {Response} res
 *
 * req.query.id - user id
 *
 * @returns {contact[]} - array of contacts
 *
 * function that ask a user and returns the contacts
 */
function getContacts(req, res) {
	const { id } = req.query;

	// get the user from files
	const user = loadJSON(`private/users/${id}.json`);

	// check if user exists
	if (!user) {
		res.status(404).send("User not found");
		return;
	}

	res.status(200).json(user.contacts);
}

/**
 * @param {Request} req
 * @param {Response} res
 *
 * req.query.conversation_id - conversation id
 * req.query.from - start date
 * req.query.to - end date
 *
 * @returns {message[]} - array of messages
 *
 * function that ask a conversation and (optionally) a date range and returns the messages
 * in the conversation between the two dates or all the messages in the conversation if no date range is given
 */
function getMessages(req, res) {
	const { conversation_id, from, to } = req.query;

	// get the conversation from files
	const conversation = loadJSON(`private/conversations/${conversation_id}.json`);

	// check if conversation exists
	if (!conversation) {
		res.status(404).send("Conversation not found");
		return;
	}

	// if asking for messages in a specific period of time
	if (from && to) {
		// get the messages from the conversation
		const messages = conversation.messages.filter(message => message.date >= from && message.date <= to);

		res.status(200).json(messages);
	}

	// if asking for all messages
	else {
		res.status(200).json(conversation.messages);
	}
}

module.exports = { getUser, getContacts, getMessages };
