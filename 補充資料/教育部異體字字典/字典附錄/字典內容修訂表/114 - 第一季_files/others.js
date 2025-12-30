
//------------------------------------------------------------------------------	table

function keyDown(event, tab) 
{ 

	if(typeof tab=='string')
		tab=document.getElementById(tab);

	var event=window.event||event;
	var key=event.keyCode; 
	if(key<37 || key>40) return;


	var inp=event.target;
	if(!tab.contains(inp)) return; 
	
	var inpL0=tab.getElementsByTagName("INPUT"), inpL=inpL0; 
	if(!inpL0.length) return;
	
	var del='|hidden|', pass='||text|number|checkbox|radio|submit|';
	
	var tr1=inp, trL;
	while(tr1 && tr1.tagName!='TR')	tr1=tr1.parentNode;
	if(!tr1) return;
	trL=tr1.parentNodel
	var act=0, n=0, colL=tr1.getElementsByTagName("INPUT"), col=0;
	for(var i=0; i<colL.length; i++)
	{
		if(pass.indexOf('|'+(colL[i].getAttribute("type")||'').toLowerCase()+'|')!=-1)
			col++;
	}
	col=colL.length;

	for(; act<inpL.length; act++) 
		if(inpL[act]===inp) break; 
	
	
var skip='|radio|submit|hidden|';
	
	var a=-1;
	switch(key) 
	{ 
		case 37: 
			while(act>0 && skip.indexOf('|'+(inpL[a=--act].getAttribute("type")||'').toLowerCase()+'|')>=0); 
			break; 
		case 38: 
			if(act-col>=0) a=act-col; 
			break; 
		case 39: 
			while(act<inpL.length-1 && skip.indexOf('|'+(inpL[a=++act].getAttribute("type")||'').toLowerCase()+'|')>=0);
			break; 
		case 40: 
			if(act+col <inpL.length) a=act+col;
			break; 
	} 
	if(a!=-1)
	{
		inpL[a].focus(); 
		inpL[a].select(); 
	}
} 


function inputTab2(event, tab) //方向鍵INPUT
{
//	if(debug) alert('start');
	if(typeof tab =="string")
		tab=document.getElementById(tab);

	var event=window.event||event;
	var key=event.keyCode; 
	if(key<37 || key>40)
	{
		
		return;
	}

	var focus=document.activeElement; 
	if(!tab.contains(focus))
	{
		if(debug) alert('No focus!');
		return; 
	}
	
	var inputs=tab.getElementsByTagName("INPUT"); 
	if(!inputs.length) return;
	var l=0;
	var tr=tab, tB=tab.tBodies[0];
	while(tB.tagName!='TBODY'&&tB.children[0])	tB=tB.children[0];
	tr=tB;
	n=0;
//	for(; n<tr.children.length && (tr.children[n].tagName!="TR" || tr.children[n].getElementsByTagName("INPUT").length==0); n++);
	for(; n<tB.children.length && !tr.children[n].contains(focus); n++);
	if(n<tB.children.length) tr=tB.children[n];
	else
	{
		if(debug) alert('not find row');
		return;
	}
	
//	alert(n+": "+tr.tagName+","+tr.getElementsByTagName("INPUT").length+", "+tr.nextSibling);
//	for(; !(l=tr.getElementsByTagName("INPUT").length) && tr.nextSibling && tr.nextSibling.tagName=='TR'; n++)//
//		tr=tr.nextSibling;
	l=tr.getElementsByTagName("INPUT").length;
	if(!l)
	{
		if(debug) alert('no input');
		return;
	}
	
	if(tr.tagName!='TR')
	{
		if(debug) alert(tr.tagName);
		return;
	}
	
	var i=0;
	for(; i<inputs.length; i++) //load input
		if(inputs[i]===focus) break; 
	
	var a=-1;
	switch(key) 
	{ 
		case 37: //left
			a=i;
			while(--a>=0 && (inputs[a].getAttribute("type")=='radio' || inputs[a].getAttribute("type")=='hidden')); 
		  //  if(i>0) a=i-1; 
			break; 
		case 38: //u
			if(i-l>=0) a=i-l; 
			break; 
		case 39: //r
			a=i;
			while(++a<inputs.length-1 && (inputs[a].getAttribute("type")=='radio' || inputs[a].getAttribute("type")=='hidden'));
		 //   if(i<inputs.length-1) a=i+1;
			break; 
		case 40: //d
			if(i+l <inputs.length) a=i+l;
			break; 
	} 
	if(a!=-1)
	{
		if(debug) alert(i+" > "+a+", "+l);
		inputs[a].focus(); 
		inputs[a].select(); 
//		inputs[a].setSelectionRange(0, inputs[a].value.length); 
//		document.getElementById("obj").value=inputs[a].value;
	}
	else if(debug) alert('nothing');
} 



//----------------------------------------------------------- panel 

var panelG={};

/** panel switcher */
function panel(prefix, ev, tag)
{
	if(typeof ev =='number') 
	{
		head=_.id(prefix+"H"+ev);
		cont=_.id(prefix+ev);
	}
	else if(ev.target.dataset.key=='') return;
	else
	{
		head=ev.target;
		cont=prefix+ev.target.dataset.key;
	}
	
	if(t=panelG[prefix])
	{
		_.id(prefix+t.dataset.key).style.display='none';
		t.className='';
	}
	
/* 	for(var i=1; obj(prefix+i); i++)
	{
		obj(prefix+i).style.display='none';
		obj(prefix+'H'+i).className='';
	}
 */

	_.id(cont).style.display='';
	_.id(head).className='act';

	panelG[prefix]=head;
}


//------------------------------------------------------------------------------	unuse



function info(id)
{
	var dom=document.getElementById(id);
	if(!dom)
		alert('null['+id+']');
	else
		alert("tagName: "+dom.tagName+
"\nschemaTypeInfo: "+dom.schemaTypeInfo+
"\ndisplay: "+dom.style.display+
"\noffsetParent: "+dom.offsetParent+
"\nleft: "+dom.style.left+
"\ntop: "+dom.style.top+
"\nwidth: "+dom.style.width+
"\nheight: "+dom.style.height+
"\noffsetLeft: "+dom.offsetLeft+
"\noffsetTop: "+dom.offsetTop+
"\noffsetWidth: "+dom.offsetWidth+
"\noffsetHeight: "+dom.offsetHeight+
"\nscrollWidth: "+dom.scrollWidth+
"\nscrollHeight: "+dom.scrollHeight+
"\nscrollLeft: "+dom.scrollLeft+
"\nscrollTop: "+dom.scrollTop+
(dom.filters?"\nopacityI: "+(dom.filters.alpha.opacity):"")+
"\nopacityF: "+(dom.style.opacity)+
'');
}



//---------------------------------------------------------------------------------

// in: r,g,b in [0,1], out: h in [0,360) and s,l in [0,1]
function rgb2hsl(r,g,b) {
  let v=Math.max(r,g,b), c=v-Math.min(r,g,b), f=(1-Math.abs(v+v-c-1)); 
  let h= c && ((v==r) ? (g-b)/c : ((v==g) ? 2+(b-r)/c : 4+(r-g)/c)); 
  return [60*(h<0?h+6:h), f ? c/f : 0, (v+v-c)/2];
}

// input: h as an angle in [0,360] and s,l in [0,1] - output: r,g,b in [0,1]
function hsl2rgb(h,s,l) 
{
   let a=s*Math.min(l,1-l);
   let f= (n,k=(n+h/30)%12) => l - a*Math.max(Math.min(k-3,9-k,1),-1);
   return [f(0),f(8),f(4)];
}


// input: r,g,b in [0,1], out: h in [0,360) and s,v in [0,1]
function rgb2hsv(r,g,b) {
  let v=Math.max(r,g,b), c=v-Math.min(r,g,b);
  let h= c && ((v==r) ? (g-b)/c : ((v==g) ? 2+(b-r)/c : 4+(r-g)/c)); 
  return [60*(h<0?h+6:h), v&&c/v, v];
}

// input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,1]
function hsv2rgb(h,s,v) 
{
  let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
  return [f(5),f(3),f(1)];
}



