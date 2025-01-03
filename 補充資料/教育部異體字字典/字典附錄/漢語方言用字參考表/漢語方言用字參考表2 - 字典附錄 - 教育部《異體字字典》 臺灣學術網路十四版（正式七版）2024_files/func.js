var IE = navigator.userAgent.indexOf("Trident")>0?true:false;
if (!IE) document.captureEvents(Event.MOUSEMOVE)
var debug=false;
/*
try{
console.log(document.currentScript);
console.log(document.currentScript.src);
}
catch(e) {}
*/
//事件--------------------------------------------------------------------------

function disableAccess(md)
{
	if(!md) md=127;
	if(md&1)
	{
		document.onselect = function(){ if(IE) document.selection.empty();};
		document.onmousedown=function(){return false;};
		
	}
	if(md&2)
		document.oncontextmenu=function(){return false;};
	if(md&4)
		document.onkeydown=function(event){if(event.keyCode==17)  return false;};
	
}

//基本函式----------------------------------------------------------------------

function obj(id)
{
	switch(typeof id)//number,string,object,boolean, function, undefined, xml
	{
		case 'string':
			return document.getElementById(id); 
			break;
		case 'object':
			return id;
			break;
		default:
			return null;
	}
}

/** 物件核心 */
var _={
	"debug":false
	, "nullIdAlert":false
	, "emptyDom":false
	
	, "msgModel":{}
	
	, "has":function(id) // has dom by id
	{
		switch(typeof id)//number,string,object,boolean, function, undefined, xml
		{
			case 'string':
				var d=document.getElementById(id);
				if(d) return true;
				else return false;
				break;
			case 'object':
				return true;
				break;
			default:
				return false;
		}
	}
	, "id":function(id) // get dom by id
	{
		switch(typeof id)//number,string,object,boolean, function, undefined, xml
		{
			case 'string':
				var d=document.getElementById(id);
				if(d) return d; 
				else
				{
					throw("ID is null!! ["+id+"]");
					if(this.nullIdAlert) alert("ID is null!! ["+id+"]");
					return this.emptyDom?{}:null;
				}
				break;
			case 'object':
				return id;
				break;
			default:
				return null;
		}
	}
	, "names":function (n)
	{
		if(!n) return [];
		try
		{	return document.getElementsByName(n);	}
		catch(e)
		{
			console.log('Names.Err['+n+']: '+e.message);
			return [];
		}
	}
	, "tags":function(n)
	{
		if(!n) return [];
		try
		{	return document.getElementsByTagName(n);	}
		catch(e)
		{
			console.log('Tags.Err['+n+']: '+e.message);
			return [];
		}
	}
	
/** 從字串|陣列 載入外部資源(ico,js,css) */
	, "loadSource": function(url) 
	{
		if(!url) return;
		if(typeof url==='string')
			url=[url];
		
		var typeL=
		{"ico":['link', 'image/x-icon', 'icon', 'shortcut icon']
		,"css":['link', 'text/css', 'stylesheet']
		,"js":['script', 'text/javascript']
		};

		for(var n=0; n<url.length; n++)
		{
			var u0=url[n].splut("."), tp=u0[u0.length-1].split("?")[0].toLowerCase()
			, type="", rel="", tag="";

			var dat=typeL[tp];
			
			if(dat)
			{
				var newTag = document.createElement(dat[0]);
				newTag.type = dat[1];
				newTag.rel = dat[2];
				newTag.href = url[n];
				
				if(document.head)	document.head.appendChild(newTag);
				else	document.getElementsByTagName("head")[0].appendChild(newTag);
			}
		}
	}

/** get parameter value */
	, "para": function( parameterName )
	{
		// Add "=" to the parameter name (i.e. parameterName=value)
		var queryString = window.top.location.search.substring(1);
		parameterName +="=";

		if ( queryString.length > 1 ) 
		{
			str=queryString.split('&');
			for(i=0; i<str.length; i++)
				if(str[i].indexOf ( parameterName )==0)
					 return unescape ( str[i].substring ( parameterName.length ) );
		}
		return null;
	}
	
	
	
/** 顯示 css 樣式內容 */
	, "getCss": function(className) 
	{
		var classes = document.styleSheets[0].rules || document.styleSheets[0].cssRules;
		for (var x = 0; x < classes.length; x++) {
			if (classes[x].selectorText == className)
				return (classes[x].cssText) || classes[x].style.cssText;
		}
	}
	
	, "print": function(obj)
	{
console.log(obj, typeof obj);
		switch(typeof obj)
		{
			case 'string':
			case 'number':
			case 'boolean':
				return obj;
			case 'function':
				return obj.toString();

			case 'object':
				if(obj.length!=undefined)
				{
					return "Arrey: "+JSON.stringify(obj);
				}
				else
				{
					var r=[];
					
					for(var i in obj)
					{
						r.push(i+"["+typeof(obj[i])+"]: "+obj[i])
					}
					
					return "{ "+r.join('\n, ')+" }";
				}
			default:
				return "unknow type: "+typeof(obj);
		}
	}
	
	
	, "initL":[]
};		// end _

window.addEventListener('load', function()
{
	for(var i=0; i<_.initL.length; i++)
		if(typeof _.initL[i]==="function")
			_.initL[i]();
});


/** 傳回url query */
if(Object.defineProperty)
Object.defineProperty(_, 'query', {
		get: function(){
		if(window.top.location.search) return window.top.location.search.substring(1);
		else	return '';
		}
	}); 


var Id=_.id;
var getPara=_.para;

//console.log(document.currentScript);
//------------------------------------------------------------------------------ load js

var jsDir = jsDir || (document.currentScript?document.currentScript.src.split("?")[0].replace("func.js", "js"):'') || '/js' ;

var jsList=jsList || ['eventTool.js', 'baseTool.js'
, 'ajaxTool.js', 'anime.js', 'cssTool.js', 'dataTool.js'
, 'formTool.js', 'tableTool.js', 'mutil.js', 'IncludeFile.js', 'others.js', 'notiTool.js', 'domTool.js', 'db.js', 'geoTool.js', 'saveData.js'
, '/jjTool.css'
]
, loadCount=0
;	// , 'Tool.js'
function loadJs(jsList)
{
	for(i=0; i<jsList.length; i++)
	{
		var imported;
		var src=(jsList[i].indexOf('/')==0 || jsList[i].indexOf('://')>0
			?'' :jsDir+'/')+jsList[i];
		if(jsList[i].indexOf(".css")!=-1)
		{
			imported = document.createElement('link');
			imported.type = 'text/css';
			imported.rel = "stylesheet";
		}
		else
			(imported = document.createElement('script')).type = "text/javascript";

		if(document.currentScript) // 本檔案
			document.currentScript.parentNode.appendChild(imported);
		else if(document.head) // 檔頭
			document.head.appendChild(imported);
		else
			document.getElementsByTagName("head")[0].appendChild(imported);

		if(jsList[i].indexOf(".css")!=-1)
			imported.href = src;
		else
			imported.src = src;
		
		imported.onload=function()
		{
			loadCount++; 
		};
	}
	
	for(i=0; i<2000 && loadCount<jsList; i++)
		sleep(1);
}
loadJs(jsList);



/** Change uri */
function chgPara(inp0)
{
	var inp=inp0||this, qu='', paraP={}
	, paraL=location.search.length>1
		?location.search.substring(1).split('&'):[];
	if(!inp || inp.value==undefined) return;
	
	var n=inp.name, v="radio checkbox".indexOf(inp.type)==-1 ? inp.value : (inp.checked?inp.value:'');
	
	for(var i=0; i<paraL.length; i++)
	{
		var t=paraL[i].split('=');
		if(1 || !paraP[t[0]])
		{
			if(n==t[0]) t[1]=v;
			paraP[t[0]]=t[1];
			qu+='&'+t[0]+'='+t[1];
		}
	}
	if(paraP[n]==undefined)
		qu+='&'+n+'='+v;
	
	location.href=location.href.split("?")[0]+'?'+qu.substring(1);
}


//-------------------------------------------------------------------------------

/* 取得 視窗大小
// document ev
var viewportwidth;
var viewportheight;
 
// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
 
if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth !='undefined' && document.documentElement.clientWidth != 0)
{
viewportwidth = document.documentElement.clientWidth;
viewportheight = document.documentElement.clientHeight;
} 
else if (typeof window.innerWidth != 'undefined')
{
viewportwidth = window.innerWidth;
viewportheight = window.innerHeight;
}// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
else // older versions of IE
{
viewportwidth = document.getElementsByTagName('body').clientWidth;
viewportheight = document.getElementsByTagName('body').clientHeight;
}
//document.write('<p>Your viewport width is '+viewportwidth+'x'+viewportheight+'</p>');

*/



//-------------------------------------------------------

function intTime(t)
{
	var h=parseInt(t/100), m=t%100;
	return (h<10?'0':'')+h+':'+(m<10?'0':'')+m;
}


function disableArrow(ev) // 防止用方向鍵控制 跳躍選單
{
	var e=eLog=ev||event||window.event
	, sel=e.target;
	if(!sel || sel.tagName!='SELECT') return;
	else if(e.keyCode>=37 && e.keyCode<=40 && !sel.unLock)
	{
		alert("本選項必須以鍵盤空白鍵操作!!\n\n請以空白鍵展開選項 再以方向鍵選擇項目。");
		return false;
	}
	else if(e.keyCode==32)
	{
		sel.unLock=true;
		//this.chgPara();
	}
}

