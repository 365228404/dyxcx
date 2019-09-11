//时间相关的方法

// 日期选择 S
function withData(param) {
  return param < 10 ? '0' + param : '' + param;
}

function getLoopArray(start, end) {
  start = start || 0;
  end = end || 1;
  let array = [];
  for (let i = start; i <= end; i++) {
    array.push(withData(i));
  }
  return array;
}

function getMonthDay(year, month) {
  let flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0),
    array = null;

  switch (month) {
    case '01':
    case '03':
    case '05':
    case '07':
    case '08':
    case '10':
    case '12':
      array = getLoopArray(1, 31)
      break;
    case '04':
    case '06':
    case '09':
    case '11':
      array = getLoopArray(1, 30)
      break;
    case '02':
      array = flag ? getLoopArray(1, 29) : getLoopArray(1, 28)
      break;
    default:
      array = '月份格式不正确，请重新输入！'
  }
  return array;
}

function getNewDateArry() {
  // 当前时间的处理
  let newDate = new Date();
  let year = withData(newDate.getFullYear()),
    mont = withData(newDate.getMonth() + 1),
    date = withData(newDate.getDate()),
    hour = withData(newDate.getHours()),
    minu = withData(newDate.getMinutes()),
    seco = withData(newDate.getSeconds());

  return [year, mont, date, hour, minu, seco];
}

function dateTimePicker(startYear, endYear, date) {
  // 返回默认显示的数组和联动数组的声明
  let dateTime = [],
    dateTimeArray = [
      [],
      [],
      [],
      [],
      [],
      []
    ];
  let start = startYear || 1978;
  let end = endYear || 2100;
  // 默认开始显示数据
  let defaultDate = date ? date : getNewDateArry();
  // 处理联动列表数据
  /*年月日 时分秒*/
  dateTimeArray[0] = getLoopArray(start, end);
  dateTimeArray[1] = getLoopArray(1, 12);
  dateTimeArray[2] = getMonthDay(defaultDate[0], defaultDate[1]);
  dateTimeArray[3] = getLoopArray(0, 23);
  dateTimeArray[4] = getLoopArray(0, 59);
  dateTimeArray[5] = getLoopArray(0, 59);

  dateTimeArray.forEach((current, index) => {
    dateTime.push(current.indexOf(defaultDate[index]));
  });

  return {
    dateTimeArray: dateTimeArray,
    dateTime: dateTime
  }
};

// 获取当天开始跟结束时间
function getTodayTime() {
	let todayS = new Date();
	todayS.setHours(0);
	todayS.setMinutes(0);
	todayS.setSeconds(0);
	todayS.setMilliseconds(0);
	todayS = new Date(todayS).getTime();
	let todayE = new Date();
	todayE.setHours(23);
	todayE.setMinutes(59);
	todayE.setSeconds(59);
	todayE.setMilliseconds(999);
	todayE = new Date(todayE).getTime();
	// console.log('开始时间', todayS, '结束时间', todayE)
	return {
		startTime: todayS,
		endTime: todayE
	}
};

/** 砍单返现倒计时
 * intervalList 订单数组
 * callBack返回倒计时时分秒等信息
 */
function singleCountdownByList(intervalList, callBack) {
  let isEnd = true;
  // 30分钟倒计时
  let waitingTime = 1800000;

  intervalList = intervalList || [];
  for (let i in intervalList) {
    let timeInterval = 0;
    let item = intervalList[i];
    if (item.currState == 1) { //未支付订单
      if (item.paymentTime <= waitingTime) { //如果当前时间减去下单时间小于30分钟，则开始倒计时
        isEnd = false;
        break;
      } else {
        continue;
      }
    } else if (item.receiveState == 3) {
      if (item.activity == 3) { //如果是砍单倒计时
        timeInterval = item.choppingRemainderTime;
        let totalSecond = timeInterval * 0.001 - Date.parse(new Date()) * 0.001;
        if (totalSecond > 0 && isEnd) { //其中有一个大于0就表示不是所有内购会都结束
          isEnd = false;
          break;
        }
      } else {
        continue;
      }
    }
  }
  if (isEnd) { //倒计时结束
    clearInterval(interval);
    if (callBack) {
      console.log('所有倒计时结束了~')
      callBack({
        isEnd: true
      });
    }
    return;
  }
  let interval = setInterval(function () {
    let count = 0;
    for (let i in intervalList) {
      let item = intervalList[i];
      let timeInterval = item.choppingRemainderTime;
      if (item.currState == 1) { //未支付订单
        if (item.paymentTime <= waitingTime) { //如果当前时间减去下单时间小于30分钟，则开始倒计时
          timeInterval = item.addTime + waitingTime;
        } else {
          item.timeRes = {
            isEnd: true
          };
          continue;
        }
      } else if (item.activity != 3) {
        continue;
      }
      let totalSecond = timeInterval * 0.001 - Date.parse(new Date()) * 0.001;
      if (totalSecond < 0) {
        item.timeRes = {
          isEnd: true
        };
        continue;
      }

      count += totalSecond;
      if (i == intervalList.length - 1 && count <= 0) {
        isEnd = true;
      }

      // 秒数
      let second = totalSecond;

      // 天数位
      let day = Math.floor(second / 3600 / 24);
      let dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;

      // 小时位
      let hr = Math.floor((second - day * 3600 * 24) / 3600);
      let hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位
      let min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      let minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位
      let sec = Math.round(second - day * 3600 * 24 - hr * 3600 - min * 60);
      let secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      totalSecond--;

      let timeItem = {
        countDownDay: dayStr,
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr
      };
      item.timeRes = timeItem;

    }
    if (callBack && !isEnd) { //倒计时中返回倒计时时分秒
      callBack({
        intervalList: intervalList
      });
      // console.log('倒计时中')
    }
    if (isEnd) { //倒计时结束
      clearInterval(interval);
      if (callBack) {
        console.log('所有倒计时结束了')
        callBack({
          isEnd: true
        });
      }
    }
  }.bind(this), 1000);
  return interval;
};

/** 倒计时（数组任务）
 * intervalList 时间戳数组
 * callBack返回倒计时时分秒等信息
 * countDownTime 倒计时执行时间
 */
function countDownByTimeList(intervalList, callBack, countDownTime) {
  let isEnd = true;
  countDownTime = countDownTime || 1000;
  intervalList = intervalList || [];
  for (let i in intervalList) {
    let timeInterval = 0;
    let item = intervalList[i];

    if (item.purState == 1) {
      timeInterval = item.endTime;
    } else if (item.purState == 2) {
      timeInterval = item.futureTime;
    }
    let totalSecond = timeInterval * 0.001 - Date.parse(new Date()) * 0.001;

    if (totalSecond > 0 && isEnd) { //其中有一个大于0就表示不是所有内购会都结束
      isEnd = false;
      break;
    }
  }
  if (isEnd) { //倒计时结束
    clearInterval(interval);
    if (callBack) {
      console.log('所有倒计时结束了')
      callBack({
        isEnd: true
      });
    }
    return;
  }
  let interval = setInterval(function () {
    // purState=1表示进行中 2未开始 3已结束 倒计时 未开始用futureTime来倒计时，进行中用endTime，已结束不需要倒计时
    let count = 0;
    for (let i in intervalList) {
      let item = intervalList[i];
      item.timeRes = {};
      let timeInterval = 0;
      if (item.purState == 1) {
        timeInterval = item.endTime;
      } else if (item.purState == 2) {
        timeInterval = item.futureTime;
      }
      let totalSecond = timeInterval * 0.001 - Date.parse(new Date()) * 0.001;
      if (totalSecond < 0) {
        if (item.purState == 2) { //如果是未开始的内购会，开始倒计时结束了，开始结束倒计时
          item.purState = 1;
          continue;
        } else {
          item.purState = 3;
          item.timeRes = {
            isEnd: true
          };
          continue;
        };
      }
      count += totalSecond;
      if (i == (intervalList.length - 1) && count <= 0) {
        isEnd = true;
      }
      // 秒数
      let second = totalSecond;
      // 天数位
      let day = Math.floor(second / 3600 / 24);
      let dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;
      // 小时位
      let hr = Math.floor((second - day * 3600 * 24) / 3600);
      let hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;
      // 分钟位
      let min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      let minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;
      // 秒位
      let sec = Math.round(second - day * 3600 * 24 - hr * 3600 - min * 60);
      let secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      totalSecond--;

      let timeItem = {
        countDownDay: dayStr,
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr
      };
      item.timeRes = timeItem;
    };
    if (callBack && !isEnd) { //倒计时中返回倒计时时分秒
      callBack({
        intervalList: intervalList
      });
      // console.log('倒计时中')
    }
    if (isEnd) { //倒计时结束
      clearInterval(interval);
      if (callBack) {
        console.log('所有倒计时结束了1')
        callBack({
          isEnd: true
        });
      }
    }
  }.bind(this), countDownTime);
  return interval;
};

/** 倒计时（单一任务）
 * timeInterval 时间戳
 * callBack返回倒计时时分秒等信息
 */
function countDown(timeInterval, callBack) {
  let totalSecond = timeInterval * 0.001 - Date.parse(new Date()) * 0.001;
  if (totalSecond < 0) { //倒计时结束
    clearInterval(interval);
    if (callBack) {
      console.log('倒计时结束了')
      callBack({
        countDownDay: '00',
        countDownHour: '00',
        countDownMinute: "00",
        countDownSecond: "00",
        isEnd: true
      });
    }
    return;
  }
  let interval = setInterval(function () {
    // 秒数
    let second = totalSecond;

    // 天数位
    let day = Math.floor(second / 3600 / 24);
    let dayStr = day.toString();
    if (dayStr.length == 1) dayStr = '0' + dayStr;

    // 小时位
    let hr = Math.floor((second - day * 3600 * 24) / 3600);
    let hrStr = hr.toString();
    if (hrStr.length == 1) hrStr = '0' + hrStr;

    // 分钟位
    let min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
    let minStr = min.toString();
    if (minStr.length == 1) minStr = '0' + minStr;

    // 秒位
    let sec = Math.round(second - day * 3600 * 24 - hr * 3600 - min * 60);
    let secStr = sec.toString();
    if (secStr.length == 1) secStr = '0' + secStr;

    if (callBack) { //倒计时中返回倒计时时分秒
      callBack({
        countDownDay: dayStr,
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr
      });
      // console.log('倒计时中')
    }
    totalSecond--;
    if (totalSecond < 0) { //倒计时结束
      clearInterval(interval);
      if (callBack) {
        console.log('倒计时结束了')
        callBack({
          countDownDay: '00',
          countDownHour: '00',
          countDownMinute: "00",
          countDownSecond: "00",
          isEnd: true
        });
      }
    }
  }.bind(this), 1000);
  return interval;
};

export {
  dateTimePicker,
  getMonthDay,
	singleCountdownByList,
	countDownByTimeList,
	countDown,
	getTodayTime
};