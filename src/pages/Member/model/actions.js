export const ROUTE_MEMBER = '@@ROUTE_MEMBER'
export const INIT_MEMBER_DONE = '@@INIT_MEMBER_DONE'


// 首页挂载
export function routeMember() {
    return {
        type: ROUTE_MEMBER
    }
}

// 初始化首页完成
export function initMemberDone() {
    return {
        type: INIT_MEMBER_DONE
    }
}