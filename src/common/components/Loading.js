import React, {PureComponent} from 'react';
import './Loading.scss'

// 提供延迟显示组件的高阶函数 常用于loading的防止闪烁

// widthDelayComponent
export const widthDelayComponent = (defaultDelay = 200) => WrappedComponent => {

    class ComponentWidthDelay extends PureComponent {
        constructor({delay = false}) {
            super()

            this.state = {
                show: true,
                delay
            }

            this.timer = null
        }

        componentDidMount() {
            const {delay, time = defaultDelay} = this.props
            if (delay) {
                this.timer = setTimeout(() => {
                    this.setState({
                        delay: false
                    })
                }, time)
            }
        }

        componentWillUnmount() {
            clearTimeout(this.timer)
        }

        render() {
            const {show, delay} = this.state

            return !show || delay ? null : <WrappedComponent {...this.props}/>
        }
    }

    ComponentWidthDelay.displayName = `widthDelay(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

    return ComponentWidthDelay
}

@widthDelayComponent()
class Loading extends PureComponent {
    render() {
        return (
            <div className="loading">
                <div className="loading-icon"/>
            </div>
        );
    }
}

export default Loading


