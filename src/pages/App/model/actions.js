export const INIT_APP = '@@INIT_APP'
export const INIT_APP_DONE = '@@INIT_APP_DONE'
export const SAVE_PRELOAD = 'SAVE_PRELOAD'
export const LOGIN = 'LOGIN'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const NEED_LOGIN = 'NEED_LOGIN'
export const GET_USER_INFO = 'GET_USER_INFO'
export const RECEIVE_USER_INFO = 'RECEIVE_USER_INFO'
export const RECEIVE_USER_INFO_FAIL = 'RECEIVE_USER_INFO_FAIL'
export const PUT_MESSAGE = 'PUT_MESSAGE'
export const SHOW_MESSAGE = 'SHOW_MESSAGE'
export const HIDE_MESSAGE = 'HIDE_MESSAGE'
export const SHOW_MODAL = 'SHOW_MODAL'
export const HIDE_MODAL = 'HIDE_MODAL'
export const SHOW_LOADING = 'SHOW_LOADING'
export const HIDE_LOADING = 'HIDE_LOADING'
export const PUT_MODAL_MESSAGE = 'PUT_MODAL_MESSAGE'
export const SHOW_MODAL_MESSAGE = 'SHOW_MODAL_MESSAGE'
export const HIDE_MODAL_MESSAGE = 'HIDE_MODAL_MESSAGE'
export const SET_STATE = 'SET_STATE'
export const GET_BANNER_CONFIG = 'GET_BANNER_CONFIG'
// 风控加载成功
export const PAY_EGIS_SUCCESS = 'PAY_EGIS_SUCCESS'

// 全局初始化
export function initApp() {
    return {
        type: INIT_APP
    }
}

// 全局初始化完成
export function initAppDone() {
    return {
        type: INIT_APP_DONE
    }
}

// 储存服务端预设数据
export function savePreload(preload) {
    return {
        type: SAVE_PRELOAD,
        preload
    }
}

// 登陆
export function login(fingerPrint) {
    return {
        type: LOGIN,
        fingerPrint
    }
}

// 储存token
export function loginSuccess(token, fingerPrint) {
    return {
        type: LOGIN_SUCCESS,
        fingerPrint,
        token
    }
}

// 登陆
export function needLogin(force) {
    return {
        type: NEED_LOGIN,
        force
    }
}

// 获取用户信息
export function getUserInfo(loading) {
    return {
        type: GET_USER_INFO,
        loading
    }
}

// 获取用户信息
export function receiveUserInfo(userInfo) {
    return {
        type: RECEIVE_USER_INFO,
        userInfo
    }
}

// 获取用户信息失败
export function receiveUserInfoFail(error) {
    return {
        type: RECEIVE_USER_INFO_FAIL,
        error
    }
}

// 推送错误消息
export function putMessage(msg, res) {
    return {
        type: PUT_MESSAGE,
        msg,
        res
    }
}

// 显示错误消息
export function showMessage(msg, res) {
    return {
        type: SHOW_MESSAGE,
        msg,
        res
    }
}

// 隐藏错误消息
export function hideMessage() {
    return {
        type: HIDE_MESSAGE
    }
}

// 显示错误消息
export function showModal(msg) {
    return {
        type: SHOW_MODAL,
        msg
    }
}

// 隐藏错误消息
export function hideModal() {
    return {
        type: HIDE_MODAL
    }
}

// 显示加载
export function showLoading() {
    return {
        type: SHOW_LOADING,
    }
}

// 隐藏加载
export function hideLoading() {
    return {
        type: HIDE_LOADING
    }
}


// 风控加载成功
export function payEgisSuccess(uuid) {
    return {
        type: PAY_EGIS_SUCCESS,
        uuid
    }
}

export function putModalMessage() {
    return {
        type: PUT_MODAL_MESSAGE
    }
}

export function showModalMessage() {
    return {
        type: SHOW_MODAL_MESSAGE
    }
}


export function hideModalMessage() {
    return {
        type: HIDE_MODAL_MESSAGE
    }
}

export function setState(data) {
    return {
        type: SET_STATE,
        data
    }
}

export function getBannerConfig(activityId) {
    return {
        type: GET_BANNER_CONFIG,
        activityId
    }
}