// vue全局过滤器用于模板里
import Vue from 'vue';
import store from 'store';
let state = store.state;

Vue.filter('formatTime', function (dateLong, format) {
  function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  };
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  format = format || 'Y-M-D h:m:s';
  var date = getDate(dateLong);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
  
  for (var i = 0; i < returnArr.length; i++) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
});

//处理两位小数
Vue.filter('toFixedNum', function(value, num){
	var num = num || 2;
	if (value){
	  value = Number(value);
	  return value.toFixed(num)
	} else {
	  return '0.00';
	};
});

/*
*获取不同尺寸的图片
*imageUrl 图片路径
*size 需要处理的图片尺寸 s,c,m,d
*flag 是否服务器资源
*/

Vue.filter('getImgUrlBySize', function(imageUrl, size, flag){
	if (!imageUrl) {
	  imageUrl = '../../static/image/default/default.jpg';
	  return imageUrl;
	} else {
	  if (imageUrl.indexOf('.png') > -1 || flag){
	    return state.imgServer + imageUrl;
	  }
	  if (imageUrl.indexOf('qlogo') == -1) {
	    if (imageUrl.lastIndexOf('s') == imageUrl.length - 5) {
	      imageUrl = imageUrl.substring(0, imageUrl.length - 5) + size + '.jpg';
	    } else if (imageUrl.lastIndexOf('c') == imageUrl.length - 5) {
	      imageUrl = imageUrl.substring(0, imageUrl.length - 5) + size + '.jpg';
	    } else if (imageUrl.lastIndexOf('m') == imageUrl.length - 5) {
	      imageUrl = imageUrl.substring(0, imageUrl.length - 5) + size + '.jpg';
	    } else if (imageUrl.lastIndexOf('d') == imageUrl.length - 5) {
	      imageUrl = imageUrl.substring(0, imageUrl.length - 5) + size + '.jpg';
	    } else if (imageUrl.indexOf('.jpg') == -1) {
	      imageUrl = imageUrl + size + '.jpg'
	    } else {
	      imageUrl = imageUrl.substring(0, imageUrl.length - 4) + size + '.jpg';
	    };
	    return state.imgServer + imageUrl;
	  }else{
	    return imageUrl
	  };
	};
});
