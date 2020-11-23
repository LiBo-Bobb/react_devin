import React, {PureComponent} from 'react';
import {connect} from 'react-redux'
// import Swiper from 'react-id-swiper'
import {Helmet} from "react-helmet";
import './index.scss';
// import {Link} from '../../common/router'

import lazyRedux from '../../common/redux/lazyRedux'
import saga from './model/effects'
import reducer from './model/reducers'
import {routeHome} from './model/actions'
import {showModal} from '../App/model/actions'


const mapState = (state) => ({
    // banner: state.home.banner,
})

const mapDispatch = {
    routeHome,
    showModal
}

const mapDependence = {
    'home': {
        reducer,
        saga
    }
}

@lazyRedux(mapDependence)
@connect(mapState, mapDispatch)
class Home extends PureComponent {
    constructor(props) {
        super();
        const {routeHome} = props
        routeHome()
        this.state = {}
    }


    render() {
        return <div className="page page-home">
            <Helmet>
                <title>酒店</title>
            </Helmet>
            <div className="homePage">
                Hello,this is HomePage!
            </div>
            <div className="content">
                homeContent
            </div>
        </div>
    }
}


export default Home;

