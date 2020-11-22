/**
 * 转换两位数字为小数，如88->8.8
 * @param num
 */
import {isAndroid, isHuaZhuApp, isMiniProgramPromise, isMiniProgramSync, isWeixin} from "./env";

export const transNumber2Decimal = num => {
    try{
        if (!num) return 0
        num = num.toString()
        if(num.endsWith('.0'))return parseInt(num)
        if (num.includes('.')) return num
        if (num.length === 1) {
            num = num + ''
        }
        if(parseInt(num) % 10 === 0){
            return num.split('')[0]
        }
        return num.split('').join('.')
    }catch(e){
        return num
    }
}


export function transTime(time) {
    let t;
    try {
        t = time.split(' ')[0].replace(/-/g, '.')
        return t
    } catch (e) {
        return time
    }
}

/**
 *
 * @param pageid 页面id
 * @param trackType click/pv
 * @param paras
 * @param eventId eventKey
 * @returns {{eventId, SourceID: string, trackType, language: string, paras, pageid, network: string, GroupId: string}}
 */
export function getRecordParams({pageid, trackType,paras,eventId}={}) {
    let UAConnection = navigator.connection;
    let networkStatus='';
    if(UAConnection){
        networkStatus = {
            downlink: UAConnection.downlink,
            downlinkMax: UAConnection.downlinkMax,
            effectiveType:UAConnection.effectiveType,
            type: UAConnection.type,
        }
    }

    let UAArr=navigator.userAgent.split('/');
    let UAData = {
        language:navigator.languages?navigator.languages.join(','):navigator.language,
        network:networkStatus,
        trackType,
        SourceID:'activity',
        GroupId:'H5'
    };
    let msg={
        pageid,
        eventId,
        paras
    }
    UAData.msg = msg
    if(isHuaZhuApp){
        UAData.model = UAArr[2]
        UAData.ver = UAArr[4]
    }else if (isMiniProgramSync){
        UAData.model = UAArr[1]
    }else{
        UAData.model = UAArr[1]
    }
    return UAData
}
