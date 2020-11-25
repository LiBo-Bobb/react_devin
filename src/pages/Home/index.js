import React, {PureComponent} from 'react';
import {connect} from 'react-redux'
import {Helmet} from "react-helmet";
import './index.scss';
import lazyRedux from '../../common/redux/lazyRedux'
import saga from './model/effects'
import reducer from './model/reducers'
import {routeHome, getHotelList} from './model/actions'
import {showModal} from '../App/model/actions'


const mapState = (state) => ({
    // banner: state.home.banner,
})

const mapDispatch = {
    routeHome,
    showModal,
    getHotelList,
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

    //
    getHotelList = () => {
        const {getHotelList} = this.props;
        getHotelList()
    }

    render() {
        return <div className="page page-home">
            <Helmet>
                <title>酒店</title>
            </Helmet>
            <div className="homePage">
                Hello,this is HomePage!
                <button onClick={this.getHotelList}>获取酒店列表</button>
            </div>
            <div className="content">
                homeContent
            </div>
        </div>
    }
}


export default Home;

