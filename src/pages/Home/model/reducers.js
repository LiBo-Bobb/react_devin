import * as actions from "./actions";
import {RECEIVE_RECOMMEND_HOTEL_LIST} from "./actions";
// 初始数据
const initialState = {
    init: false,
}

export default function reducers(state = initialState, action) {
    switch (action.type) {
        case actions.INIT_HOME_DONE:
            return {
                ...state,
                init: true
            }
        case actions.RECEIVE_RECOMMEND_HOTEL_LIST:
            return {
                ...state,
                recommendHotelList: action.hotelList,
            }
        default:
            return state
    }
}


// selectors
export function selectHomeInit({home: {init}}) {
    return init
}