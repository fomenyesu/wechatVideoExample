/**
 * @file lib/base.js ~ 2016-08-10 19:34:15
 * @author DestinyXie (xber1986@gmail.com)
 * @description
 * base util
 */


/**
 * 加载js脚本
 * @param {string} src js脚本地址
 * @param {Function} callback js加载结束回调函数
 * @param {string=} opt_id js脚本添加的id属性
 */
function loadScript(src, callback, opt_id) {
    var js = document.createElement('script');
    js.src = src;
    if (opt_id) {
        js.id = opt_id;
    }
    var parent = (document.head || document.getElementsByTagName('head')[0] || document.body);
    js.onload = function () {
        parent.removeChild(js);
        callback && callback();
    }
    parent.appendChild(js);
}

/**
 * 加载图片
 * @param {string} src 图片地址
 * @param {Function} callback 图片加载结束回调
 */
function loadImage(src, callback) {
    var image = new Image();
    image.onload = callback;
    image.onerror = callback;
    image.src = src;
}

// 获得css属性的前缀
function prefix(style) {
    if (vender === '') {
        return style;
    }

    style = style.charAt(0).toUpperCase() + style.substr(1);
    return vender + style;
}

var dummyStyle = document.createElement('div').style;
var vender = (function() {
    var vendors = 't,webkitT,MozT,msT,OT'.split(',');
    var t;
    var i = 0;
    var l = vendors.length;

    for (; i < l; i++) {
        t = vendors[i] + 'ransform';
        if (t in dummyStyle) {
            return vendors[i].substr(0, vendors[i].length - 1);
        }
    }

    return false;
})();

/**
 * @type {Function}
 * @param {Function} callback 下一次重绘时的回调函数
 * @return {number} 定时标记用于取消回调的执行
 * 在页面的下一个repaint时调用回调
 */
var nextFrame = (function() {
    return window.requestAnimationFrame ||
        window[vender + 'RequestAnimationFrame'] ||
        function(callback) {
            return setTimeout(callback, 1000 / 60);
        };
})();

/**
 * @type {Function}
 * @param {id} number requestAnimationFrame执行后的标记
 * 取消requestAnimationFrame回调
 */
var cancelFrame = (function() {
    return window.cancelRequestAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window[vender + 'RequestAnimationFrame'] ||
        clearTimeout;
})();

/**
 * @type {Object}
 * 判断浏览器
 */
var browser = {
    versions: function() {
        var u = navigator.userAgent
          , app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1,
            //IE内核
            presto: u.indexOf('Presto') > -1,
            //opera内核
            webKit: u.indexOf('AppleWebKit') > -1,
            //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
            //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/),
            //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
            //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1,
            //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1,
            //是否iPad
            webApp: u.indexOf('Safari') > -1,
            //是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1,
            //是否微信 （2015-01-22新增）
            weibo: u.indexOf('weibo') > -1,
            //是否微博
            qq: u.indexOf('QQ') > -1,
            //是否QQ,
            uc: u.indexOf('UCBrowser') > -1,
            //是否UC,
            P8: u.indexOf('P8') > -1,
            //是否P8,
            wechatdevtools: u.indexOf('wechatdevtools') > -1//是否微信调试工具,
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}

var _toString = Object.prototype.toString;

/**
 * @type {Function}
 * @param {*} object 需要判断的对象
 * @return {boolean}
 * 判断输入对象是否是函数
 */
var isFunction = function (object) {
    return ('[object Function]' === _toString.call(object));
};

/**
 * @type {Function}
 * @param {*} object 需要判断的对象
 * @return {boolean}
 * 判断输入对象是否是字符串
 */
var isString = function (object) {
    return ('[object String]' === _toString.call(object));
};

/**
 * @type {Function}
 * @param {*} object 需要判断的对象
 * @return {boolean}
 * 判断输入对象是否是数组
 */
var isArray = function (object) {
    return ('[object Array]' === _toString.call(object));
};

/**
 * @type {Function}
 * @param {*} object 传入的DOM相关的内容
 * @return {boolean}
 * 根据输入内容返回DOM元素，传入字符串就作为DOM的id，传入DOM元素返回本身
 */
var getElement = function (object) {
    if (isString(object)) {
        return document.getElementById(object);
    }
    return object;
};


/**
 * @type {Function}
 * @param {Element} dom 传入的DOM相关的内容
 * @param {Element} relDom 相对于哪个元素计算，默认为body元素
 * @return {Array}
 * 根据输入内容返回DOM元素，传入字符串就作为DOM的id，传入DOM元素相对给定相对元素或body左上角的偏移量
 */
var getOffset = function (dom, relDom) {
    var relDom = relDom || document.body;
    var left = dom.offsetLeft;
    var top = dom.offsetTop;
    var offsetP = dom.offsetParent;

    while (offsetP && offsetP !== relDom && offsetP !== document.body) {
        left += offsetP.offsetLeft;
        top += offsetP.offsetTop;
        offsetP = offsetP.offsetParent;
    }
    return [left, top];
};

/**
 * 将源对象的所有属性拷贝到目标对象中
 * 1.目标对象中，与源对象key相同的成员默认将会被覆盖。
 * 2.源对象的prototype成员不会拷贝。
 * @param {Object} target 目标对象
 * @param {Object} source 源对象
 * @param {boolean} override 是否覆盖
 * @return {Object} 目标对象
 */
function extend(target, source, override) {
    for (var p in source) {
        if (source.hasOwnProperty(p)) {
            if (!override && target.hasOwnProperty(p)) {
                continue;
            }
            target[p] = source[p];
        }
    }
    return target;
}


/**
 * 生成随机字符串，字符范围：0-9a-zA-Z
 * @param {string=} opt_length 生成的字符串长度，默认16位
 * @return {string} 生成的字符串
 */
function genNonceStr(opt_length) {
    var str = "";
    var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var pos;

    for(var i = 0; i < (opt_length || 16); i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
};

/**
 * 设置cookie
 * @param {string} name cookie名
 * @param {string} value cookie值
 */
function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

/**
 * 读取cookie
 * @param {string} name cookie名
 * @return {string} cookie值
 */
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if(arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    }
    else {
        return null;
    }
}

/**
 * 清空cookie
 * @param {string=} name cookie名，没有则清空所有cookie
 */
function clearCookie(name) {
    if (name) {
        document.cookie=name+'=0;expires=' + new Date(0).toUTCString();
    }
    else {
        //删除所有cookies
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--;) {
                document.cookie=keys[i]+'=0;expires=' + new Date(0).toUTCString();
            }
        }
    }
}

/**
 * 读取url上带的参数
 * @param {string=} opt_url url地址
 * @return {string} cookie值
 */
function getUrlQuery(opt_url) {
    var url = opt_url || location.href;
    var queryObj = {};

    if (url.lastIndexOf('?') < 0) {
        return queryObj;
    }
    var queryStr = url.substring(url.lastIndexOf('?') + 1);
    var queryArr = queryStr.split('&');

    var queryKV;
    for (var i = queryArr.length - 1; i >= 0; i--) {
        queryKV = queryArr[i].split('=');
        try {
            queryObj[queryKV[0]] = decodeURIComponent(queryKV[1]);
        }
        catch (e) {
            queryObj[queryKV[0]] = '';
        }
    }

    return queryObj;
}

/**
 * 拼接url参数
 * @param {Object} paramObj 参数对象
 * @return {string} url参数字符串
 */
function buildUrlQuery(paramObj) {
    if (isString(paramObj)) {
        return paramObj;
    }

    if (!paramObj) {
        return '';
    }

    var queryArr = [];
    for (var key in paramObj) {
        queryArr.push(key + '=' + encodeURIComponent(paramObj[key]));
    }

    return queryArr.join('&');
}

module.exports = {
    loadScript: loadScript,
    loadImage: loadImage,
    nextFrame: function (fn) {
        return nextFrame(fn);
    },
    cancelFrame: function (index) {
        cancelFrame(index);
    },
    setCssPrefix: prefix,
    styleVender: vender,
    browser: browser,
    isFunction: isFunction,
    isString: isString,
    isArray: isArray,
    getElement: getElement,
    getOffset: getOffset,
    extend: extend,
    genNonceStr: genNonceStr,
    setCookie: setCookie,
    getCookie: getCookie,
    clearCookie: clearCookie,
    getUrlQuery: getUrlQuery,
    buildUrlQuery: buildUrlQuery
};