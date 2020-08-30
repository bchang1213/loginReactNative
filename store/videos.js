const STORE_ALL_VIDEOS = 'STORE_ALL_VIDEOS';
const DELETE_ALL_VIDEOS = 'DELETE_ALL_VIDEOS';

export const deleteVideos = () => ({ type: DELETE_ALL_VIDEOS });
export const storeVideos = videosArray => ({ type: STORE_ALL_VIDEOS, videosArray });

const reducer = (state = [], action) => {
	switch (action.type) {
        case STORE_ALL_VIDEOS:
			return action.videosArray;
		case DELETE_ALL_VIDEOS:
			return [];
		default:
			return state;
	}
};
export default reducer;