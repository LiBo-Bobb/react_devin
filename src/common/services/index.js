import axios from 'axios'
import {api} from './env.config'
// import { isMiniProgramPromise, isMiniProgramSync, isWeixin} from "../utils/env";
// import {navigateToMiniProgramWebview} from "../utils/navigateToMiniProgram";

export const server = api
export const ajax = axios.create()


ajax.interceptors.request.use((config) => {
    let {url, data, headers, method, params} = config
    // console.log("config...", config, params)
    headers = {
        token: '',
        appChannel:"",
        mobileType: "APPLET_WECHAT",
        appVersionName:"2.1.0"
    }
    // 处理url
    let baseURL = url.includes('http') ? "" : api
    return {
        ...config,
        data,
        params,
        headers,
        baseURL
    }
})


ajax.interceptors.response.use(
    (res) => {
        const {status, data} = res

        if (status === 200) return data
    },
    (error) => {

        console.log('底层出错:', error)

        return {
            code: 700
        }
    }
)


// 酒店推荐列表
export function getRecommendHotelList() {
    return ajax({
        url: '/recommend/hotel'
    })
}

//获取酒店列表
export function getHotelList(data) {
    return ajax({
        url: '/hotel/page?name=test',
        method: "post",
        data
    })
}