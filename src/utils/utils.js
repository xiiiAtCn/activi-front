/**
 * 根据propertykeys，逐层判断是否存在
 * @param ob
 * @param defaultValue   如果不存在，指定一个值,或者回调函数
 * @param propertyKeys   待逐层判断的属性key
 * @returns {*}
 */
export default function ifNullThen (ob, defaultValue, ...propertyKeys) {
    if (!ob) return defaultValue
    if (!propertyKeys) return defaultValue

    let current = ob

    for (let item of propertyKeys) {
        if (typeof current[item] === 'undefined') {
            return typeof defaultValue === 'function' ? defaultValue(current) : defaultValue
        } else {
            current = current[item]
        }
    }
    return current
}

// 复制对象
export function deepCopy (source) {
    return JSON.parse(JSON.stringify(source))
}

// 判断对象是否为空
export function isEmptyObj (obj) {
    return Object.keys(obj).length === 0
}

// 数组中最大值
export function arrMax (arr, getFunc) {
    if (getFunc) {
        return getFunc(arr.reduce((preValue, curValue) => getFunc(preValue) > getFunc(curValue) ? preValue : curValue  ))     
    } else {
        return arr.reduce((preValue, curValue) => preValue > curValue ? preValue : curValue)
    }
}
