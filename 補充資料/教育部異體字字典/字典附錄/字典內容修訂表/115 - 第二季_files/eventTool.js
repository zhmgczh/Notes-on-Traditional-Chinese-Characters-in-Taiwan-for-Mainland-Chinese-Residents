
var lastEv;


/** 附加 HTMLElement 基本功能 */
if(typeof(HTMLElement)!='undefined')
{
/** 快速宣告event(type, listener[, useCapture])  */
	if(Node && !Node.prototype.ev)
		Node.prototype.ev=function(evTp, func, cap)
		{
			if (this.addEventListener) 
			{	this.addEventListener(evTp, func, cap?true:false);	}
			else if(this.attachEvent)
			{	this.attachEvent("on"+evTp, func);	}
		};
}

if(_)
{
	_.addEv=function(obj, eType, f, cap)
	{
		if(obj.addEventListener) 
			obj.addEventListener(eType, f, cap?true:false);
		else if(obj.attachEvent)
			obj.attachEvent("on"+eType, f );// IE 6/7/8
	}
}


//key

function getKey(e)
{
	var keynum
	if(window.event) // IE
		keynum = e.keyCode
	else if(e.which) // Netscape/Firefox/Opera
		keynum = e.which
	return keynum;
}






//mouse


var mouseX, mouseY, mouseE;
function getMouseXY(e)
{
	if (!e) e = window.event; // works on IE, but not NS (we rely on NS passing us the event)
	mouseE=e;

	if (IE && e && document.body && !isNaN(document.body.scrollLeft))
	{ 
		mouseX = e.clientX + document.body.scrollLeft;
		mouseY = e.clientY + document.body.scrollTop;
		if (mouseX < 0)	{mouseX = 0}
		else if (mouseX > document.body.scrollWidth)	{mouseX = document.body.scrollWidth}
		if (mouseY < 0)	{mouseY = 0}
	} 
	else
	{
		mouseX = e.pageX;
		mouseY = e.pageY;
	}
	return true
}
document.addEventListener("mousemove", getMouseXY);

//

function eventLink(e)
{
	var ev=e||event;
	if(!ev || !ev.target.dataset) return;
	lastEv=ev;

if(debug)	console.log(ev.target.tagName+'['+ev.target.id+']', ev.target, this);

	var ta=ev.target;
	do
	{
		if(!ta.dataset) continue;
		if(ta.dataset.js)
		{
			try{ eval(ev.target.dataset.js); }
			catch(e) { console.error('eventLink.js.err', ev.target.dataset.js, ev, e); }
		}

		if((f=ta.dataset.func))
		{
			var p=ta.dataset.para;
			try
			{
				if(window[f])
				{
					if(p) window[f](p);
					else window[f]();
				}
				else
					console.warn('eventLink.func.err: no func ['+f+']');
			}
			catch(e) { console.error('eventLink.func.err', f, ev, e); }
		}
if(debug)	console.log(ta.tagName, ta);

		if(ta.tagName && ['A', 'BUTTON', 'INPUT', 'LABEL', 'SELECT', 'TEXTAREA'].indexOf(ta.tagName)!=-1) return;
		else if(ta.dataset.replace!==undefined)
		{
			location.replace(ta.dataset.replace);
			return;
		}
		else if(ta.dataset.href!==undefined)
		{
			location.href=ta.dataset.href;
			return;
		}
		else if(ta.dataset.link!==undefined)
		{
			location.href=ta.dataset.link;
			return;
		}
		else if(false && ta.dataset.url!==undefined)
		{
			if(ta.dataset.method=='replace')
				location.replace(ta.dataset.url);
			else
				location.href=ta.dataset.url;
			return;
		}
		
		if(ta==this) return;
	}
	while(ta=ta.parentElement);
}

if(typeof(EventTarget)!='undefined')
	EventTarget.prototype.evLink=eventLink;
else if(typeof(Node)!='undefined')
	Node.prototype.evLink=eventLink;






