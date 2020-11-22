import * as globalAction from "./actions";

//初始化全局数据
const initialState = {
    init: false,//初始化状态
    userInfo: {},
    token: '',
    fingerPrint: '',
    showToast: false,
    showModalEl: false,
    showLoading: false,
    modalMsg: '',
    preload: {},
    showModalToast: false,
    bannerConfigMap: {}//所有的弹窗配置，key为弹窗的id
}

// reducer

export default function reducers(state = initialState, action) {
    switch (action.type) {
        case globalAction.INIT_APP_DONE:
            return {
                ...state,
                init: true
            }
        case globalAction.SAVE_PRELOAD:
            return {
                ...state,
                preload: action.preload
            }
        case globalAction.LOGIN_SUCCESS:
            return {
                ...state,
                fingerPrint: action.fingerPrint,
                token: action.token
            };
        case globalAction.RECEIVE_USER_INFO:
            return {
                ...state,
                // userInfo: action.userInfo
            };
        case globalAction.SHOW_MESSAGE:
            return {
                ...state,
                showToast: true,
                toastMsg: action.msg
            };
        case globalAction.HIDE_MESSAGE:
            return {
                ...state,
                showToast: false
            };
        case globalAction.SHOW_LOADING:
            return {
                ...state,
                showLoading: true
            };
        case globalAction.HIDE_LOADING:
            return {
                ...state,
                showLoading: false
            };
        case globalAction.SHOW_MODAL:
            return {
                ...state,
                modalMsg: action.msg,
                showModalEl: true
            };
        case globalAction.HIDE_MODAL:
            return {
                ...state,
                showModalEl: false
            };
        default:
            return state
    }
}


// selectors
export function selectAppInit({app: {init}}) {
    return init
}

export function selectPreLoad({app: {preload}}) {
    return preload
}

export function selectAppUUID({app: {uuid}}) {
    return uuid
}

export function selectLoadingState({app: {loading}}) {
    return loading
}