import {put, call, take, all, fork, select} from 'redux-saga/effects'

// api
import * as api from '../../../common/services'
import * as action from './actions'
import * as globalAction from "../../App/model/actions";

// effectFunc
import {checkAppInit, checkRes} from '../../App/model/effects'

import {selectHomeInit} from "./reducers";
/* ********** 页面流程 *********** */

// 路由加载
function* main() {
    while (true) {
        yield take(action.ROUTE_HOME)

        // yield call(checkAppInit)

        // 判断列表是否初始化
        yield call(checkHomeInit)

        yield call(loadHome)
    }
}

export function* checkHomeInit() {
    const init = yield select(selectHomeInit)
    if (!init) {
        yield call(initHome)
        yield put(action.initHomeDone())
    }
}

// 初始化
function* initHome() {
    yield all([
        // call(getBanner),
    ])
}

// 每次加载
function* loadHome() {
    // yield call(getRecommend)
}

/* ******* watcher ******* */
function* watchRegister() {
    // 初始化监听
    yield all([])
}

//
// function* getBanner() {
//     yield call(checkRes, {
//         api: api.getBanner,
//         success: (data) => put(action.receiveBanner(data)),
//         failed: () => put(globalAction.putMessage('banner获取失败'))
//     })
// }

export default function* homeSaga() {
    yield fork(main)
    yield fork(watchRegister)
}




