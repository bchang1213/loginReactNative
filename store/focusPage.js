const CURRENT_PAGE = 'CURRENT_PAGE';
const FOCUSED_VIDEO = 'FOCUSED_VIDEO';

export const currentPage = navigation => ({ type: CURRENT_PAGE, navigation });
export const focusedVideo = video => ({ type: FOCUSED_VIDEO, video });

const reducer = (state = [], action) => {
	switch (action.type) {
		case CURRENT_PAGE:
            return [action.navigation, ...state];
        case FOCUSED_VIDEO:
            return action.video ? action.video : [];
		default:
			return state;
	}
};
export default reducer;