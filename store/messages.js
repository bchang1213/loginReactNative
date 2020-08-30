const GOT_MESSAGES = 'GOT_MESSAGES';
const GOT_NEW_MESSAGE = 'GOT_NEW_MESSAGE';
const PURGE_MESSAGES = 'PURGE_MESSAGES';
export const gotMessages = messages => ({ type: GOT_MESSAGES, messages });
export const gotNewMessage = message => ({ type: GOT_NEW_MESSAGE, message });
export const purgeMessages = () => ({ type: PURGE_MESSAGES });
const reducer = (state = [], action) => {
	switch (action.type) {
		case GOT_MESSAGES:
			return action.messages ? action.messages : [];
		case GOT_NEW_MESSAGE:
			var newState = [...state];
			newState[1].push(action.message);
			return newState;
		case PURGE_MESSAGES:
			
			return [];
		default:
			return state;
	}
};
export default reducer;