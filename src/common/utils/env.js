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
export const isMiniProgramPromise = new Promise((resolve,reject)=>{
    try {
        const wx = window.wx
        wx.miniProgram.getEnv((res)=>{
            resolve(res.miniprogram)
        })
    } catch (e) {
        // reject(e)
    }
});

export const isMiniProgramSync = (window.__wxjs_environment === 'miniprogram' || window.navigator.userAgent.toLowerCase().includes('miniprogram'))

export const afterVersion = function afterVersion(version) {
    // version格式大版本例如为7.6，小版本例如为7.6.1
    var appversionReg = /\d+\.\d+\.?\d{0,3}/;
    try {
        if (!version) {
            throw new Error('请输入指定版本');
        } else {
            if (!appversionReg.test(version)) {
                throw new Error('版本格式错误');
            }
        }
    } catch (error) {
        return false;
    }
    try {

        var useragents = navigator.userAgent.split('/');
        var appVerall = useragents[4].match(appversionReg)[0];
        var appVer = appVerall.split('.');
        var versions = version.split('.');
        for (var index = 0; index < appVer.length; index++) {
            appVer[index] = parseInt(appVer[index]);
        }
        for (var _index = 0; _index < versions.length; _index++) {
            versions[_index] = parseInt(versions[_index]);
        }
        if (versions.length === 2) {
            if (appVer[0] > versions[0] || appVer[0] === versions[0] && appVer[1] >= versions[1]) {
                return true;
            }
        }
        if (versions.length === 3) {
            if (appVer.length === 2) {
                if (appVer[0] > versions[0] || appVer[0] === versions[0] && appVer[1] > versions[1]) {
                    return true;
                }
            }
            if (appVer.length === 3) {
                if (appVer[0] > versions[0] || appVer[0] === versions[0] && appVer[1] > versions[1] || appVer[0] === versions[0] && appVer[1] === versions[1] && appVer[2] >= versions[2]) {
                    return true;
                }
            }
        }
        return false;
    } catch (error) {
        return false;
    }
};
