import React, {PureComponent} from 'react';
import {connect} from 'react-redux'
// import Swiper from 'react-id-swiper'
import {Helmet} from "react-helmet";
import './index.scss';
// import {Link} from '../../common/router'

import lazyRedux from '../../common/redux/lazyRedux'
import saga from './model/effects'
import reducer from './model/reducers'
import {routeMember} from './model/actions'
import {showModal} from '../App/model/actions'


const mapState = (state) => ({
    // banner: state.home.banner,
})

const mapDispatch = {
    routeMember,
    showModal
}

const mapDependence = {
    'member': {
        reducer,
        saga
    }
}

@lazyRedux(mapDependence)
@connect(mapState, mapDispatch)
class Member extends PureComponent {
    constructor(props) {
        super();
        const {routeMember} = props
        routeMember()
        this.state = {}
    }
    render() {
        return <div className="homePage">
            <Helmet>
                <title>会员中心</title>
            </Helmet>
            <div className="content">
                this is memberPage!
            </div>
        </div>
    }
}


export default Member;

