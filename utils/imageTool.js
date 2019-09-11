
// 生成分享图片 S
//下载图片并预览
function downloadImg(that, imgSrc, callBack) {
	// that.isDownloading = true;
	// that.isDownloadDialog = true;
	// that.downloadTip = '正在生成图片，请稍候';
  //防止图片保存出错
  setTimeout(function () {
		// that.isDownloading = false;
  }, 5000);
  //保存图片到本地
  downloadFile(that, imgSrc, callBack);
};
//保存图片
function downloadFile(that, imgSrc, callBack) {
	console.log('res=====222', imgSrc);
  uni.downloadFile({
    url: imgSrc,
    success: function (res) {
			console.log(res, 'res=====333');
      //图片保存到本地
      uni.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success: function (data) {
          typeof callBack == "function" && callBack()
        },
        fail: function (err) {
          console.log(err);
					// that.isDownloadDialog = false;
					// that.isDownloading = false;
          if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
            if (uni.canIUse && uni.canIUse('button.open-type.openSetting')) {
							that.isOpenSetting = true;
            } else {
              uni.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
										// that.isShowShareDialog = true;
                    // console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  }else {
                    // console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            };
          }
        }
      })
    }
  });
};
// 批量下载图片
function downloadImages(imgServer, that, imageList,callBack){
	console.log('res=====111');
  imageList = imageList|| [];
  if(imageList.length==0){
    typeof callBack == "function" && callBack();
    return;
  }
  let image = imageList[0] || {};
  let imgUrl = (imgServer,image.imageUrl);
  //保存图片到本地
  downloadFile(that, imgUrl, function () {
    imageList.splice(0,1);
    downloadImages(imgServer,that,imageList,callBack);
  });
};

// 转换获取原比例大图链接
function getOriginalImg(imgServer, imageUrl) {
  imageUrl = imageUrl || '';
  // console.log('图片连接', imageUrl);
  if (imageUrl) {
    if (imageUrl.lastIndexOf('s') == imageUrl.length - 5) {
      imageUrl = imageUrl.substring(0, imageUrl.lastIndexOf('s')) + '.jpg';
    } else if (imageUrl.lastIndexOf('m') == imageUrl.length - 5) {
      imageUrl = imageUrl.substring(0, imageUrl.lastIndexOf('m')) + '.jpg';
    } else if (imageUrl.lastIndexOf('d') == imageUrl.length - 5) {
      imageUrl = imageUrl.substring(0, imageUrl.lastIndexOf('d')) + '.jpg';
    } else if (imageUrl.lastIndexOf('c') == imageUrl.length - 5) {
      imageUrl = imageUrl.substring(0, imageUrl.lastIndexOf('c')) + '.jpg';
    } else if (imageUrl.indexOf('.jpg') == -1) {
      imageUrl = imageUrl + '.jpg'
    }
    imageUrl = imgServer + imageUrl;
  }
  return imageUrl;
};
/*
*获取不同尺寸的图片
*imageUrl 图片路径
*size 需要处理的图片尺寸 s,c,m,d
*flag 是否服务器资源
*/
function getImgUrlBySize(imgServer, imageUrl, size, flag) {
  if (!imageUrl) {
    imageUrl = '/image/default.jpg';
    return imageUrl;
  } else {
    if (imageUrl.indexOf('.png') > -1 || flag) {
      return imgServer + imageUrl;
    }
    size = size || '';
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
      return imgServer + imageUrl;
    } else {
      return imageUrl
    };
  };
};
// 生成图片 E

export {
  downloadFile,
  downloadImg,
  downloadImages,
  getOriginalImg,
  getImgUrlBySize
};