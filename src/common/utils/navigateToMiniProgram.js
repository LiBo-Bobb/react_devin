/**
 * 跳转小程序原生
 * @param param    {url:""}
 * @param redirect 是否使用redirectTo
 * @returns {*}
 */
export function navigateToMiniProgram(param, redirect) {
    //需要用switchTab跳转的链接
    const switchTabUrls = [
        '/pages/search/search',
        '/pages/my/my'
    ]
    try {
        const wx = window.wx
        if (switchTabUrls.some(url => param.url.includes(url))) {
            return wx.miniProgram.switchTab(param)
        }
        if (redirect) {
            wx.miniProgram.redirectTo(param)
        } else {
            wx.miniProgram.navigateTo(param)
        }
    } catch (e) {
        alert('navigateToMiniProgram Error :' + e)
    }
}


// 跳转小程序webview
export function navigateToMiniProgramWebview(link, redirect) {
    if (verifyMiniProgramUrl(link)) {
        let param = {
            url: `/pages/webview/webview?src=${encodeURIComponent(link)}`
        };
        navigateToMiniProgram(param, redirect)
    } else {
        alert('小程序中暂不支持跳转该域名')
    }
}

// 因小程序需要验证有效域名 这里提前做判断
function verifyMiniProgramUrl(url) {
    return true
    // let domainList = [
    //     'https://newactivity.huazhu.com',
    //     'https://campaign.huazhu.com',
    //     'https://m.huazhu.com',
    //     'https://hmall.huazhu.com',
    //     'http://10.105.16.50',
    //     'https://test-newactivity.huazhu.com',
    //     'http://dev.huazhu.com',
    // ];
    //
    // let domain = url.match(/http(s)?:\/\/([^/]+)/i)
    //
    // domain = domain?domain[0]:'';
    //
    // if(domainList.indexOf(domain) !== -1){
    //     return true
    // }
}