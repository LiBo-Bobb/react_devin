const curEnv = process.env.REACT_APP_ENV;

// 默认生产环境
let apis = {
    api: "https://frontend.northlife.com.cn",
}

if (curEnv === "production") {
    // 生产环境
    apis = {
        api: "https://frontend.northlife.com.cn",
    }
} else if (curEnv === "preview") {
    //预发布环境
    apis = {
        api: "http://frontend.pre.northlife.com.cn",
    }
} else if (curEnv === "dev") {
    // k82 test 环境
    apis = {
        api: "http://frontend.testk8s.northlife.com.cn",
    }
} else if (curEnv === "fat") {
    // k82 test 环境
    apis = {
        api: "http://frontend.fat.northlife.com.cn",
    }
} else if (curEnv === "uat") {
    // k82 test 环境
    apis = {
        api: "http://frontend.uat.northlife.com.cn",
    }
}

export {
    curEnv,
    apis
}


export const api = apis.api;