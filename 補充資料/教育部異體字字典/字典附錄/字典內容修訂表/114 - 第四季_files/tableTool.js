//table-----------------------------------------------------------

function clickedTag(e, tag)
{
	var o=e.target;
	for(; o.parentElement; o=o.parentElement)
		if(o.tagName==tag)	return o;
	return null;
}

function clickedTr(e)
{	return clickedTag(e, 'TR');	}
function clickedTrID(e)
{	return (tr=clickedTag(e, 'TR'))?tr.id:null; }

//HTMLTableRowElement.prototype.bgc=function(c){	this.style.background=c; }
function trBgc(event, color)
{
	var tr=clickedTr(event);
	if(tr)
		tr.style.background=color;
}


//---table--------------------------------------------------------------------------


 function fixedHead(hTab, bTab, height)
{ 
 if(typeof hTab =='string') hTab=obj(hTab);
 if(typeof bTab =='string') bTab=obj(bTab);
 if(!hTab.rows.length || !bTab.rows.length) return;
 var trH = hTab.rows[hTab.rows.length-1]; 
 var trB = bTab.rows[0]; 
 
 hTab.style.backgroundColor='#ffffff';
 if(hTab.caption)
	hTab.caption.style.backgroundColor='#eeeeee';

	
// var   tr1   =   document.getElementById(hTab).children[0].children[0]; 
// var   tr2   =   document.getElementById(cTab).children[0].children[0]; 
 var   headT   =   trH.cells; 
 var   bodyT   =   trB.cells; 

	if(headT.length!=bodyT.length)
	{
		alert('TABLE長度不匹配!! ['+headT[0].tagName+": "+headT.length+', '+bodyT[0].tagName+": "+bodyT.length+']');
		return;
	}
		for(var i=0;i <headT.length;i++)
			headT[i].style.width =''; 
	var div=bTab.parentElement;

	if(div.tagName=='DIV')
	{
		div.style.overflowY='scroll';
		hTab.style.marginRight=(div.offsetWidth-div.clientWidth)+'px';
		if(height)
		{
			div.style.overflowY='scroll';
			div.style.height=(height>0
				?document.body.clientHeight-height
				:hTab.parentElement.clientHeight)+"px";
		}
	}
	
	for(var n=0; n<3; n++)
	{
		for(var i=0; i <headT.length; i++){ 
			if(headT[i].clientWidth>bodyT[i].clientWidth) 
				bodyT[i].style.width = headT[i].style.width = (headT[i].curStyle.width); 
			else 
				bodyT[i].style.width = headT[i].style.width = (bodyT[i].curStyle.width); 
		}
		
	}


	if(div.tagName=='DIV')
	{
//		hTab.style.width=bTab.style.width=bTab.clientWidth+'px';

		hTab.style.position='relative';
		hTab.style.marginBottom=-hTab.offsetHeight+"px";
		bTab.style.marginTop=hTab.offsetHeight+"px";
	}

}

HTMLTableElement.prototype.fixedHead=function(hTab, h)
{

	fixedHead(hTab, this, h);
	return this;
}

HTMLTableElement.prototype.fixedHead2=function(h)
{
	var hdL, bdL;
	try
	{
		if(this.tHead.rows.length)
		{
			hdL=this.tHead.rows[this.tHead.rows.length-1].cells;
			bdL=this.tBodies[0].rows[0].cells;
		}
		else if(this.tBodies.length>1)
		{
			hdL=this.tBodies[0].rows[this.tHead.rows.length-1].cells;
			bdL=this.tBodies[1].rows[0].cells;
		}
		else
		{
			alert('no table header find!!');
			return;
		}
		
		if(hdL.length!=bdL.length)
		{
			console.warn('資料長度不等', this);
			return this;
		}
	}
	catch(e)
	{
		console.error(e);
		return this;
	}

	
	
	for(var i=0; i<hdL.length; i++)
	{
		hdL[i].style.width=bdL[i].style.width=hdL[i].offsetWidth+'px'; // 含邊
	}

	var div=document.createElement('DIV')
	, div0=document.createElement('DIV')
	, head=document.createElement('TABLE')
	, br=document.createElement('BR');
	

	head.className=this.className;
	if(this.id)
	{
		head.id=this.id+"Head";
		div.id=this.id+"Frame";
	}

	if(this.caption)
		head.appendChild(this.caption);

	head.border=this.border;
	head.bgColor=this.bgColor;
	head.cellPadding=this.cellPadding;
	head.cellSpacing=this.cellSpacing;

	if(this.background)
		head.background=this.background;
	if(this.curStyle.backgroundImage!='none')
		head.style.backgroundImage=this.curStyle.backgroundImage;

	head.style.backgroundColor=this.curStyle.backgroundColor!='rgba(0, 0, 0, 0)'
		?this.curStyle.backgroundColor
		:"#FFFFFF";

	head.appendChild(this.tHead.rows.length?this.tHead:this.tBodies[0]);

	div.align=head.align=this.align;


	this.insertAdjacentElement('beforebegin', div0);
//	div.insertAdjacentElement('beforebegin', head);

	div0.appendChild(head);
	div0.appendChild(br);
	div0.appendChild(div);
	div.appendChild(this);

	div0.style.margin=this.curStyle.margin;
	div.style.overflow='auto';
	div.style.maxHeight=window.innerHeight-(h?h-0:0)+"px";

	head.style.display=div.style.display="inline-block";
	head.style.marginBottom=-head.offsetHeight+'px';
	head.style.marginRight=(div.offsetWidth-div.clientWidth)+'px';
	head.style.position='relative';
	head.style.zIndex=999;

	this.style.margin=0;
	this.style.marginTop=head.offsetHeight+'px';

	head.style.width=this.offsetWidth+'px';

	return this;
}

//----------------

function highLineY(event)
{
	if(!event) return;
	if(event.target.tagName!="TD")
	{
		alert("No table!");
		return;
	}
	
	var tab=event.target;
	
	while((tab=tab.parentElement) && tab.tagName!='TABLE');
	
	if(!tab || !tab.tBodies.length)
	{
		
		return;
	}
	
	var row=tBodies[0].rows;
}



