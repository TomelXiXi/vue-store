import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: () => import('@/views/form/article-publish/preview.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/views/home/home.vue') },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: () => import('@/views/own-space/own-space.vue') },
        { path: 'order/:order_id', title: '订单详情', name: 'order-info', component: () => import('@/views/advanced-router/component/order-info.vue') }, // 用于展示动态路由
        { path: 'shopping', title: '购物详情', name: 'shopping', component: () => import('@/views/advanced-router/component/shopping-info.vue') }, // 用于展示带参路由
        { path: 'message', title: '消息中心', name: 'message_index', component: () => import('@/views/message/message.vue') },
        { path: 'addProduct', title: '新增商品', name: 'addProduct', component: () => import('@/views/product/product/add-product.vue') },//新增product以及sku
        { path: 'addProductSku', title: '新增商品sku', name: 'addProductSku', component: () => import('@/views/product/product/add-productSku.vue') },//通过现有product创建sku
        { path: 'addVirtuaProperty', title: '新增虚拟属性', name: 'addVirtuaProperty', component: () => import('@/views/product/virtuaProperty/add-virtuaProperty.vue') },//新增虚拟商品属性
        { path: 'addSku', title: '增加商品sku', name: 'addSku', component: () => import('@/views/product/sku/add-sku.vue') },//新增商品sku
        { path: 'editSku', title: '修改商品sku', name: 'editSku', component: () => import('@/views/product/sku/edit-sku.vue') },//修改商品sku
        { path: 'addComboSku', title: '创建组合商品', name: 'addComboSku', component: () => import('@/views/product/comboSku/add-comboSku.vue') },//新增商品sku
        { path: 'addSkuConf', title: '配置商品上架', name: 'addSkuConf', component: () => import('@/views/sku-conf/add-skuConf.vue') },//新增商品sku
        { path: 'addCoupon', title: '新增优惠券', name: 'addCoupon', component: () => import('@/views/coupon/addCoupon.vue') },//新增优惠券
        { path: 'addPopup', title: '新增配置信息', name: 'addPopup', component: () => import('@/views/sku-conf/addPopup.vue') },//新增配置信息
        { path: 'updateCover', title: '更新配置信息', name: 'updateCover', component: () => import('@/views/book/cover-update.vue') },//更新封面
        { path: 'editHomePage', title: '更新首页', name: 'editHomePage', component: () => import('@/views/book/editHomePage.vue') },//更改封面
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/product',
        icon: 'briefcase',
        title: '商品管理',
        name: 'productManage',
        component: Main,
        children: [
            { path: 'productList',icon: 'bag', title: '商品信息', name: 'productList', component: () => import('@/views/product/product/product.vue') },
            { path: 'virtuaPropertyList', icon: 'social-buffer',title: '虚拟商品属性', name: 'virtuaPropertyList', component: () => import('@/views/product/virtuaProperty/virtuaProperty.vue') },
            { path: 'sku', icon: 'gear-b',title: '商品sku', name: 'sku', component: () => import('@/views/product/sku/sku.vue')},
            { path: 'comboSku', icon: 'cube',title: '组合商品', name: 'comboSku', component: () => import('@/views/product/comboSku/comboSku.vue')}
        ]
    },
    {
        path: '/skuConfManage',
        icon: 'arrow-swap',
        title: '商品上下架',
        name: 'skuConfManage',
        component: Main,
        children: [
            { path: 'skuConf',icon: 'arrow-swap', title: '商品上下架', name: 'skuConf', component: () => import('@/views/sku-conf/skuConf.vue') },
        ]
    },
    {
        path: '/orderManage',
        icon: 'ios-list-outline',
        title: '订单管理',
        name: 'orderManage',
        component: Main,
        children: [
            { path: 'orderList',icon: 'bag', title: '订单信息管理', name: 'orderList', component: () => import('@/views/order/orderFind.vue') },
            /*{ path: 'orderManger',icon: 'bag', title: '订单处理', name: 'orderManager', component: () => import('@/views/order/orderFind.vue') },*/
        ]
    },
    {
        path: '/points',
        icon: 'ios-pie',
        title: '积分及优惠券',
        name: 'pointsManage',
        component: Main,
        children: [
            { path: 'pointsConf',icon: 'ios-color-filter', title: '积分管理', name: 'pointsConf', component: () => import('@/views/points/points-rate.vue') },
           { path: 'coupon',icon: 'card', title: '优惠券管理', name: 'coupon', component: () => import('@/views/coupon/coupon.vue') },
           /* { path: 'givePoints',icon: 'plus-round', title: '用户积分发放', name: 'givePoints', component: () => import('@/views/points/points-rate.vue') },*/
        ]
    },
/*    {
        path: '/couponManage',
        icon: 'card',
        title: '优惠券管理',
        name: 'couponManage',
        component: Main,
        children: [
            
        ]
    },*/
    {
        path: '/popupManage',
        icon: 'ios-bookmarks',
        title: '属性及配置',
        name: 'popupManage',
        component: Main,
        children: [
            { path: 'popup',icon: 'speakerphone', title: '配置信息', name: 'popup', component: () => import('@/views/sku-conf/popup.vue') },
            { path: 'type',icon: 'android-list', title: '商品属性', name: 'type', component: () => import('@/views/type/type.vue') },
            { path: 'chooseOption',icon: 'ios-world-outline', title: '系统属性', name: 'chooseOption', component: () => import('@/views/type/chooseOption.vue') },
        ]
    },
    {
        path: '/bookManage',
        icon: 'ios-bookmarks',
        title: '绘本管理',
        name: 'bookManage',
        component: Main,
        children: [
            { path: 'adPage',icon: 'speakerphone', title: '广告页管理', name: 'ad', component: () => import('@/views/book/ad-page.vue') },
            { path: 'detailPage',icon: 'android-list', title: '详情页管理', name: 'detail', component: () => import('@/views/book/detail-page.vue') },
            { path: 'homePage',icon: 'ios-world-outline', title: '首页管理', name: 'homePage', component: () => import('@/views/book/home-page.vue') },
            { path: 'homePageCategory',icon: 'ios-world-outline', title: '首页目录', name: 'homePageCategory', component: () => import('@/views/book/homePageCategory.vue') },
            { path: 'bannerDetail',icon: 'ios-world-outline', title: 'banner页详情', name: 'bannerDetail', component: () => import('@/views/book/bannerDetail.vue') },
        ]
    },
/*    {
        path: '/typeManage',
        icon: 'android-list',
        title: '属性管理',
        name: 'typeManage',
        component: Main,
        children: [
            
        ]
    },*/
/*    {
        path: '/points',
        //icon: 'android-sad',
        title: '积分管理',
        name: 'pointsMange',
        component: Main,
        children: [
            { path: 'user_points', title: '用户积分管理', name: 'user_points', component: () => import('@/views/advanced-router/mutative-router.vue') },
            { path: 'points_log', title: '积分收支统计', name: 'points_log', component: () => import('@/views/advanced-router/argument-page.vue') },
            { path: 'points_conf', title: '积分兑换管理', name: 'points_conf', component: () => import('@/views/advanced-router/argument-page.vue') }
        ]
    },
    {
        path: '/order',
        //icon: 'android-sad',
        title: '订单管理',
        name: 'orderMange',
        component: Main,
        children: [
            { path: 'order_list', title: '订单管理', name: 'order_list', component: () => import('@/views/advanced-router/mutative-router.vue') },
            { path: 'order_char', title: '订单趋势分析', name: 'order_char', component: () => import('@/views/advanced-router/argument-page.vue') }
        ]
    },*/
//   {
//         path: '/access',
//         icon: 'key',
//         name: 'access',
//         title: '权限管理',
//         component: Main,
//         children: [
//             { path: 'index', title: '权限管理', name: 'access_index', component: () => import('@/views/access/access.vue') }
//         ]
//     },
//     {
//         path: '/access-test',
//         icon: 'lock-combination',
//         title: '权限测试页',
//         name: 'accesstest',
//         access: 0,
//         component: Main,
//         children: [
//             { path: 'index', title: '权限测试页', name: 'accesstest_index', access: 0, component: () => import('@/views/access/access-test.vue') }
//         ]
//     },
//     {
//         path: '/international',
//         icon: 'earth',
//         title: {i18n: 'international'},
//         name: 'international',
//         component: Main,
//         children: [
//             { path: 'index', title: {i18n: 'international'}, name: 'international_index', component: () => import('@/views/international/international.vue') }
//         ]
//     },
//     {
//         path: '/component',
//         icon: 'social-buffer',
//         name: 'component',
//         title: '组件',
//         component: Main,
//         children: [
//             {
//                 path: 'text-editor',
//                 icon: 'compose',
//                 name: 'text-editor',
//                 title: '富文本编辑器',
//                 component: () => import('@/views/my-components/text-editor/text-editor.vue')
//             },
//             {
//                 path: 'md-editor',
//                 icon: 'pound',
//                 name: 'md-editor',
//                 title: 'Markdown编辑器',
//                 component: () => import('@/views/my-components/markdown-editor/markdown-editor.vue')
//             },
//             {
//                 path: 'image-editor',
//                 icon: 'crop',
//                 name: 'image-editor',
//                 title: '图片预览编辑',
//                 component: () => import('@/views/my-components/image-editor/image-editor.vue')
//             },
//             {
//                 path: 'draggable-list',
//                 icon: 'arrow-move',
//                 name: 'draggable-list',
//                 title: '可拖拽列表',
//                 component: () => import('@/views/my-components/draggable-list/draggable-list.vue')
//             },
//             {
//                 path: 'area-linkage',
//                 icon: 'ios-more',
//                 name: 'area-linkage',
//                 title: '城市级联',
//                 component: () => import('@/views/my-components/area-linkage/area-linkage.vue')
//             },
//             {
//                 path: 'file-upload',
//                 icon: 'android-upload',
//                 name: 'file-upload',
//                 title: '文件上传',
//                 component: () => import('@/views/my-components/file-upload/file-upload.vue')
//             },
//             {
//                 path: 'scroll-bar',
//                 icon: 'android-upload',
//                 name: 'scroll-bar',
//                 title: '滚动条',
//                 component: () => import('@/views/my-components/scroll-bar/scroll-bar-page.vue')
//             },
//             {
//                 path: 'count-to',
//                 icon: 'arrow-graph-up-right',
//                 name: 'count-to',
//                 title: '数字渐变',
//                 // component: () => import('@/views/my-components/count-to/count-to.vue')
//                 component: () => import('@/views/my-components/count-to/count-to.vue')
//             },
//             {
//                 path: 'split-pane-page',
//                 icon: 'ios-pause',
//                 name: 'split-pane-page',
//                 title: 'split-pane',
//                 component: () => import('@/views/my-components/split-pane/split-pane-page.vue')
//             }
//         ]
//     },
//     {
//         path: '/form',
//         icon: 'android-checkbox',
//         name: 'form',
//         title: '表单编辑',
//         component: Main,
//         children: [
//             { path: 'artical-publish', title: '文章发布', name: 'artical-publish', icon: 'compose', component: () => import('@/views/form/article-publish/article-publish.vue') },
//             { path: 'workflow', title: '工作流', name: 'workflow', icon: 'arrow-swap', component: () => import('@/views/form/work-flow/work-flow.vue') }

//         ]
//     },
//     // {
//     //     path: '/charts',
//     //     icon: 'ios-analytics',
//     //     name: 'charts',
//     //     title: '图表',
//     //     component: Main,
//     //     children: [
//     //         { path: 'pie', title: '饼状图', name: 'pie', icon: 'ios-pie', component: resolve => { require('@/views/access/access.vue') },
//     //         { path: 'histogram', title: '柱状图', name: 'histogram', icon: 'stats-bars', component: resolve => { require('@/views/access/access.vue') }

//     //     ]
//     // },
//     {
//         path: '/tables',
//         icon: 'ios-grid-view',
//         name: 'tables',
//         title: '表格',
//         component: Main,
//         children: [
//             { path: 'dragableTable', title: '可拖拽排序', name: 'dragable-table', icon: 'arrow-move', component: () => import('@/views/tables/dragable-table.vue') },
//             { path: 'editableTable', title: '可编辑表格', name: 'editable-table', icon: 'edit', component: () => import('@/views/tables/editable-table.vue') },
//             { path: 'searchableTable', title: '可搜索表格', name: 'searchable-table', icon: 'search', component: () => import('@/views/tables/searchable-table.vue') },
//             { path: 'exportableTable', title: '表格导出数据', name: 'exportable-table', icon: 'code-download', component: () => import('@/views/tables/exportable-table.vue') },
//             { path: 'table2image', title: '表格转图片', name: 'table-to-image', icon: 'images', component: () => import('@/views/tables/table-to-image.vue') }
//         ]
//     },
//     {
//         path: '/advanced-router',
//         icon: 'ios-infinite',
//         name: 'advanced-router',
//         title: '高级路由',
//         component: Main,
//         children: [
//             { path: 'mutative-router', title: '动态路由', name: 'mutative-router', icon: 'link', component: () => import('@/views/advanced-router/mutative-router.vue') },
//             { path: 'argument-page', title: '带参页面', name: 'argument-page', icon: 'android-send', component: () => import('@/views/advanced-router/argument-page.vue') }
//         ]
//     },
//     {
//         path: '/error-page',
//         icon: 'android-sad',
//         title: '错误页面',
//         name: 'errorpage',
//         component: Main,
//         children: [
//             { path: 'index', title: '错误页面', name: 'errorpage_index', component: () => import('@/views/error-page/error-page.vue') }
//         ]
//     },

];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    preview,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
