import {spawn, fork} from 'redux-saga/effects'
// DOC  根saga
import appSaga from "../../pages/App/model/effects";
//DOC 同步saga
//import homeSaga from '../../pages/Home/model/effects'
export const syncSagas = {
    //homeSaga
}


export function getRootSagas() {
    return function* rootSagas() {

        yield fork(appSaga)

        let sagas = Object.values(syncSagas)

        for (let saga of sagas) {
            yield spawn(saga)
        }
    }
}