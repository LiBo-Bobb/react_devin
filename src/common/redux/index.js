import React from 'react'
import {Provider} from 'react-redux'
import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
//引入reducer
import {reducers as syncReducers} from './reducers'
// redux-saga
import createSagaMiddleware, {END} from 'redux-saga'
import {getRootSagas} from './sagas'
//调试 在测试环境生效
import {devToolsEnhancer} from 'redux-devtools-extension/developmentOnly'
let store
// 初始状态
let initialState = {}

// redux 中间件
//DOC todo 添加路由回溯 https://github.com/supasate/connected-react-router
const sagaMiddleware = createSagaMiddleware()
const middleware = [sagaMiddleware]
// redux 增强
const enhancers = [devToolsEnhancer()]

function getNewStore(middleware, enhancers) {
    let newStore = createStore(
        combineReducers({
            ...syncReducers,
        }),
        initialState,
        compose(
            applyMiddleware(...middleware),
            ...enhancers
        )
    )
    enhancerStore(newStore)
    return newStore
}
// store 增强器
function enhancerStore(store) {
    // 运行saga 并提供访问
    store.rootSage = sagaMiddleware.run(getRootSagas())
    // 添加关闭saga方法
    store.closeSaga = () => {
        store.dispatch(END)
    }
    // 储存reducers 与 asyncSagas
    store.asyncReducers = {}
    store.asyncSagas = {}

    // 添加reducer方法
    store.addReducer = (key, reducer, replace = true) => {
        if (store.asyncReducers.hasOwnProperty(key)) return;
        store.asyncReducers[key] = reducer;

        // 避免 多次替换。
        if (!replace) return
        let newReducer = combineReducers({
            ...syncReducers,
            ...store.asyncReducers
        })
        store.replaceReducer(newReducer);
    }

    // 添加saga方法
    store.addSaga = (key, saga) => {
        key = `${key}Saga`

        if (store.asyncSagas.hasOwnProperty(key)) return;

        store.asyncSagas[key] = saga;

        store.rootSage = sagaMiddleware.run(saga);
    }
}

// Redux 组件
const Redux = ({children, restart = true}) => {
    if (restart) {
        store = getNewStore(middleware, enhancers)
    }

    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export {
    Redux,
    store
}