import {store} from "../redux";
import axios from 'axios'
import {apis} from './env.config'
const {api} = apis
// import { isMiniProgramPromise, isMiniProgramSync, isWeixin} from "../utils/env";
// import {navigateToMiniProgramWebview} from "../utils/navigateToMiniProgram";

export const server = api
export const ajax = axios.create()


ajax.interceptors.request.use((config) => {
    let {url, data, headers, method, params} = config
    const {token,} = store.getState().app
    // 添加sk && 添加指纹
    data ? data.sk = token : data = {sk: token}
    // headers.fp = fingerPrint
    // 处理url
    let baseURL = api

    // 处理数据格式
    if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
        if (method === 'post') {
            let temp = []
            for (let i in data) {
                temp.push(i + '=' + encodeURI(data[i]))
            }
            data = temp.join('&')
        } else {
            params = params ? {...data, ...params} : data
        }
    }


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


export function getBanner() {
    return ajax({
        url: '/banner'
    })
}