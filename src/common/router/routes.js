import Home from '../../pages/Home'
import Member from '../../pages/Member'
export const routes = {
    '/': {
        component: Home,
        exact: true
    },
    '/member': {
        component: Member,
        exact: true
    },
}