
// if(typeof(_) == "undefined") var _={};

_.curStyle= function(el)
{
	if(window.getComputedStyle)
		return window.getComputedStyle(el);
	else	return el.currentStyle;
	
}

function getPos(obj)
{	return typeOf(obj)=="object"?obj.getPos():null;	}

if(HTMLElement)
{
/** set dom size (width, height) */
	HTMLElement.prototype.size=function(w,h)
	{
		if(w===undefined) return;
		if(h===undefined) h=w;
		
		this.style.width=w+(w-0==w?"px":"");
		this.style.height=h+(h-0==h?"px":"");
	}
	
/** set dom position(left, top) */
	HTMLElement.prototype.pos=function(x,y)
	{
		if(this.curStyle.position=="static")
			this.style.position="relative";
		
		if(x!==undefined) this.style.left=x+(x-0==x?"px":"");
		if(y!==undefined) this.style.top=y+(y-0==y?"px":"");
	}
	
/** get current style object. */
	if(Object.defineProperty)
	{
		Object.defineProperty(HTMLElement.prototype, 'curStyle', {
			get: function(){
			if(window.getComputedStyle) return window.getComputedStyle(this);
			else	return this.currentStyle;
			}
		});
		
	}

/** 取得螢幕座標 */
	HTMLElement.prototype.getScreenPos=function()
	{
		obj=this;
		if(!isNaN(obj.offsetLeft))
		{
			var curleft = obj.offsetLeft, curtop = obj.offsetTop, lPath='', tPath='';
			while(obj.offsetParent)
			{
				obj = obj.offsetParent;
				curleft += obj.offsetLeft + obj.clientLeft
					- (obj!=document.body?obj.scrollLeft:0);
				curtop += obj.offsetTop + obj.clientTop
					- (obj!=document.body?obj.scrollTop:0);
				lPath+=", "+obj.offsetLeft+'+'+obj.clientLeft+'-'+obj.scrollLeft;
				tPath+=", "+obj.offsetTop+'+'+obj.clientTop+'-'+obj.scrollTop;
			}
			return [curleft, curtop, lPath, tPath];
		}
		else if(!isNaN(obj.x))
			return [obj.x, obj.y];
		else
		{
			if(debug) alert('pos Err!['+obj.id+']');
			return null;
		}
	};

/** 取得絕對位置 */
	HTMLElement.prototype.getAbsPos=function()
	{
		obj=this;
		if(!isNaN(obj.offsetLeft))
		{
			var curleft = obj.offsetLeft, curtop = obj.offsetTop, lPath='', tPath='';
			while(obj.offsetParent)
			{
				obj = obj.offsetParent;
				curleft += obj.offsetLeft - (obj.offsetParent?obj.scrollLeft:0) + obj.clientLeft;
				curtop += obj.offsetTop - (obj.offsetParent?obj.scrollTop:0) + obj.clientTop;
				lPath+=",";
			}
			return [curleft, curtop];
		}
		else if(!isNaN(obj.x))
			return [obj.x, obj.y];
		else
		{
			if(debug) alert('pos Err!['+obj.id+']');
			return null;
		}
	};


	HTMLElement.prototype.hide=function()
	{
		if(this.style.display!='none')	this.display0=this.style.display;
		this.style.display='none';	
	};
	
	HTMLElement.prototype.show=function()
	{
		if(this.style.display=='none')
			this.style.display=this.display0||'';
		
		if(this.curStyle.display=='none')
		{
			
			var d;
			if(!_.has('jjTest'+this.tagName))
			{
				d=document.createElement(this.tagName);
				d.id='jjTest'+this.tagName;
				d.innerHTML="1";
				_.id('jjTest').appendChild(d);
			}
			else d=_.id('jjTest'+this.tagName);
			
			var v=this.style.display=_.curStyle(d).display;
			
if(_ && _.debug)	console.info('show', this, v);
		}
	};

}


if(Node)
{
	HTMLElement.prototype.insertFront=function(obj)
	{	if(this.parentNode)	this.parentNode.insertBefore(obj, this);	}
	
	HTMLElement.prototype.insertBack=function(obj)
	{	if(this.nextElementSibling)	
			this.parentNode.insertBefore(obj, this.nextElementSibling);
		else if(this.parentNode)	this.parentNode.append(obj);
	}
	
}
