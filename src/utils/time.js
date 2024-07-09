// 时间转时间戳
export function timeToTimestamp(time) {
    return new Date(time).getTime();
}

export function timestampToTime(timestamp) { 
    // console.log('timestampToTime', timestamp, new Date(parseInt(timestamp) * 1000));
    const date = new Date(parseInt(timestamp));
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? ('0' + month) : month;
    let day = date.getDate();
    day = day < 10 ? ('0' + day) : day;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let m = date.getMinutes();
    m = m < 10 ? ('0' + m) : m;
    let s = date.getSeconds();
    s = s < 10 ? ('0' + s) : s;
    return year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s;
}