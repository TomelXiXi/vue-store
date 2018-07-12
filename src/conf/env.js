/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 *
 */
let baseUrl = 'http://localhost:9100';
let routerMode = 'hash';

if(process.env.NODE_ENV == 'production'){  // 正式环境的域名
    baseUrl = 'http://10.0.1.68:9100';
    
}

export {
    baseUrl,
    routerMode,
}