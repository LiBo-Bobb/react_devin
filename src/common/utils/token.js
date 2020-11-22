import cookie from "js-cookie";
import uuid from './uuid'

/* ****** 获取token ****** */

// getToken
export function getToken(key) {
    return cookie.get(key) || '';
}

// saveToken
export function saveToken(key) {
    const queryToken = getUrlQuery(key);

    // 隐藏token
    setUrlQuery(key,'',true)

    const token = queryToken || cookie.get(key) || '';

    cookie.set(key, token, {
        expires: 20 / 60 / 24
    });
}

/* ****** 获取fingerPrint ****** */

// 暂时使用uuid代替 可考虑Fingerprintjs2

export function getFingerPrint() {
    // 从本地获取已有fp
    let fp = cookie.get('fp')

    if(!fp) {
        fp = uuid()
        cookie.set('fp',fp, {
            expires: 3650
        })
    }

    return fp
}

/* ****** url解析相关方法 ****** */

// 解析Url参数
export function parseUrlQuery(){
    let {search,hash} = window.location

    const queryJson = {}

    if (!search && hash.indexOf('?') !== -1) {
        search = '?' + hash.split('?')[1];
    }

    let query = search.match(/([?&])[^&]+/ig);
    if (query) {
        query.forEach(function (str) {
            let arr;
            str = str.substring(1);
            str = str.replace(/=/, '==');
            arr = str.split('==');
            queryJson[arr[0]] = arr[1] ? arr[1] : ''
        })
    }

    return queryJson
}

// 获取相应参数
export function getUrlQuery(key) {
    const queryJson = parseUrlQuery()

    return queryJson[key]
}

// 添加相应参数
export function setUrlQuery(key, value, isDelete) {
    const queryJson = parseUrlQuery()

    let {hash,origin,pathname} = window.location

    if(isDelete){
        delete queryJson[key]
    } else {
        queryJson[key] = value
    }

    let newSearch = Object.entries(queryJson).map(([key, value]) => {
        return `${key}=${value}`
    }).join('&')

    if(newSearch) newSearch = '?' + newSearch

    window.history.replaceState({}, '', origin + pathname + newSearch + hash.split('?')[0]);
}
