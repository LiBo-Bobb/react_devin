import {isWeixin, isMiniProgramPromise, isHuaZhuApp} from './env'
import {navigateToMiniProgramWebview} from './navigateToMiniProgram'

export default function login(arg) {
    const {loginUrl,fingerPrint} = arg

    if(!loginUrl || !fingerPrint) {
        console.log('缺少登陆参数')
        return
    }


    try {
        let loginAction, query = ''
        let to = '?to=' + encodeURIComponent(window.location.href) + '&fp=' + fingerPrint

        // 非微信逻辑
        if (!isWeixin) {
            if (isHuaZhuApp) {
                loginAction = '/login'
                query = '&has_video=true&APP_NeedLoginInfo=True'
            } else {
                loginAction = '/login'
            }
            window.location.href = loginUrl + loginAction + to + query
            return
        }

        // 微信内登陆
        isMiniProgramPromise.then((is)=>{
            if(is){
                loginAction = '/miniLogin'
                query = '&MiniNeedLogin=true'
                navigateToMiniProgramWebview(loginUrl + loginAction + to + query,true)
            } else {
                loginAction = '/login'
                window.location.href = loginUrl + loginAction + to + query
            }
        })
    } catch (e) {

    }
}
