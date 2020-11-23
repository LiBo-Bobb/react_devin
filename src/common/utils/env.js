export const isNode = typeof window === 'undefined'

export const isClient = !isNode


let navigator

try {
    navigator = window.navigator
} catch (e) {
    navigator = {}
}
export const isHuaZhuApp = /huazhu/i.test(navigator.userAgent) && !window.ETone
export const isIos = /ios|iphone|ipad|ipod/i.test(navigator.userAgent)

export const isAndroid = /android/i.test(navigator.userAgent)

export const isWeixin = /MicroMessenger/i.test(navigator.userAgent)

// 小程序环境异步获取
export const isMiniProgramPromise = new Promise((resolve, reject) => {
    try {
        const wx = window.wx
        wx.miniProgram.getEnv((res) => {
            resolve(res.miniprogram)
        })
    } catch (e) {
        // reject(e)
    }
});

// isMiniProgramPromise.then((is)=>{
//     if(is){
//         window.wx.miniProgram.postMessage({
//             data: {
//                 shareInfo
//             }
//         })
//     }
// })


// 判断当前是否在小程序环境
export const isMiniProgramSync = (window.__wxjs_environment === 'miniprogram' || window.navigator.userAgent.toLowerCase().includes('miniprogram'))


