const CURRENT_PAGE = 'CURRENT_PAGE';
const FOCUSED_VIDEO = 'FOCUSED_VIDEO';
const DEFOCUS_VIDEO = 'DEFOCUS_VIDEO';

export const currentPage = navigation => ({ type: CURRENT_PAGE, navigation });
export const focusedVideo = video => ({ type: FOCUSED_VIDEO, video });
export const defocusVideo = () => ({ type: DEFOCUS_VIDEO });

const reducer = (state = [], action) => {
	switch (action.type) {
		case CURRENT_PAGE:
            return [action.navigation, ...state];
        case FOCUSED_VIDEO:
			return action.video ? action.video : [];
		case DEFOCUS_VIDEO:
			return [];
		default:
			return state;
	}
};
export default reducer;