import Vue from 'vue'
/**
 * 浮点数转化成统一格式的字符串
 * 参数:value:浮点数值, num:小数点后位数, currencyType:货币符号
 * currencyType 货币符号
 */
Vue.filter('formatPrice', function(value = '0', num=2, currencyType = '¥') {
    let res = value.toString()
    let floatNum 
    if (value.toString().indexOf('.') === -1) {
        /*当前没有小数点*/
        res = res + '.' + sum('0', num)
    } else {
        floatNum = res.length - value.toString().indexOf('.') -1
        if (floatNum < num) {
            res = res + sum('0', num - floatNum)
        }
    }
    return res
})


/*数据字典匹配站点*/
Vue.filter('formatSite', function(value) {
    if (value === '无') {
        return value
    }
    if (!value) {
        return '无'
    }
    var ELE_DICTIONARY =  {
        BQX: '深圳宝清电池储能站',
        GZX: '广蓄电站',
        HZX: '惠蓄电站',
        LBG: '鲁布革电站',
        TSQ: '天生桥二级电站',
        SY: '所有',
        HNX: '海蓄电站',
        SZX: '深蓄电站',
        QYX: '清蓄电站',
        XSZX: '修试中心'
    }
    return ELE_DICTIONARY[value]
})

Vue.filter('formatTimeByRule', function(time = '', rule='.') {
    time = time.slice(0, 10).replace(/-/ig, '.')
    return time
})

/**
 * 数字与字符串相乘,返回最终字符串
 * 参数: 字符串:word,num:倍数
 */
function sum (word, num) {
	word = word.toString()
	var wordEnd = ''
	for (var i = 0 ;i< num ;i++) {
		wordEnd += word
	}
	return wordEnd
}

/*获取当前时间,返回对象(包含数据年月日)*/
function getTime (){
    var time = {}
    var myDate = new Date()
    time.year = myDate.getFullYear() //获取完整的年份(4位,1970-????)
    time.month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    time.day = myDate.getDate() //获取当前日(1-31)
    time.week = myDate.getDay()
    time._day = time.year + '-' + time.month + '-' + time.day
    return time
}
/*根据时间(时间格式为yyyy-mm-dd),返回对象(包含数据年月日)*/
function getTimeNow (time){
    var _time = {}
    _time.year = time.slice(0, 4)
    _time.month = time.slice(5, 7)
    _time.day = time.slice(8, 10)
    return _time
}
/**
 * 根据日期字符串获取星期几
 * @param dateString 日期字符串（如：2016-12-29），为空时为用户电脑当前日期
 * @returns {String}
 */
function getWeek (dateString){
    var date
    var dateArray = dateString.split("-")
     date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
    return "星期" + "日一二三四五六".charAt(date.getDay())
}


