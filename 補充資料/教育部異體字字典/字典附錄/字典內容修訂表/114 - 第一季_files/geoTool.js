
_.lastPos=_.lastPosErr=null;


_.getGpsF=function(func, err, opt={timeout:10000, maximumAge:10000})
{
	opt.enableHighAccuracy=true;
	_.getGps(func, err, opt); 
};
_.getGps=function(func, err, opt={})
{
	if(!func)
	{
		alert('getGps必須提供一個callBack');
		throw 'getGps必須提供一個callBack';
	}
	var err0=function(pos)
	{
console.log('Get gps error');
		localStorage.gpsStatus=pos.code;
		console.warn(lastPosErr=pos);
		if(err && typeof err=="function") err(pos);
//		if(this.gpsErr1 && typeof this.gpsErr1=="function") this.gpsErr1(ev);

	};

	var cb0=function(position)
	{
console.log('Getted gps', new Date());
		_.lastPos=position;
		localStorage.gpsStatus=0;
		sessionStorage.gpsLat=position.coords.latitude;
		sessionStorage.gpsLng=position.coords.longitude;
		sessionStorage.gpsTime=new Date().getTime();
		if(func && typeof func=="function") func(position);
	};


	if(_.checkGps())
	{
		console.log('Get gps start');
		navigator.geolocation.getCurrentPosition(cb0, err0, opt);
	}
	else if(err) err();
}

_.keepGpsQ=function(func, err, opt={timeout:10000, maximumAge:10000})
{
	opt.enableHighAccuracy=false;
	_.keepGps(func, err, opt); 

};
_.keepGpsF=function(func, err, opt={timeout:10000, maximumAge:10000})
{
	opt.enableHighAccuracy=true;
	_.keepGps(func, err, opt); 

};
_.keepGps=function(func, err, opt)
{

	var err0=function(pos)
	{
		console.warn(_.lastPosErr=pos);
		if(err && typeof err=="function") err(pos);
	};
	if(!opt) opt={enableHighAccuracy:true, timeout:10000, maximumAge:10000};

	var cb0=function geoCB(position)
	{
console.log('Keeping gps', new Date());
		_.lastPos=position;
		localStorage.gpsStatus=0;
		sessionStorage.gpsLat=position.coords.latitude;
		sessionStorage.gpsLng=position.coords.longitude;
		sessionStorage.gpsTime=position.timestamp;
		if(func && typeof func=="function") func(position);
	};

	if(_.checkGps())
	{
		console.log('Keep gps start.');
		_.gpsWatchID=navigator.geolocation.watchPosition(cb0, err0, opt);
	}
	else if(err) err();
	
}

_.stopWatchGps=function()
{
	if(_.gpsWatchID)
		navigator.geolocation.clearWatch(_.gpsWatchID);
}

_.checkGps=function()
{
	if(location.protocol!='https:')
	{
		
//		alert(_.msgModel.needHttps);
	}
	else if(localStorage.gpsStatus=='0')
		return true;
	else if(localStorage.gpsStatus===undefined)
	{
		if(confirm(_.msgModel.gpsInit))
			return true;
		else
			alert(_.msgModel.gpsCancel);
	}
	else if(localStorage.gpsStatus=='1')
		alert(_.msgModel.gpsDen);
	else if(localStorage.gpsStatus=='2')
		alert(_.msgModel.gpsFail);
	else return true;
	
	return false;
}

_.msgModel.needHttps='網頁必須使用HTTPS協定才可以呼叫GPS!!';
_.msgModel.gpsInit="初次使用GPS 是否要執行授權GPS網頁定位? \n\n確認後請再接下來的視窗按下允許.";
_.msgModel.gpsCancel="GPS授權已取消 請之後再次設定.";
_.msgModel.gpsDen="GPS已被封鎖，請解除封鎖並重新設定。";
_.msgModel.gpsFail="GPS設備異常，請開啟GPS並重新設定。";
