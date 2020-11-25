export const ROUTE_HOME = '@@ROUTE_HOME'
export const INIT_HOME_DONE = '@@INIT_HOME_DONE'
export const RECEIVE_RECOMMEND_HOTEL_LIST = "RECEIVE_RECOMMEND_HOTEL_LIST"
export const GET_HOTEL_LIST = "GET_HOTEL_LIST"

// 首页挂载
export function routeHome() {
    return {
        type: ROUTE_HOME
    }
}

// 初始化首页完成
export function initHomeDone() {
    return {
        type: INIT_HOME_DONE
    }
}

// 获取推荐酒店列表数据并保存数据
export function receiveRecommendHotelList(data) {
    return {
        type: RECEIVE_RECOMMEND_HOTEL_LIST,
        hotelList: data
    }
}

// 获取酒店列表
export function getHotelList() {
    return {
        type: GET_HOTEL_LIST
    }
}