/*
time 时间戳
bool 是否需要时分秒
text 连接符号
*/
export const formatTime = (time = new Date().getTime(), timeType = 'second', text = '-') => {
	time = time || new Date().getTime();
	time = parseInt(time);
	let date = new Date(time); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	let year = date.getFullYear(),
		month = ('0' + (date.getMonth() + 1)).slice(-2),
		sdate = ('0' + date.getDate()).slice(-2),
		hour = ('0' + date.getHours()).slice(-2),
		minute = ('0' + date.getMinutes()).slice(-2),
		second = ('0' + date.getSeconds()).slice(-2);
	let resStr = '';
	if (timeType === 'year') resStr = year;
	if (timeType === 'month') resStr = `${month + text + sdate}`;
	if (timeType === 'day') resStr = `${year + text + month + text + sdate}`;
	if (timeType === 'hour') resStr = `${hour + ':' + minute + ':' + second}`;
	if (timeType === 'minute') resStr = `${hour + ':' + minute}`;
	if (timeType === 'second')
		resStr = `${year + text + month + text + sdate + ' ' + hour + ':' + minute + ':' + second}`;
	if (timeType === 'dayhour') resStr = `${year + text + month + text + sdate + ' ' + hour + ':' + minute}`;
	return resStr;
};
