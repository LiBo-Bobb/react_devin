/* 全局sage */
import {all, call, fork, put, select, take, actionChannel, takeEvery} from 'redux-saga/effects'
import {buffers} from 'redux-saga'

import * as api from '../../../common/services'

import * as globalAction from "./actions";

import {selectAppInit,} from "./reducers";

// 获取token
import {getToken, getFingerPrint} from "../../../common/utils/token";

// login
import login from "../../../common/utils/login";
// 对接风控
//import pagEgis from '../../../common/utils/payEgis'

/* app 主流程 */
function* main() {
    while (true) {
        yield take(globalAction.INIT_APP)
        yield call(checkAppInit)
    }
}

export function* checkAppInit() {
    const appInit = yield select(selectAppInit)
    if (!appInit) {
        yield call(initApp)
        yield put(globalAction.initAppDone())
    }
}

function* initApp() {
    // 对接风控
    // yield fork(payEgis)
    // 登陆
    yield put(globalAction.needLogin())
    // 等待登陆成功
    yield take(globalAction.LOGIN_SUCCESS)
    // 获取用户数据
    // yield call(getUserInfo, true)
}


/* ******* watcher ******* */

function* watchRegister() {
    yield all([
        fork(watchLogin),
        fork(watchNeedLogin),
        fork(watchPutMessage),
        fork(watchPutModalMessage)
    ])
}


// 监听登录action
function* watchNeedLogin() {
    while (true) {
        const {force} = yield take(globalAction.NEED_LOGIN);
        yield call(needLogin, force);
    }
}

function* watchLogin() {
    //  actionChannel  是缓存action
    const chan = yield actionChannel(globalAction.LOGIN, buffers.sliding(1));
    while (true) {
        const {fingerPrint} = yield take(chan);
        yield call(login, {
            fingerPrint: fingerPrint,
            loginUrl: api.server
        });
        yield call(delay, 5000);
    }
}

function* watchPutMessage() {
    // 生成消息队列 依次推送消息
    const chan = yield actionChannel(globalAction.PUT_MESSAGE, buffers.sliding(3))
    while (true) {
        const {msg} = yield take(chan)
        yield put(globalAction.showMessage(msg))
        yield call(delay, 1500)
        yield put(globalAction.hideMessage())
    }
}

function* watchPutModalMessage() {
    // 生成消息队列 依次推送消息
    const chan = yield actionChannel(globalAction.PUT_MODAL_MESSAGE, buffers.sliding(3))
    while (true) {
        const {msg} = yield take(chan)
        yield put(globalAction.showModalMessage())
        yield call(delay, 1500)
        yield put(globalAction.hideModalMessage())
    }
}

// function* watchGetUserInfo() {
//     while (true) {
//         const {loading} = yield take(globalAction.GET_USER_INFO)
//         yield call(getUserInfo, loading)
//     }
// }


/* ******** worker ******** */

// 对接风控
/*function* payEgis() {
    const uuid = yield call(pagEgis)
    yield put(globalAction.payEgisSuccess(uuid))
}*/

// 获取用户信息
// function* getUserInfo(loading) {
//     //模拟延迟
//     //yield call(delay,2000)
//     yield call(checkRes, {
//         api: api.getUserInfo,
//         loading: loading,
//         success: (data) => put(globalAction.receiveUserInfo(data)),
//         failed: (res, e) => {
//             return all([
//                 put(globalAction.receiveUserInfoFail(e)),
//                 put(globalAction.putMessage('用户信息获取失败'))
//             ])
//         }
//     })
// }


/* ******** global methods ******** */

// 登陆
export function* needLogin(force, callback) {
    // 获取指纹
    const fp = getFingerPrint()
    if (force) {
        yield put(globalAction.login(fp))
        return
    }
    // 获取token
    const token = getToken('sk')

    if (token) {
        yield put(globalAction.loginSuccess(token, fp))
    } else {
        // 需要登陆 登陆前可执行某些逻辑
        if (callback) yield call(callback)
        // 跳转登陆
        yield put(globalAction.login(fp))
    }
}

// 延迟
export function delay(time) {
    return new Promise(function (re, rj) {
        setTimeout(function () {
            re()
        }, time)
    })
}

/**
 *封装checkRes方法 对后端的响应数据进行处理
 * @param api      调用接口的函数
 * @param data     接口参数
 * @param success  成功函数
 * @param failed   失败函数
 * @param loading  是否loading
 * @returns {Generator<CallEffect|PutEffect<{force: *, type: string}>|PutEffect<{type: string}>|PutEffect<{msg: *, res: *, type: string}>|*|PutEffect<{msg: *, type: string}>, void, *>}
 */
export function* checkRes({api, data, success, failed, loading}) {
    // 统一loading处理
    if (loading) {
        yield put(globalAction.showLoading())
    }

    const res = yield call(api, data)
    const code = parseInt(res.code, 10)
    if (code === 200) {
        // 服务端响应成功
        yield success(res.data)
    } else if (code === 400) {
        // 需要登陆
        yield put(globalAction.needLogin(true))
    } else if (code === 406) {
        // yield window.location.href = businessInterceptor
    } else if (code === 600) {
        // 服务端业务逻辑处理失败
        yield put(globalAction.putMessage(res.msg))
        yield failed(res.msg, res)
    } else if (code === 700) {
        // 客户端或服务端执行出错 阻塞后续逻辑执行
        yield put(globalAction.showModal('网络出错，请稍后再试！'))
        // todo 请求重试及中断后续请求
    } else if (code === 500) {
        // 客户端或服务端执行出错 阻塞后续逻辑执行
        yield put(globalAction.showModal('网络出错，请稍后再试'))
        // todo 请求重试及中断后续请求
    } else {
        // 其他异常
        yield failed('code校验失败', res)
    }

    // 统一loading处理
    if (loading) {
        yield put(globalAction.hideLoading())
    }
}

export default function* appSaga() {
    yield fork(main)
    yield fork(watchRegister)
}
