import React, {PureComponent} from 'react';
import {Helmet} from "react-helmet";
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
//全局样式
import './index.scss';
// loading 组件
import Loading from '../../common/components/Loading'
import {hideModal,} from './model/actions'

const mapState = (state) => {
    return {
        showToast: state.app.showToast,
        showLoading: state.app.showLoading,
        showModalEl: state.app.showModalEl,
        toastMsg: state.app.toastMsg,
        modalMsg: state.app.modalMsg,
        showModalToast: state.app.showModalToast,
    }
}

const mapDispatch = {
    hideModal,
}
@withRouter
@connect(mapState, mapDispatch)
class App extends PureComponent {
    constructor(props) {
        super()
        // console.log("proops...",props)
    }

    // 底部tabbar
    renderNavbar() {
        const {location: {pathname}, history} = this.props
        console.log("proops...",this.props)
        console.log("pathname....",pathname)
        const needNavbarList = ['/', '/member',]
        let showNavBar = needNavbarList.indexOf(pathname) !== -1
        return (
            <div className={'navbar' + (showNavBar ? ' show' : '')}>
                <div
                    className={'item tohome' + (pathname === '/' ? ' active' : '')}
                    onClick={() => {
                        if (pathname !== '/') {
                            history.replace('/')
                        }
                    }}
                >
                    酒店
                </div>
                <div className="line"/>
                <div className={'item totask' + ((pathname.split('/')[1] === 'member') ? ' active' : '')}
                     onClick={() => {
                         if ((pathname.split('/')[1] !== 'member')) {
                             history.replace('/member')
                         }
                     }}
                >
                    会员
                </div>
                <div className="line"/>
                <div className={'item tolog' + (pathname === '/' ? ' active' : '')}
                     onClick={() => {
                         if (pathname !== '/') {
                             history.replace('/')
                         }
                     }}
                >
                    我的
                </div>
            </div>
        )
    }

    // 全局toast
    renderToast() {
        const {showToast, toastMsg} = this.props
        return (
            <div className={'toast' + (showToast ? ' show' : '')}>{toastMsg}</div>
        )
    }

    // 全局modal
    renderModal() {
        const {showModalEl, modalMsg, hideModal} = this.props
        return (
            <div className={'modal' + (showModalEl ? ' show' : '')}>
                <div className='mask' onClick={() => {
                    hideModal()
                }}/>
                <div className='modalInner'>{modalMsg}</div>
            </div>
        )
    }

    ShowModalToast = () => {
        let {showModalToast} = this.props;
        return showModalToast
            ? <div>
                <div className="commit-status">
                    <div className="icon"></div>
                    <span>复制成功</span>
                </div>
            </div>
            : null
    }

    render() {
        const {showLoading} = this.props
        return (
            <div className="app">
                <Helmet>
                    <title>指北生活</title>
                </Helmet>
                {this.props.children}
                {this.renderToast()}
                {this.renderModal()}
                {this.renderNavbar()}
                {this.ShowModalToast()}
                {showLoading && <Loading delay={true}/>}
            </div>
        );
    }


}

export default App;
