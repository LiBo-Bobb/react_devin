export const ROUTE_HOME = '@@ROUTE_HOME'
export const INIT_HOME_DONE = '@@INIT_HOME_DONE'


// 首页挂载
export function routeHome() {
    return {
        type: ROUTE_HOME
    }
}

// 初始化首页完成
export function initHomeDone() {
    return {
        type: INIT_HOME_DONE
    }
}