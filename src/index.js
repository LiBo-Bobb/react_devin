import React from 'react';
import {render,} from 'react-dom';
import {Redux} from './common/redux'
import {Router} from './common/router'

import App from './pages/App/index'

const Root = (
    <Redux>
        <Router mode='hash'>
           <App/>
        </Router>
    </Redux>
)

render(Root, document.getElementById('root'))
