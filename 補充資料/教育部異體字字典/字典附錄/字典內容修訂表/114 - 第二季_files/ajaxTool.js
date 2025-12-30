var request=new Array();

function createRequest(inp)
{
	if(request[inp])	return;
	else request[inp]=xmlHttp();

	if(request[inp] == null)
		alert("Error creating request object");
}

function xmlHttp(method)
{
	var xmlHttp=null;
	if (typeof XMLHttpRequest != "undefined")
		xmlHttp = new XMLHttpRequest();
	else if(window.ActiveXObject) {
		var aVersions = ["Msxml2.XMLHttp.5.0", "Msxml2.XMLHttp.4.0", "Msxml2.XMLHttp.3.0", "Msxml2.XMLHttp", "Microsoft.XMLHttp"];
		
		if(method)
		{
			xmlHttp = new ActiveXObject(aVersions[method]);
console.log("http"+method);
		}			
		else
		{
			for (var i = 0; i < aVersions.length; i++) {
				try {
					xmlHttp = new ActiveXObject(aVersions[i]);
console.log("http"+i);
					break;
				} catch (e) {}
			}
			
		}
		if(!xmlHttp.GET)
			xmlHttp.GET=function(url, callBack, header)
				{	reqGET(this, url, callBack, header); };

		if(!xmlHttp.POST)
			xmlHttp.POST=function(url, postStr, callBack, header)
				{	reqPOST(this, url, postStr, callBack, header); };
	}
	else xmlHttp=null;
	return xmlHttp;
}

/* 
load
error
abort
progress
loadend
loadstart
readystatechange
timeout
 */

var reqDebug=0;
function reqGET(http=xmlHttp(), url, callBack, header)
{
	
	http.open("GET", url, true);
	if(header)
	{
		for(var i in header)
			http.setRequestHeader(i, header[i]);
	}
//	http.setRequestHeader("Cache-Control", 'no-store');
//	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	
	http.callBack=callBack;
	
	if(!callBack){}
	else if(typeof callBack==='function')	http.onload2=callBack;
	else if(typeof callBack==='object')
	{
		//成功 失敗 取消 過程 讀取結束 讀取開始 狀態改變 逾時
		var evs=['onload', 'onerror', 'onabort', 'onprogress', 'onloadend', 'onloadstart', 'onreadystatechange', 'ontimeout'];
		if(callBack.length)
		{
			for(var i=0; i<callBack.length; i++)
			{
				if(callBack[i])
					http[evs[i]]=http[evs[i]+2]=callBack[i];
			}
		}
		else
		{
			for(var i=0; i<evs.length; i++)
			{
				if(callBack[evs[i]])
					http[evs[i]]=http[evs[i]+2]=callBack[evs[i]];
			}
		}
	}
	
	http.onload=function()
	{
		try{	if(this.onload2)	this.onload2(); }
		catch(ex)
		{
			console.error("reqGET.onload.err["+this.responseURL+"]: \n"+ex.message);
			console.warn(ex);
			throw ex;
		}
	}

	http.send(null);
}

XMLHttpRequest.prototype.GET=function(url, callBack, header)
{	reqGET(this, url, callBack, header); };


function reqPOST(http=xmlHttp(), url, postStr, callBack, header)
{
	http.open("POST", url, true);
	if(header)
	{
		for(var i=0; i<header.length; i++)
			http.setRequestHeader(i, header[i]);
	}
	http.setRequestHeader("Cache-Control", 'no-store');
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	
	http.callBack=callBack;
	http.onreadystatechange = function ()
	{
		if(this.readyState!=4) { }
		else if(this.status!=200 && this.status!==0)
		{
			console.warn("reqPOST.status["+this.responseURL+"]: "+this.status);
			if(debug)
				alert("reqPOST.status["+this.responseURL+"]: "+this.status);
		}
		else
		{
			try
			{
				if(this.callBack)	this.callBack();
			}
			catch(ex)
			{
				if(hardEx)
				{
					alert("reqPOST.err ["+this.responseURL+"]: \n"+ex.message);
					alert(this.responseText);
				}

				console.error("reqPOST.err["+this.responseURL+"]: "+ex.message);
				alert("reqPOST.err["+this.responseURL+"]: "+ex.message);
			}
		}
	}
	http.send(postStr);
}

XMLHttpRequest.prototype.POST=function(url, postStr, callBack, header)
{	reqPOST(this, url, postStr, callBack, header); };


if(_)
{
	_.GET=reqGET;
	_.POST=reqPOST;
	_.reqGET=reqGET;
	_.reqPOST=reqPOST;
}
//															 JSON

XMLHttpRequest.prototype.toJSON=function(hardEx)
{
	if(this.readyState!=4){ return null; }
	else if(this.status!=200 && this.status!==0)
	{
		console.warn("httpJSON.status ["+this.responseURL+"]: "+this.status, this);
		return null;
	}
	else
	{
		try
		{	return eval(this.responseText);	}
		catch(ex)
		{
			if(hardEx)
			{
				alert("httpJSON.err ["+this.responseURL+"]: \n"+ex.message);
				alert(this.responseText);
			}
			console.error("httpJSON.err ["+this.responseURL+"]: "+ex.message, this);
			return null;
		}
	}
};


Object.defineProperty(XMLHttpRequest.prototype, 'responseJSON', {
  get: function(){	return this.toJSON(); }
});
