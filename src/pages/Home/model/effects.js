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
    // yield call(getRecommendHotelList)
}

/* ******* 业务接口 ******* */

// 获取酒店推荐列表
function* getRecommendHotelList() {
    yield call(checkRes, {
        api: api.getRecommendHotelList,
        success: (data) => {
            console.log("data.....", data)
            return all([put(action.receiveRecommendHotelList(data))])
            // return put(action.receiveBanner(data))
        },
        failed: () => put(globalAction.putMessage('酒店列表获取失败~'))
    })
}

// 获取酒店列表
function* getHotelList() {
    yield call(checkRes, {
        api: api.getHotelList,
        data: {
            backendCategoryId: "1",
            checkInDate: "2020-11-28",
            checkOutDate: "2020-11-29",
            pageNum: 1,
            pageSize: 10,
            shopName: "",
            tagId: ""
        },
        success: (data) => {
            console.log("hotelList.....", data)
            return ""
        }
    })
}


/* ******* watcher ******* */
function* watchRegister() {
    // 初始化监听
    yield all([fork(watchGetHotelList),])
}

//
function* watchGetHotelList() {
    while (true) {
        const {} = yield take(action.GET_HOTEL_LIST)
        yield call(getHotelList)
    }
}

export default function* homeSaga() {
    yield fork(main)
    yield fork(watchRegister)
}




