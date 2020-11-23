import React from 'react';
import {Router as OriginalRouter, Link as RouterLink, Route} from 'react-router-dom'
import {
    createHashHistory,
    createBrowserHistory,
    createMemoryHistory
} from 'history'

import {isWeixin, isMiniProgramPromise} from '../utils/env'
import {navigateToMiniProgram, navigateToMiniProgramWebview} from '../utils/navigateToMiniProgram'

// 路由列表
import {routes} from './routes'

let history, routeTree = {}

//TODO: DOC　 路由书调整
window.routeTree = routeTree

export const RouteList = ({routes, base = ''}) => {
    return Reflect.ownKeys(routes).map((routePath) => {
        // console.log("routePath...",routePath)
        let {component, exact, routes: subRoutes} = routes[routePath]

        routeTree[routePath] = 'component'
        let path = base + routePath

        if (!component && subRoutes) {
            return (
                <Route
                    key={path}
                    exact={exact}
                    path={path}
                    children={<RouteList base={path} routes={subRoutes}/>}
                />
            )
        } else {
            return (
                <Route
                    key={path}
                    exact={exact}
                    path={path}
                    component={component}
                />
            )
        }
    })
}

// 自定义路由组件
const Router = (props) => {
    const {children, mode, location} = props
    let Root = (<RouteList routes={routes}/>)
    if (children && React.isValidElement(children)) {
        Root = React.cloneElement(children, {
            children: <RouteList routes={routes}/>
        })
    }

    if (mode === 'static') {
        history = createMemoryHistory({
            initialEntries: [location]
        })
    } else if (mode === 'browser') {
        history = createBrowserHistory();
    } else {
        history = createHashHistory();
    }

    enhancerHistory(history)

    return (
        <OriginalRouter history={history}>
            {Root}
        </OriginalRouter>
    )
}

// 增加history的功能
function enhancerHistory(history) {
    const initPathname = history.location.pathname
    let list = history.list = [initPathname]
    history.listen((location, action) => {
        // console.log("location...", location, "action....", action)
        // console.log('location...',location)
        // console.log('action...',action)
        let {pathname} = location
        let {length} = list
        // 路由相同 返回
        if (pathname === list[list.length - 1]) return

        if (action === 'PUSH') {
            list.push(pathname)
        } else if (action === 'REPLACE') {
            list[length - 1] = pathname
        } else if (action === 'POP') {
            let prevPathname = list[length - 2]
            if (prevPathname === pathname) {
                // 后退
                list.pop()
            } else {
                // 前进
                list.push(pathname)
            }
        }
    });
    // 回退所有当前页面内跳转的路由并打开目标页
    history.reLaunch = function reLaunch(path, state) {

        let shouldBlack = -list.length + 1

        if (shouldBlack < 0) history.go(shouldBlack)

        list = history.list = [initPathname]

        if (path !== initPathname) {
            setTimeout(() => {
                history.replace(path, state)
            }, 0)
        }
    }
}


// 实现 Link组件 方便后期切换路由方案
const Link = (props) => {
    const {to, children, reLaunch, onClick, className} = props
    if (/http(s)?:\/{2}|hanting(s)?:\/{2}/.test(to)) {
        // 站外跳转
        return (
            <a href={to} className={className} onClick={(e) => {
                // 阻止默认跳转
                e.preventDefault()
                onClick && onClick()
                // 非微信
                if (!isWeixin) {
                    window.location.href = to
                    return
                }
                // 微信内
                isMiniProgramPromise.then((is) => {
                    if (is) {
                        // 是小程序则走小程序跳转
                        navigateToMiniProgramWebview(to)
                    } else {
                        // 不是则直接跳转
                        window.location.href = to
                    }
                })
            }}>{children}</a>
        )
    } else if (/\/pages\//.test(to)) {
        return <a href={to} className={className} onClick={(e) => {
            // 阻止默认跳转
            e.preventDefault()
            onClick && onClick()
            navigateToMiniProgram({
                url: to
            })
        }}>{children}</a>

    } else if (reLaunch) {
        // 站内reLaunch跳转
        return (
            <a href={to} onClick={(e) => {
                // 阻止默认跳转
                e.preventDefault()
                history.reLaunch(to)
            }}>{children}</a>
        )
    }
    return <RouterLink {...props}/>
}

export {
    Router,
    history,
    routeTree,
    Link
}