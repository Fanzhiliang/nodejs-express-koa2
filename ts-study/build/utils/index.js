"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTime = void 0;
// 格式化时间戳
var parseTime = function (time, cFormat) {
    if (cFormat === void 0) { cFormat = '{y}-{m}-{d} {h}:{i}:{s}'; }
    if (!time)
        return '';
    var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    var date;
    if (typeof time === 'object') {
        date = time;
    }
    else {
        if ((typeof time === 'string')) {
            if ((/^[0-9]+$/.test(time))) {
                time = parseInt(time);
            }
            else {
                time = time.replace(/-/gm, '/');
            }
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000;
        }
        date = new Date(time);
    }
    var formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    var timeStr = format.replace(/{([ymdhisa])+}/g, function (result, key) {
        var value = formatObj[key];
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value];
        }
        return value.toString().padStart(2, '0');
    });
    return timeStr;
};
exports.parseTime = parseTime;
