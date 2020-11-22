// 微信分享 && 华住app分享

import {isWeixin, isMiniProgramPromise, isHuaZhuApp, isAndroid, isIos} from "./env";

export default function share(options,shareSuccess) {
    try {
        if (isWeixin) {
            weixinShare(options,shareSuccess)
        } else if (isHuaZhuApp) {
            huazhuAppShare(options,shareSuccess)
        }
    } catch (e) {
        console.log('HzShare Error :' + e)
    }
}

// 微信分享
function weixinShare(options, shareSuccess) {
    const wx = window.wx

    // 获取权限
    ajax({
        url: "https://newactivity.huazhu.com/wechat/share",
        jsonp: 'callback',
        data: {
            url: window.location.href
        },
        async: false,
        success(data) {
            if (data.success) {
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.data.appId, // 必填，公众号的唯一标识
                    timestamp: data.data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.data.noncestr, // 必填，生成签名的随机串
                    signature: data.data.signature, // 必填，签名，见附录1
                    jsApiList: ["onMenuShareAppMessage", "onMenuShareTimeline"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
            }
        }
    })

    // 调用
    wx.ready(() => {
        // 分享好友
        wx.onMenuShareAppMessage({
            title: options.title, // 分享标题
            desc: options.desc, // 分享描述
            link: options.link, // 分享链接
            imgUrl: options.imgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success() {
                shareSuccess && shareSuccess();
                // 用户分享成功后执行的回调函数
            },
            cancel() {
                // 用户取消分享后执行的回调函数
            }
        });

        // 分享朋友圈
        wx.onMenuShareTimeline({
            title: options.title, // 分享标题
            link: options.link, // 分享链接
            imgUrl: options.imgUrl, // 分享图标
            success() {
                shareSuccess && shareSuccess();
                // 用户分享成功后执行的回调函数
            },
            cancel() {
                // 用户取消分享后执行的回调函数
            }
        });

        // 小程序分享
        isMiniProgramPromise.then((is)=>{
            if(is && !window.location.href.includes('bonus')){
                wx.miniProgram.postMessage({
                    data: {
                        shareInfo:options
                    }
                })
            }
        })
    })
}
window.share = function(){
    console.log('分享成功')
    window.shareSuccess && window.shareSuccess()
}

// 华住app分享
function huazhuAppShare(options) {
    if (navigator.userAgent.toLowerCase().indexOf("huazhu") > -1) {
        if (navigator.userAgent.toLowerCase().indexOf("ios") > -1) {
            if (window.bridge) {
                window.bridge._handleMessageFromObjC = window.share
                window.bridge.send({
                    "title": "分享",
                    "callback": "share",
                    "shareUrl": options.link,
                    "shareTitle": options.title,
                    "shareImageUrl": options.imgUrl,
                    "shareDescription": options.desc
                }, false);
            } else {
                document.addEventListener('WebViewJavascriptBridgeReady', function (event) {
                    console.log('第二种')
                    var bridge = event.bridge;
                    console.log(bridge)
                    bridge._handleMessageFromObjC = window.share
                    bridge.send({
                        "title": "分享",
                        "callback": "share",
                        "shareUrl": options.link,
                        "shareTitle": options.title,
                        "shareImageUrl": options.imgUrl,
                        "shareDescription": options.desc
                    });
                });
            }
        }
        if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
            window.handler && window.handler.show && window.handler.show(options.title, options.imgUrl, options.desc, options.link, "share");
        }
    }
}

// 简单ajax jsonp实现 去除jquery依赖
function ajax(params) {
    params = params || {};
    params.data = params.data || {};
    jsonp(params)

    // jsonp请求
    function jsonp(params) {

        //创建script标签并加入到页面中
        const callbackName = params.jsonp;
        const head = document.getElementsByTagName('head')[0];
        // 设置传递给后台的回调参数名
        params.data['callback'] = callbackName;
        const data = formatParams(params.data);
        const script = document.createElement('script');
        head.appendChild(script);

        //创建jsonp回调函数
        window[callbackName] = function (json) {
            head.removeChild(script);
            clearTimeout(script.timer);
            window[callbackName] = null;
            params.success && params.success(json);
        };

        //发送请求
        script.src = params.url + '?' + data;

        //为了得知此次请求是否成功，设置超时处理
        if (params.time) {
            script.timer = setTimeout(function () {
                window[callbackName] = null;
                head.removeChild(script);
                params.error && params.error({
                    message: '超时'
                });
            }, params.time);
        }
    }

    //格式化参数
    function formatParams(data) {
        const arr = [];
        for (let name in data) {
            arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
        }

        // 添加一个随机数，防止缓存
        arr.push('v=' + random());
        return arr.join('&');
    }

    // 获取随机数
    function random() {
        return Math.floor(Math.random() * 10000 + 500);
    }
}