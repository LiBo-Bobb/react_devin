import React, {PureComponent, createContext} from 'react'
import './ScrollWrap.scss'
// import {
//     createHashHistory,
//     createBrowserHistory,
//     createMemoryHistory
// } from 'history'
export const ScrollContent = createContext({
    scrollTop: 0,
    scrollHeight: 0,
    scrollWrapHeight: 0,
    scrollWrapRef: null
})

//WidthScrollWrap
export const widthScrollWrap = () => WrappedComponent => {
    class ComponentWidthScrollWrap extends PureComponent {
        render() {
            return <ScrollContent.Consumer>
                {
                    (scrollContentValue) =>
                        <WrappedComponent {...this.props} {...scrollContentValue}></WrappedComponent>
                }
            </ScrollContent.Consumer>
        }
    }

    ComponentWidthScrollWrap.displayName = `widthScrollWrap(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
    return ComponentWidthScrollWrap
}

export default class ScrollWrap extends PureComponent {
    constructor(props) {
        super()
        this.timer = null;
        this.state = {
            showToTop: false,// 显示置顶按钮
            scrollTop: 0,// 滚动的距离
            scrollHeight: 0,// 可滚动的距离
            scrollWrapHeight: 0,
        }
        this.scrollWrapRef = React.createRef()
    }

    componentDidMount() {
    }

    componentDidMount() {
        const {scrollWrapRef: {current: scrollEl}} = this
        const {scrollTop: st, scrollHeight: sh, offsetHeight: oh} = scrollEl
        this.setState({
            scrollTop: st,
            scrollHeight: sh,
            scrollWrapHeight: oh
        })

    }


    onScroll = () => {
        const {showToTopHeight = 500, loadMoreHeight = 500, onScrollToBottom} = this.props;
        const {showToTop} = this.state
        const {scrollWrapRef: {current: scrollEl}} = this
        const {scrollTop: st, scrollHeight: sh, offsetHeight: oh} = scrollEl
        let isShowToTop = showToTop

        if (st > showToTopHeight && !showToTop) {
            isShowToTop = true
        }
        if (st <= showToTopHeight && showToTop) {
            isShowToTop = false
        }
        // console.log("sh - st - oh...",sh - st - oh)
        if (onScrollToBottom) {
            // 可滚动距离小于等于100px 时，开始分页加载
            if (sh - st - oh <= loadMoreHeight) {
                onScrollToBottom()
            }
        }
        this.setState({
            showToTop: isShowToTop,
            scrollTop: st,
            scrollHeight: sh,
            scrollWrapHeight: oh
        })

    }

    render() {
        const {children, showFloatBar = true, showToHome = true, float} = this.props
        const {showToTop, scrollTop, scrollHeight, scrollWrapHeight} = this.state
        return <div className="scrollWrap" onScroll={this.onScroll} ref={this.scrollWrapRef}>
            <ScrollContent.Provider
                value={{scrollTop, scrollHeight, scrollWrapHeight, scrollWrapRef: this.scrollWrapRef}}>
                {children}
            </ScrollContent.Provider>
        </div>
    }


}

