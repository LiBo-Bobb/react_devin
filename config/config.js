const path = require('path');
// 获取年
// const getYear = () => new Date().getFullYear()

// 获取当前路径
const getDir = () => {
    let url = path.join(__dirname, '../')
    let arr = []
    if (url.indexOf('/') > -1) {
        url.split('/').forEach(item => item && arr.unshift(item))
    } else {
        url.split(':')[1].split('\\').forEach(item => item && arr.unshift(item))
    }
    return arr[0]
}

const config = {
    name: `${getDir()}`,
    cdn: './',
    // CSS 单位模式 viewport or rem
    cssMode: 'viewport',
    design: {
        // 用于 viewport
        viewportWidth: 375,
        rootValue: 16,
        toRem: true,
        toViewport: true
    }
}

module.exports = config;