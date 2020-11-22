import React, {PureComponent} from 'react';
import './app.scss'
// import ScrollWrap from './common/components/ScrollWrap'
// import {widthScrollWrap} from './common/components/ScrollWrap'/

// @widthScrollWrap()
class App extends PureComponent {
    constructor(props) {
        super();
        // console.log("props...",props)
    }
    render() {
        return <div className="App">
            <div className="test">1231231
                <div className="test2">1231231</div>
            </div>
        </div>
    }
}

export default App;
