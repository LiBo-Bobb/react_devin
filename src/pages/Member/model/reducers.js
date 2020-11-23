import * as actions from "./actions";
// 初始数据
const initialState = {
    init: false,
}

export default function reducers(state = initialState, action) {
    switch (action.type) {
        case actions.INIT_MEMBER_DONE:
            return {
                ...state,
                init: true
            }
        default:
            return state
    }
}



// selectors
export function selectMemberInit({member: {init}}) {
    return init
}