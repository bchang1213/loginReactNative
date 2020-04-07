const GOT_USERS = 'GOT_USERS';
const USER_ONLINE = 'USER_ONLINE';
export const gotUsers = users => ({ type: GOT_USERS, users });
export const userOnline = user => ({ type: USER_ONLINE, user });
const reducer = (state = [], action) => {
	switch (action.type) {
		case GOT_USERS:
			return action.users;
		case USER_ONLINE:
			/*looks in redux state for user property. updates this.state.user prop with new id. */
			if(!state.find(user => user.id === action.user.id)) {
				return [...state, action.user];
			} else {
				return state;
			}
		default:
			return state;
	}
};
export default reducer;