import React, {Component} from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'
import {store} from './index'

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

// 懒加载redux  ,每次页面加载的时候，才会加载当前页面的redux
const withLazyRedux = (dependence) => WrappedComponent => {
    class ComponentWithLazyRedux extends Component {
        constructor(props) {
            super();
            this.state = {
                display: false,
            }
            this.dependence = dependence ? Object.entries(dependence) : []

            const {length} = this.dependence

            if (!length) return

            if (!store) {
                throw new Error(`Could not find "store".`)
            }
            this.dependence.forEach(([key, value], index) => {
                let {reducer, saga} = value
                let replace = false
                if (index === length - 1) {
                    replace = true
                }
                store.addReducer(key, reducer, replace)
                store.addSaga(key, saga)
            })
            this.state.display = true
        }

        render() {
            return this.state.display ? <WrappedComponent {...this.props} /> : null
        }
    }

    ComponentWithLazyRedux.displayName = `withLazyRedux(${getDisplayName(WrappedComponent)})`
    // 复制原组件上面的静态方法
    hoistNonReactStatic(ComponentWithLazyRedux, WrappedComponent)
    return ComponentWithLazyRedux
}

export default withLazyRedux