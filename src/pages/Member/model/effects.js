import {put, call, take, all, fork, select} from 'redux-saga/effects'
// api
import * as api from '../../../common/services'
import * as action from './actions'
import * as globalAction from "../../App/model/actions";

// effectFunc
import {checkAppInit, checkRes} from '../../App/model/effects'
import {selectMemberInit} from "./reducers";

/* ********** 页面流程 *********** */

// 路由加载
function* main() {
    while (true) {
        yield take(action.ROUTE_MEMBER)
        // yield call(checkAppInit)
        // 判断列表是否初始化
        yield call(checkMemberInit)
        yield call(loadMember)
    }
}

export function* checkMemberInit() {
    // console.log("1212112")
    const init = yield select(selectMemberInit)
    // console.log("init...",init)
    if (!init) {
        yield call(initMember)
        yield put(action.initMemberDone())
    }
}

// 初始化
function* initMember() {
    yield all([
        // call(getBanner),
    ])
}

// 每次加载
function* loadMember() {
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

export default function* memberSaga() {
    yield fork(main)
    yield fork(watchRegister)
}




