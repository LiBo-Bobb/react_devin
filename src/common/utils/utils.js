/**
 * 转换两位数字为小数，如88->8.8
 * @param num
 */
// import {isAndroid, isHuaZhuApp, isMiniProgramPromise, isMiniProgramSync, isWeixin} from "./env";

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

