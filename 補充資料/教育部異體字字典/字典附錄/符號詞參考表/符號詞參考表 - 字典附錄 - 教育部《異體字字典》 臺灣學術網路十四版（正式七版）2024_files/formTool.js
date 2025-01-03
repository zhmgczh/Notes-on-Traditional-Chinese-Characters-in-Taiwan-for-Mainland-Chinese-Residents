
//form--------------------------------------------------------
/** fill form data with a gived data object */
HTMLFormElement.prototype.fill=function(dat)
{
		var f=this;
		if(!f || !dat) return;
		
		
		for(var ii in dat)
		{
			var inp=f[ii];
			if(!inp) continue;
			
			var inpType='|text|number|textarea|radio|date|select-one|range|color||';
			if(inpType.indexOf('|'+inp.type+'|')>=0)
				inp.value=dat[ii];
			else if(inp.type=='checkbox')
				inp.checked=dat[ii];
			else if(inp.length>0)
			{
				if(inp[0].type=='radio') inp.value=dat[ii];
				else if(inp[0].type=='checkbox')
				{
					for(var tj=0; tj<inp.length; tj++)
						if(inp[tj].value==dat[ii]) inp[tj].checked=true;
				}
			}
		}
		return this;
};

HTMLFormElement.prototype.formObj=null;
HTMLFormElement.prototype.enterToTab=true;
HTMLFormElement.prototype.init=function()
{
	var dest='初始化此FORM元素.';
	this.formObj=new Form(this);
	return this;
}

/** make form data to a GET query */
HTMLFormElement.prototype.queryValue=function(ignoreEmpty)
{
	var s=[];
	for(var i=0; i<this.length; i++)
		if(this[i].name && (!ignoreEmpty || this[i].value))
			s.push(this[i].name+'='+encodeURI(this[i].value));
	return s.join('&');
}

// Form tool

function Form(f)
{
	if(!f) return;
	this.form=f;
	
	var formChg=function(ev, fObj) 					//內容改變
	{
		if(!ev)
		{
			console.warn('lost event');
			return;
		}
		var dest='alert submit when form changed.';
		var tagL='|INPUT|TEXTAREA|SELECT|'; //
		var t=ev.target;
		if(tagL.indexOf('|'+t.tagName+'|')==-1) return;
		var f=t.form, chg=false, s;
		
		for(var i=0; i<f.length; i++)
		{
			var inp=f[i];
			chg=chg||(inp.defaultValue!=undefined && inp.defaultValue!=inp.value)
				||((inp.type=='checkbox' || inp.type=='radio') && (inp.defaultChecked!=inp.checked));
				
			if(inp.tagName=='SELECT')
			{
				var chg2=false, def=false;
				for(var j=0; j<inp.length; j++)
				{
					def=def||inp[j].defaultSelected
					chg2=chg2||(inp[j].defaultSelected!=inp[j].selected);
				}
				chg=chg||((def||inp.selectedIndex>0)&&chg2);
			}

			if(inp.type=='submit')	s=inp;
		}
		if(!s){}
		else s.style.color=chg?'red':'';
	};
	
	
	this.fill=function(dat) 						// 資料填充
	{	this.form.fill(data);	};
	
	
//----------------------------------------------------
	var enterTab=function (e)
	{
		if(e.keyCode==116)	e.returnValue=false;
		
		if(e.target.tagName=='INPUT' && e.keyCode==13)
		{
			var inp=e.target, f=inp.form, l=f.elements;
			for(var i=0; i<l.length; i++)
			{
				if(l[i]==inp && l[i+1] && f.enterToTab)
				{
					e.returnValue=false;
					if(l[i+1].focus)	l[i+1].focus();
				}
			}
		}
	};
	f.onkeydown=enterTab;


//init

	f.addEventListener('input', function(ev){formChg(ev, this);});
	f.addEventListener('change', function(ev){formChg(ev, this);});
	
	for(var i=0; i<f.length; i++)
	{
		var inp=f[i];
		switch(inp.tagName)
		{
			case 'SELECT':										// SELECT 捲動
				inp.ev('wheel', SelectTool.doSelectWheel);
				break;
			case 'INPUT':
				if(inp.type=='number' || inp.type=='text')
					inp.selectFocus(1);
				if(inp.type=='number')
					inp.wheelInit();
				if(inp.type=='range')
					inp.wheelInit();
//				inp.addEventListener('keydown', enterTab);
					
				break;
		}
	}
} // end Form




//------------------------------------------------------------------------------input


HTMLInputElement.prototype.doWheel=function(ev)
{
if(debug) console.log('wheel start. ['+this.name+']');
	if(this.type=='range' || this.type=='number')
	{
		var e=eLog=ev||event||window.event;
		var d=(e.wheelDelta!=undefined && e.wheelDelta < 0) 	//wheelDelta 上正
			|| (e.detail!=undefined && e.detail > 0)  	// detail 下正
			|| (e.deltaY!=undefined && e.deltaY > 0) // IE
				?1:-1;
			
		
		if(IE)
		{
			var st=this.step-0||1
			if(d>0) this.value=parseInt(this.value/st-1)*st;
			else if(d<0) this.value=parseInt(this.value/st+1)*st;
		}
		else
		{
			if(d>0) this.stepDown();
			else if(d<0) this.stepUp();
		}
		ev.returnValue=false;
	}
	return false;
};

HTMLInputElement.prototype.wheelInit=function()
{
//	console.log(this.type);
	if(this.type=='number')
	{
		this.addEventListener('wheel'
			, function(ev)
			{
				if(document.activeElement!=this)	this.focus();
				if(IE) this.doWheel(ev);
//				ev.returnValue=false;
			}
		);
	}
		
	if(this.type=='range')
		this.addEventListener('wheel', function(event){ this.doWheel(event); } );
};



HTMLInputElement.prototype.isSelectFocusSeted=false;
HTMLInputElement.prototype.selectFocus=function(md)
{
	if(!this.isSelectFocusSeted && (this.isSelectFocusSeted=!!md))
		this.addEventListener('focus', function() {	this.select(); });
	return this.isSelectFocusSeted;
};

HTMLInputElement.prototype.insert=function(v1, pos)
{
	if(v1===null || v1===undefined || v1==='') return;
	if(typeof v1=='number') v1+='';

	var idx=0, v0=this.value, l0=v0.length, l1=v1.length;
	
	if(pos>=0) idx=Math.min(pos, l0);
	else if(pos<0) idx=Math.max(0, pos+l0);
	else if(this.selectionStart!= undefined)	idx=this.selectionStart;
	else if (document.selection) // old IE
	{
		this.focus();
		var Sel = document.selection.createRange ();
		Sel.moveStart ('character', -v0.length);
		idx = Sel.text.length;
	}
	else idx=l0;
	
	this.value=v0.substring(0, idx)+v1+v0.substring(idx);
	this.setSelectionRange(idx+l1, idx+l1);
};

/** Change param value */
HTMLInputElement.prototype.chgPara=
HTMLSelectElement.prototype.chgPara=
function(ev, remove)
{
	var e=eLog=ev||event||window.event
	, qu='', paraP={}
	, paraL=location.search.length>1
		?location.search.split("#")[0].substring(1).split('&'):[];

	var del=remove || this.dataset?this.dataset.remove:'';

	var nm=this.name
	, v="radio checkbox".indexOf(this.type)==-1 
		? this.value
		: (this.checked?this.value:'');

	for(var i=0; i<paraL.length; i++)
	{
		var t=paraL[i].split('=');
		if(1) // !paraP[t[0]])
		{
			if(nm==t[0])
			{
				t[1]=v;
				if(paraP[t[0]]) continue;
			}
			if(t.length>1)
			{
				if(!del){}
				else if(typeof(del)=="string" && t[0]===del)	continue;
				else if(typeof(del)=="object" && del.includes(t[0]))	continue;
				qu+='&'+t[0]+'='+(paraP[t[0]]=t[1]);
			}
		}
	}
	if(paraP[nm]===undefined)
		qu+='&'+nm+'='+v;


	if(this.thread)
		clearTimeout(this.thread);

	this.hash=this.id;
	var u=location.pathname+'?'+qu.substring(1)+(this.id?"#"+this.id:"");
	var s='?'+qu.substring(1);

	if(this.delay && this.delay-0>0)
		this.thread=setTimeout('location.search="'+s+'";', this.delay-0);
	else location.search=s;
};


HTMLInputElement.prototype.onlyPara=
HTMLSelectElement.prototype.onlyPara=
function(ev)
{
	var qu="?"+this.name+"="+this.value;

	if(this.thread)	clearTimeout(this.thread);

	this.hash=this.id;

	var s='?'+qu.substring(1);

	if(this.delay && this.delay-0>0)
		this.thread=setTimeout('location.search="'+s+'";', this.delay-0);
	else location.search=s;
	
}

/**
@summary Change url from < SELECT >
@param	blank: Blank page mode: 1: New page for other site(http), 2: Every link.
*/
HTMLSelectElement.prototype.jumpUrl=
function(blank)
{	if(this.value=='') return;

	if(blank==2 || blank==1 && this.value.indexOf("http")==0)
		window.open(this.value);
	else
		location.href=this.value;
}



//------------------------------------------------------------------------------select
var eLog;
var SelectTool=
{
/** 投入陣列 產生<OPT> str,  (txtKey ? array text : array index) */
	arrOption: function(dat, txtKey)
	{
		if(!dat) return '<option>no Data!!</option>';
		var r='';
		for(var ii in dat)
		{
			r+='<option value="'+(txtKey ? dat[ii].replace(/"/gi, "&quot;") : ii)+'">'+dat[ii]+'</option>\n';
		}
		return r;
	}
	
/** 投入清單 產生<OPT> str**/
	, optionMaker:function(itms, selVal, style)	//itms[n][id, name]
	{
		if(!style) style='';
		var s=[];
		for(ii=0; ii<itms.length; ii++)
			s[ii]="<option value='"+itms[ii][0]+"'"+(+itms[ii][0]==selVal?" selected":"")+" style='"+style+"'>"+itms[ii][1]+"</option>\n";
		return s.join();
	}

/** HTMLSelectElement.prototype.doSelectWheel=function()
 * wheel 事件實體 */
	, doSelectWheel:function(ev)
	{
		var e=eLog=ev||event||window.event;
		e.preventDefault();
		var d=(e.wheelDelta!=undefined && e.wheelDelta <= 0) 
			|| (e.detail!=undefined && e.detail > 0) 
			|| (e.deltaY!=undefined && e.deltaY > 0)?1:-1;	//wheelDelta 上正, detail 下正
		if(d<0 && this.selectedIndex>0) this.selectedIndex--;
		else if(d>0 && this.selectedIndex<this.length-1) this.selectedIndex++;
		ev.returnValue=false;
	}

	, optPromptTxt:'請選擇...'
//投入opt[]陣列, sel 自動選擇
	, getOptI:function (optList, selVal, prompt)
	{
	 var str=prompt?"<option value>"+this.optPromptTxt+"</option>\n":'';

	 for(var i=0; i<optList.length; i++)
	 {
	  if(optList[i]) str+="<option value='"+i+"'"+(i===selVal?" selected":"")+">"+optList[i]+"</option>\n";
	 }
	 return str;
	}
	
	
	, setOptI:function (dom, optList, selVal, appended)
	{
	 if(!dom || dom.tagName!='SELECT') return;

	 var str=SelectTool.getOptI(optList, selVal, !appended);
	 if(appended) dom.innerHTML+=str;
	 else dom.innerHTML=str;
	 
	 return dom;
	}
};

if(HTMLSelectElement)
{
	
	try
	{
	/** get value from select	*/
		Object.defineProperty(HTMLSelectElement.prototype, 'val', {
		  get: HTMLSelectElement.prototype.val2=function() {
			if(!this.length) return null;
			return this[this.selectedIndex].value;
		  }
		});
	}
	catch(e){}
	
	HTMLSelectElement.prototype.setOptI=function(optList, selVal, appended)
	{	SelectTool.setOptI(this, optList, selVal, appended); 
		return this;
	}

	// clear <OPTION>
	HTMLSelectElement.prototype.empty = HTMLSelectElement.prototype.clear=function()
	{	while(this.options.length) this.options.remove(0); 
		return this; 
	}
}





//------------------------------------------------------------------------------radio

var RadioTool=
{
	maker:function(name, itms, selVal, style)
	{
		if(!style) style='';
		var s=[];
		for(ii=0; ii<itms.length; ii++)
			s[ii]="<nobr><label class=radioLabel>"+
			"<input type=radio class=radio name="+name+" value='"+itms[ii][0]+"'"+(+itms[ii][0]==selVal?" checked":"")+" style='"+style+"'>"+itms[ii][1]+"</label></nobr>\n";
		return s.join();
	}
	
	, chg:function (obj)
	{
		if(!obj)	return;
		var dom=typeof(obj)=='string'?document.getElementById(obj) : obj;
		if(dom) dom.checked=!dom.checked;
	} 
	
	
	, Property_value:{
		get: function() 
		{
			if(this.length)
			{
				for(var ii=0; ii<this.length; ii++)
				{
					if(this[ii].checked)
						return this[ii].value;
				}
				return '';
			}
			else return '';
		}
		, set: function(val) 
		{
			if(this.length)
			{
				for(var ii=0; ii<this.length; ii++)
				{
					if(this[ii].value==val)
					{
						this[ii].checked=true;
						break;
					}
				}
				return val;
			}
			else return '';
		}
	}
	
	, Property_values:{
		get: function() 
		{
			if(this.length)
			{
				var r=[];
				for(var ii=0; ii<this.length; ii++)
				{
					if(this[ii].checked)
						r[r.length]=this[ii].value;
				}
				return r;
			}
			else return [];
		}
	}
	
	// get radio value by "name" *重複
	, radioVal:function(obj)
	{
		if(typeof(obj)=='string') obj=document.getElementsByName(obj);
		if(!obj || !obj.length) return null;
		var n=obj.length;
		
		if(obj.checked)	return obj.value;
		
		for(ii=0; ii<n; ii++)
		{
			if(obj[ii].checked)
				return obj[ii].value;
		}
		
		return null;
	}
};

if(typeof(RadioNodeList)!='undefined')
{
	Object.defineProperty(RadioNodeList.prototype, 'value', RadioTool.Property_value );
	Object.defineProperty(RadioNodeList.prototype, 'checkVal', RadioTool.Property_value );
	Object.defineProperty(RadioNodeList.prototype, 'checkVals', RadioTool.Property_values );
	
}

if(typeof(HTMLCollection)!='undefined')
{
	Object.defineProperty(HTMLCollection.prototype, 'value', RadioTool.Property_value );
	Object.defineProperty(HTMLCollection.prototype, 'checkVal', RadioTool.Property_value );
	Object.defineProperty(HTMLCollection.prototype, 'checkVals', RadioTool.Property_values );
	
}

Object.defineProperty(HTMLInputElement.prototype, 'checkVal', {
	get: function() 
	{
		if(this.type=='radio'||this.type=='checkbox')
			return this.checked?this.value:'';
		else return this.value;
	}
});


