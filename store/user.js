const GOT_USER = 'GOT_USER';
const REMOVE_USER = 'REMOVE_USER';

export const gotUser = user => ({ type: GOT_USER, user });
export const removeUser = user => ({ type: REMOVE_USER });

const reducer = (state = {}, action) => {
	switch (action.type) {
	case GOT_USER:
		return action.user;
	case REMOVE_USER:
		return [];
	default:
	return state;
	}
};
export default reducer;