
var HtmlTool=
{
	bgc:function(dom, val){ if(dom && dom.style) dom.style.backgroundColor=val; } 
	
};


if(HTMLElement)
{
	
}



//																				rotate
HTMLElement.prototype.deg=0;
HTMLElement.prototype.rotate=function(inp)
{
	if(isNaN(inp)) return;
	inp%=360;
	if(inp>180) inp-=360;
	if(inp<-180) inp+=360;
	this.deg=inp;
	
		var obj=this;
		if(!obj)	return;
		var wid=obj.clientWidth, hei=obj.clientHeight, len=Math.sqrt(wid*wid+hei*hei)/2, deg0=Math.atan(hei/wid)/Math.PI*180-180
		, Dx=(Math.cos((deg0+inp)/180*Math.PI)*len+(wid/2)) ,Dy=(Math.sin((deg0+inp)/180*Math.PI)*len+(hei/2));
		
		if(IE&&obj.filters) obj.style.filter=
		'progid:DXImageTransform.Microsoft.Matrix(Dx='+Dx+', Dy='+Dy+', M11='+Math.cos(inp/180*Math.PI)+',M12='+ -Math.sin(inp/180*Math.PI)+',M21='+Math.sin(inp/180*Math.PI)+',M22='+ Math.cos(inp/180*Math.PI)+');';
		else
		{
			obj.style['-webkit-transform']="rotate("+inp+"deg)";
			obj.style['-webkit-transform-origin']="";
			obj.style['-moz-transform']="rotate("+inp+"deg)";
			obj.style['transform']="rotate("+inp+"deg)";
			obj.style['transform-origin']="";
		}
	return this;
}

//------------------------------------------------------------------------------	opacity

HTMLElement.prototype.opacityV=1;
HTMLElement.prototype.opacity=function(val)

{
	if(isNaN(val)||val>100) val=100;
	else if(val<0) val=0;
	if(IE && this.filters)
	{
		this.style.filter="alpha(opacity=" + val + ")";
	}
	else
	{
		this.style.opacity =(val/100);
	}
	return this;
}

//------------------------------------------------------------------------------	background


HTMLElement.prototype.bgc=function(val)
{	this.style.backgroundColor=val;
	return this; };






//---Thread--------------------------------------------------------------------------
var actList=new Array();

var threadT0=new Date().getTime(), threadT1=0, threadT2=0, pause=false, tCount=0;
var uniPool={'moveTo':[], 'sizeTo':[], 'opacityTo':[]};
var uniT1=null, threadStart=true;
var threadTime=0, Hz=40;
function uniThread()
{
	threadT1=new Date().getTime()
	if(threadT1<threadT0 || pause) return;
	
	var count=0;
	for(var key in uniPool['moveTo'])
	{
		if(!uniPool['moveTo'][key] || !actList[key] || !actList[key]['moveTo'])
			delete uniPool['moveTo'][key];
		else
			moveTo2(key);
		count++;
	}
	for(var key in uniPool['sizeTo'])
	{
		if(!uniPool['sizeTo'][key] || !actList[key] || !actList[key]['sizeTo'])
			delete uniPool['sizeTo'][key];
		else
			sizeTo2(key);
		count++;
	}
	for(var key in uniPool['opacityTo'])
	{
		if(!uniPool['opacityTo'][key] || !actList[key] || !actList[key]['opacityTo'])
			delete uniPool['opacityTo'][key];
		else
			opacityTo2(key);
		count++;
	}
//		if(!count)	clearInterval(uniT1);
//		threadT1=(new Date().getTime()-threadT0);
		var str='';
		if(t=threadT1-threadT2)
		{
			str=parseInt(10000/t+0.5)/10;
			if( document.getElementById('fps')) document.getElementById('fps-'+ (tCount&15)).innerHTML=str+'fps. '+t+' ms.';
		}
		while(threadT1>=threadT0) threadT0+=Hz;
		//threadT0=threadT1;
	threadT2=threadT1;
	tCount++;
}


function threadInit() //core start
{
	if(threadStart)
	{
		uniT1=setInterval("uniThread();", 1);
		threadStart=false;
		if( document.getElementById('fps'))
		{
			s='';
			for(i=0; i<16; i++) s+='<tr><td id=fps-'+i+' align=right>';
			document.getElementById('fps').innerHTML='<table border=1 align=right>'+s+'</table>';
		}
	}
}


//actList[id][func]=inp
function poolInit(id, func, inp) //20140919
{
	if(!id) return null; 
	if(!actList[id])	actList[id]={};
	if(inp)
	{
		if(!actList[id][func] || inp['force'])//new || replace
			return (actList[id][func]=inp);
		else
			return null;
	}
	else if(actList[id][func])
		return actList[id][func];
	else 
		return null;
}


//位置控制----------------------------------------------------------------------


function posInit(id)
{
	var dom=document.getElementById(id);
	if(!dom) return;
	
	if(dom.style.left=='' || dom.style.top=='')
	{
		var pos0=getPos(dom);
		if(!pos0) return;
		var px0=dom.offsetLeft, py0=dom.offsetTop
		if(pos0)
		{
			dom.style.left='0px';
			dom.style.top='0px';
			var pos1=getPos(dom);
//			var px1=dom.offsetLeft, py1=dom.offsetTop
//			alert(pos0+"-"+pos1);
			dom.style.left=(pos0[0]-pos1[0])+"px";
			dom.style.top=(pos0[1]-pos1[1])+"px";
//			dom.style.left=(px0-px1)+"px";
//			dom.style.top=(py0-py1)+"px";

//alert("init["+id+"]["+pos0+"], ["+pos1+"], "+dom.style.left+","+dom.style.top);
		}
	}
}

function moveTo2(id, inp)//toX, toY, speed, vX0, vY0)
{
	if(pause)return;
	var fme=document.getElementById(id);
	if(!fme)
	{
		delete actList[id]['moveTo'];
		return;
	}

	if(inp)// && inp.uni)
	{
		if(!uniPool['moveTo'][id])
		{
			uniPool['moveTo'][id]=1;
			threadInit();
		}
		inp['sTime']=new Date().getTime()+(inp.wait?inp.wait:0);
		inp=poolInit(id, 'moveTo', inp);
//		delete inp['wait'];
		return;
	}
	else
		inp=poolInit(id, 'moveTo');
	if(!inp) return;

	posInit(id);
	var x0=parseInt(fme.style.left.replace(/![0-9|-]/gi, '')), y0=parseInt(fme.style.top.replace(/![0-9|-]/gi, ''));
//	var x0=fme.offsetLeft, y0=fme.offsetTop;
	if(isNaN(x0) || isNaN(y0))
	{
		delete actList[id]['moveTo'];
		return;
	}

	var t2=new Date().getTime()-inp.sTime;
	if(t2<0) return;
	
	if(isNaN(inp.stX)) inp.stX=x0;
	if(isNaN(inp.stY)) inp.stY=y0;
	if(isNaN(inp.toX)) inp.toX=x0;
	if(isNaN(inp.toY)) inp.toY=y0;
	if(isNaN(inp.fadeSp)) inp.fadeSp=1.7;
	if(isNaN(inp.mode)) inp.mode=0;

	var toX=inp['toX']
	, toY=inp['toY']
	, distX=inp.toX-inp.stX
	, distY=inp.toY-inp.stY
	, i=(distX!=0?1:0)+(distY!=0?2:0), j=[0, Math.abs(distX), Math.abs(distY), Math.sqrt(distX*distX+distY*distY)], sp=inp.speed
	, dist=j[i];
	
	j=[(dist/sp-1)*Hz, dist/sp*Hz, 0];
	if(isNaN(inp.tLim)) inp.tLim=j[inp.mode];
	if(isNaN(inp.vX)) inp.vX=sp*distX/dist;
	if(isNaN(inp.vY)) inp.vY=sp*distY/dist;
	stop=true;
	
	if(dist)
	{
		var vX=inp.vX, vY=inp.vY, x2=0, y2=0;
//		var v0=t2/Hz*sp/dist;
			if(t2>inp.tLim)
			{
				if(inp.mode==0)
				{
					t3=Math.log(sp)*2;

					if(t2-inp.tLim < t3*Hz)
					{
						t4=Math.pow(Math.E, (t3-(t2-inp.tLim)/Hz)/2);
						stop=false;
						t3=1-Math.pow((t2-inp.tLim)/Hz/6, 1/3);
						if(distX)
							fme.style.left=(x2=inp.toX-(vX*t4/sp))+"px";
						if(distY)
							fme.style.top=(y2=inp.toY-(vY*t4/sp))+"px";
					}
					else
					{
						if(distX)
							fme.style.left=inp.toX+"px";
						if(distY)
							fme.style.top=inp.toY+"px";
					}
				

/*				if(isNaN(inp.fCount)) inp.fCount=1;
				else	inp.fCount++;
				
				a=(t2/Hz)-(dist-Hz)/inp.speed;
				var k=0
				
				for(i=0; i<inp.fCount; i++, sp/=inp.fadeSp);
				sp=parseInt(sp);
//				for(i=1; inp.speed>i; i*=inp.fadeSp, k++);
				if(sp)
					stop=false;
					if(distX)
						fme.style.left=(x2=inp.toX-(sp?parseInt(vX*sp/inp.speed):0))+"px";
					if(distY)
						fme.style.top=(y2=inp.toY-(sp?parseInt(vY*sp/inp.speed):0))+"px";
*/
				}
				else if(inp.mode==1)
				{
				}
			}
			else
			{
				if(distX)
					fme.style.left=(x2=parseInt(inp.stX+vX*t2/Hz))+"px";
				if(distY)
					fme.style.top=(y2=parseInt(inp.stY+vY*t2/Hz))+"px";
				stop=false;
			}
			
/*			for(var i=0; (1.3*inp['speed'])>=dist && i<10; i++)
			{
				inp['speed']>>=1;
				if(inp['lowSp'] && inp['lowSp']>inp['speed']) 
					inp['speed']=inp['lowSp']>dist?dist:inp['lowSp'];
				if(inp['speed']<1) inp['speed']=1;
			}
			if(distX)
			{	vX=parseInt(inp['speed']*distX/dist);
				if(vX==0)	vX=distX>0?1:-1;
				if(distX>0)
				{	if(vX>distX) vX=distX;
				}
				else if(vX<distX) vX=distX;
			}
			if(distY)
			{	vY=parseInt(inp['speed']*distY/dist);
				if(vY==0)	vY=distY>0?1:-1;
				if(distY>0)
				{	if(vY>distY) vY=distY;
				}
				else if(vY<distY) vY=distY;
			}
	//alert(JSON.stringify(inp)+", "+distX+"="+toX+" - "+x0+", "+distY+"="+toY+" - "+y0+", "+vX+", "+vY);
				
			fme.style.left=(x0+vX)+"px";
			fme.style.top=(y0+vY)+"px";
*/
	}
		
//if(debug && id=='bus9') debug=confirm('move 2 ['+x2+', '+y2+']');
//if(id=='cTo9')	document.getElementById("info").innerHTML+='move['+id+']: p['+x0+', '+y0+'], f['+inp.stX+', '+inp.stY+'], t['+toX+', '+toY+'], s['+x2+', '+y2+'], di['+distX+', '+distY+'], lim:'+inp.tLim+'<br>';
		
	if(stop)
	{	delete actList[id]['moveTo'];
		if(uniPool['moveTo'][id])	delete uniPool['moveTo'][id];
		if(inp['callBack'])	inp['callBack']();
	}
//		else if(!inp['uni'])
//			setTimeout('moveTo2("'+id+'");', 50);

}


/*
 wait: 延遲
 stX,stY: 起始
 toX,toY: 結束
 tLim: 時間
*/
function moveTo4(id, inp)//20140919
{
	if(pause) return;
	var fme=obj(id);
	if(!fme)
	{
		delete actList[id]['moveTo'];
		if(debug)	alert('[move] '+id+' is null!!');
		return;
	}

	if(inp) //if new
	{
		if(!uniPool['moveTo'][id]) // loop init
		{
			uniPool['moveTo'][id]=1;
			threadInit();
		}
		inp['sTime']=new Date().getTime()+(inp.wait?inp.wait:0);//起始時間
		inp=poolInit(id, 'moveTo', inp);
		return;
	}
	else
		inp=poolInit(id, 'moveTo');
	if(!inp) return;

	posInit(id);
	var x0=parseInt(fme.style.left.replace(/![0-9|-]/gi, '')), y0=parseInt(fme.style.top.replace(/![0-9|-]/gi, ''));
	if(isNaN(x0) || isNaN(y0))
	{
		delete actList[id]['moveTo'];
		return;
	}

	var t2=new Date().getTime()-inp.sTime;
	if(t2<0) return;
	
	if(isNaN(inp.stX)) inp.stX=x0;
	if(isNaN(inp.stY)) inp.stY=y0;
	if(isNaN(inp.toX)) inp.toX=x0;
	if(isNaN(inp.toY)) inp.toY=y0;
	if(isNaN(inp.fadeSp)) inp.fadeSp=1.7;
	if(isNaN(inp.mode)) inp.mode=0;

	var toX=inp['toX'], toY=inp['toY']//目標
	, sp=inp.speed
	, distX=inp.toX-inp.stX, distY=inp.toY-inp.stY //距離
	, dist=[0, Math.abs(distX), Math.abs(distY), Math.sqrt(distX*distX+distY*distY)][(distX!=0?1:0)+(distY!=0?2:0)]; //總距離
	
	j=[(dist/sp-1)*Hz, dist/sp*Hz, 0];
	if(isNaN(inp.tLim)) inp.tLim=j[inp.mode];
	if(isNaN(inp.vX)) inp.vX=sp*distX/dist;
	if(isNaN(inp.vY)) inp.vY=sp*distY/dist;
	var stop=true;
	
	if(dist)
	{
		var vX=inp.vX, vY=inp.vY, x2=0, y2=0;
			if(t2>inp.tLim)
			{
				if(inp.mode==0)
				{
					t3=Math.log(sp)*2;

					if(t2-inp.tLim < t3*Hz)
					{
						t4=Math.pow(Math.E, (t3-(t2-inp.tLim)/Hz)/2);
						stop=false;
						t3=1-Math.pow((t2-inp.tLim)/Hz/6, 1/3);
						if(distX)
							fme.style.left=(x2=inp.toX-(vX*t4/sp))+"px";
						if(distY)
							fme.style.top=(y2=inp.toY-(vY*t4/sp))+"px";
					}
					else
					{
						if(distX)
							fme.style.left=inp.toX+"px";
						if(distY)
							fme.style.top=inp.toY+"px";
					}
				}
				else if(inp.mode==1)
				{
				}
			}
			else
			{
				if(distX)
					fme.style.left=(x2=parseInt(inp.stX+vX*t2/Hz))+"px";
				if(distY)
					fme.style.top=(y2=parseInt(inp.stY+vY*t2/Hz))+"px";
				stop=false;
			}
			
	}
		
		
	if(stop)
	{	delete actList[id]['moveTo'];
		if(uniPool['moveTo'][id])	delete uniPool['moveTo'][id];
		if(inp['callBack'])	inp['callBack']();
	}
}



//20160112
/*
 wait: 延遲
 sX,sY: 起始
 eX,eY: 終點
 time: 時間
 eRate: 終點速率
*/
function moveTo5(id, inp)//20140919
{
	if(pause || !id) return;
	if(!actList[id]) actList[id]={};
	
	var fme=typeof id =="string"?obj(id):id;
	if(!fme)
	{
//		delete actList[id]['moveTo'];
		if(debug)	alert('[move] '+id+' is null!!');
		return;
	}

	if(inp) //if new
	{
		posInit(id);
		var x0=parseInt(fme.style.left.replace(/![0-9|-]/gi, ''))
		, y0=parseInt(fme.style.top.replace(/![0-9|-]/gi, ''));
		if(isNaN(x0) || isNaN(y0))
		{
//			delete actList[id]['moveTo'];
			return;
		}
		
		//para init
		if(isNaN(inp.sX)) inp.sX=x0;//起點
		if(isNaN(inp.sY)) inp.sY=y0;
		if(isNaN(inp.eX)) inp.eX=inp.sX;//終點
		if(isNaN(inp.eY)) inp.eY=inp.sY;
		if(isNaN(inp.eRate)) inp.eRate=1; //終點速率(倍)

		inp.sTime=new Date().getTime()+(inp.wait?inp.wait:0);//起始時間
		var distX=inp.distX=inp.eX-inp.sX
		, distY=inp.distY=inp.eY-inp.sY; //距離
		var dist=inp.dist=[0, Math.abs(distX), Math.abs(distY), Math.sqrt(distX*distX+distY*distY)][(distX!=0?1:0)+(distY!=0?2:0)]; //總距離
		
		// loop init
		if(!uniPool['moveTo'][id])
		{
			uniPool['moveTo'][id]=1;
			threadInit();
		}
		inp=poolInit(id, 'moveTo', inp);
		return;
	}
	else
		inp=poolInit(id, 'moveTo');
	if(!inp) return; //para


	var t2=new Date().getTime()-inp.sTime;
	if(t2<0) return;
	
	
	var sp=inp.speed;
	
//	if(isNaN(inp.tLim)) inp.tLim=[(dist/sp-1)*Hz, dist/sp*Hz, 0][inp.mode];
	if(isNaN(inp.vX)) inp.vX=sp*distX/dist;
	if(isNaN(inp.vY)) inp.vY=sp*distY/dist;
	var stop=true;
	
	if(dist)
	{
	
	}
}


//V mode old yyyy??
function moveTo3(id, inp)//toX, toY, speed, vX0, vY0)
{
//	if(inp) document.getElementById('workArea').innerHTML+=" | move st"+JSON.stringify(inp)+", ";
	inp=poolInit(id, 'moveTo', inp);
	var fme=document.getElementById(id);
	if(!fme)
	{
		actList[id]['moveTo']=null;
		return;
	}
	posInit(id);
	var x1=parseInt(fme.style.left.replace(/![0-9|-]/gi, '')), y1=parseInt(fme.style.top.replace(/![0-9|-]/gi, ''));
	if(isNaN(x1) || isNaN(y1))
	{
		alert('moveTo2:null pos!!'+fme.style.left+","+fme.style.top);
		actList[id]['moveTo']=null;
		return;
	}

	if(inp)
	{
//		document.getElementById('workArea').innerHTML+="pos["+id+"]"+x1+"+"+vX0+","+y1+"+"+vY0+","+fme.style.left+","+fme.style.top+",";
		var toX=isNaN(inp['toX'])?x1:inp['toX'], toY=isNaN(inp['toY'])?y1:inp['toY'];
		var distX=toX-x1, distY=toY-y1, dist=Math.sqrt(distX*distX+distY*distY);
		var vX=0, vY=0;
		if(dist)
		{
			for(var i=0; (1.3*inp['speed'])>=dist && i<10; i++)
			{
				inp['speed']>>=1;
				if(inp['lowSp'] && inp['lowSp']>inp['speed']) 
					inp['speed']=inp['lowSp']>dist?dist:inp['lowSp'];
				if(inp['speed']<1) inp['speed']=1;
			}
			if(distX)
			{	vX=parseInt(inp['speed']*distX/dist);
				if(vX==0)	vX=distX>0?1:-1;
			}
			if(distY)
			{	vY=parseInt(inp['speed']*distY/dist);
				if(vY==0)	vY=distY>0?1:-1;
			}
	//alert(JSON.stringify(inp)+", "+distX+"="+toX+" - "+x1+", "+distY+"="+toY+" - "+y1+", "+vX+", "+vY);
				
			fme.style.left=(x1+vX)+"px";
			fme.style.top=(y1+vY)+"px";
		}
		
		if(Math.abs(toX-x1)>1 || Math.abs(toY-y1)>1)
			setTimeout('moveTo2("'+id+'");', 50);
		else
		{	actList[id]['moveTo']=null;
			if(inp['callBack'])
			{
//document.getElementById('workArea').innerHTML+=("move call["+id+"],");
				inp['callBack']();
			}
		}
	}
}

function moveGive(id, inp)//toX, toY, speed, lowSp, give, force
{
//document.getElementById('workArea').innerHTML+=('mG['+id+'], ');

	var fme=document.getElementById(id);
	if(!fme) alert('no id['+id+']');

	posInit(id);
	var pos=getPos(fme);
	var x1=pos[0], y1=pos[1];

//document.getElementById('workArea').innerHTML+=('mG st['+id+'], ');
		var toX=isNaN(inp['toX'])?x1:inp['toX'], toY=isNaN(inp['toY'])?y1:inp['toY'];
		var distX=toX-x1, distY=toY-y1, dist=Math.sqrt(distX*distX+distY*distY);
		var gX=0, gY=0, speed=inp['speed'];

		var inp2={"speed":inp['speed']}, inp3={};
		inp2['lowSp']=(inp['lowSp']?inp['lowSp']:inp['give']>>1)
		inp3["speed"]=inp2['lowSp'];
		if(inp['force'])	inp2['force']=1;
		if(inp['uni'])	inp2['uni']=inp3['uni']=1;
		if(inp['wait'])	inp2['wait']=inp['wait'];
		if(distX)
		{	gX=parseInt(inp['give']*distX/dist);
			if(gX==0)	gX=distX>0?1:-1;
			inp2['toX']=inp['toX']+gX;
			inp3['toX']=inp['toX'];
		}
		if(distY)
		{	gY=parseInt(inp['give']*distY/dist);
			if(gY==0)	gY=distY>0?1:-1;
			inp2['toY']=inp['toY']+gY;
			inp3['toY']=inp['toY'];
		}
		inp2["callBack"]=function() { setTimeout('moveTo2("'+id+'", '+JSON.stringify(inp3)+')', 1); 
		};
//alert(JSON.stringify(inp2));
		moveTo2(id, inp2);	
}
//-----------------------------------------------------------------------------------------------------------------大小控制
function sizeTo2(id, inp)//toW, toH, speed)
{
	if(pause)return;
	var fme=document.getElementById(id);
	if(!fme)
	{
		delete actList[id]['sizeTo'];
		return;
	}

	if(inp)// && inp.uni)
	{
		if(!uniPool['sizeTo'][id])
		{
			uniPool['sizeTo'][id]=1;
			threadInit();
		}
		inp['sTime']=new Date().getTime()+(inp.wait?inp.wait:0);
		inp=poolInit(id, 'sizeTo', inp);
		return;
	}
	else
		inp=poolInit(id, 'sizeTo');
	if(!inp) return;

	var w0=fme.clientWidth, h0=fme.clientHeight;

	var t2=new Date().getTime()-inp.sTime;
	if(t2<0) return;
	
	if(isNaN(inp.stW)) inp.stW=w0;
	if(isNaN(inp.stH)) inp.stH=h0;
	if(isNaN(inp.toW)) inp.toW=w0;
	if(isNaN(inp.toH)) inp.toH=h0;
	if(isNaN(inp.fadeSp)) inp.fadeSp=1.7;
	if(isNaN(inp.mode)) inp.mode=0;

	var toW=inp['toW']
	, toH=inp['toH']
	, distW=inp.toW-inp.stW
	, distH=inp.toH-inp.stH
	, i=(distW!=0?1:0)+(distH!=0?2:0), j=[0, Math.abs(distW), Math.abs(distH), Math.sqrt(distW*distW+distH*distH)], sp=inp.speed
	, dist=j[i];
	
	j=[(dist/sp-1)*Hz, dist/sp*Hz, 0];
	if(isNaN(inp.tLim)) inp.tLim=j[inp.mode];
	if(isNaN(inp.vW)) inp.vW=sp*distW/dist;
	if(isNaN(inp.vH)) inp.vH=sp*distH/dist;
	stop=true;
	
	if(dist)
	{
		var w2=0, h2=0;
			if(t2>inp.tLim)
			{
				if(inp.mode==0)
				{
				if(isNaN(inp.fCount)) inp.fCount=1;
				else	inp.fCount++;
				
				a=(t2/Hz)-(dist-Hz)/inp.speed;
				var k=0
				
				for(i=0; i<inp.fCount; i++, sp/=inp.fadeSp);
				sp=parseInt(sp);
				if(sp)
					stop=false;
					if(distW)
						fme.style.width=(w2=inp.toW-(sp?parseInt(inp.vW*sp/inp.speed):0))+"px";
					if(distH)
						fme.style.height=(h2=inp.toH-(sp?parseInt(inp.vH*sp/inp.speed):0))+"px";
				}
				else if(inp.mode==1)
				{
				}
			}
			
			else
			{
				if(distW)
					fme.style.width=(w2=parseInt(inp.stW + inp.vW*t2/Hz))+"px";
				if(distH)
					fme.style.height=(h2=parseInt(inp.stH + inp.vH*t2/Hz))+"px";
				stop=false;
			}
			

	}
	if(stop)
	{	delete actList[id]['sizeTo'];
		if(uniPool['sizeTo'][id])	delete uniPool['sizeTo'][id];
		if(inp['callBack'])	inp['callBack']();
	}
}


function sizeTo21(id, inp)//wid, hei, speed, force)
{
	if(inp && inp['uni'])
	{
		if(!uniPool['sizeTo'][id])
		{
			uniPool['sizeTo'][id]=1;
			threadInit();
		}
		inp=poolInit(id, 'sizeTo', inp);
		return;
	}


	inp=poolInit(id, 'sizeTo', inp);
	var fme=document.getElementById(id);
	if(!fme) return;

	if(inp)
	{
		if(inp['wait'])
		{
			inp['sTime']=new Date().getTime()+inp['wait'];
			delete inp['wait'];
		}
		else if(!inp['sTime'] || new Date().getTime()>=inp['sTime'])
		{
			if(inp['sTime'])	delete inp['sTime'];


			if(!inp['counter']) inp['counter']=1;
			else inp['counter']++;
	//基礎分析
			var wid=wid0=fme.clientWidth, hei=hei0=fme.clientHeight, speed=inp['speed'];
			if(!isNaN(inp['wid']))	wid=inp['wid'];
			if(!isNaN(inp['hei']))	hei=inp['hei'];
			var lenW=wid-wid0, lenH=hei-hei0, len=Math.sqrt(lenW*lenW+lenH*lenH);
			if(len)
			{
				for(var i=0; 1.3*inp['speed']>=len && i<10; i++)
					inp['speed']*=0.5;
				
				if(inp['lowSp'] && inp['speed']<inp['lowSp'])
					inp['speed']=inp['lowSp']>len?len:inp['lowSp'];
				if(inp['speed']<1)	inp['speed']=1;
				var vX=0, vY=0;
				if(lenW && (vX=parseInt(inp['speed']*lenW/len))==0)	vX=lenW>0?1:-1;
				if(lenH && (vY=parseInt(inp['speed']*lenH/len))==0)	vY=lenH>0?1:-1;
				
				if(!isNaN(inp['wid']))	fme.style.width=(wid0+vX)+"px";
				if(!isNaN(inp['hei']))	fme.style.height=(hei0+vY)+"px";
			}
			
			if(wid==fme.clientWidth && hei==fme.clientHeight)
			{	delete actList[id]['sizeTo'];
				if(uniPool['sizeTo'][id])	delete uniPool['sizeTo'][id];
				if(inp['callBack'])	inp['callBack']();
			}
			else if(!inp['uni'])
				setTimeout('sizeTo2("'+id+'");', 50);
		}
	}
}

function sizeGive(id, inp)//wid, hei, speed, give, lowSp, force
{

	var fme=document.getElementById(id);
	if(!fme) return;


	show(id, 1);
	var wid=wid0=fme.clientWidth, hei=hei0=fme.clientHeight, speed=inp['speed'];
	if(!isNaN(inp['wid']))	wid=inp['wid'];
	if(!isNaN(inp['hei']))	hei=inp['hei'];
	var lenW=wid-wid0, lenH=hei-hei0, len=Math.sqrt(lenW*lenW+lenH*lenH);
	if(len)
	{
		var gW=0, gH=0;
//
		var inp2={"speed":inp['speed']}, inp3={};
		inp2['lowSp']=(inp['lowSp']?inp['lowSp']:inp['give']>>1)
		inp3["speed"]=inp2['lowSp'];
		if(inp['uni'])	inp2['uni']=inp3['uni']=1;
		if(inp['force'])	inp2['force']=1;
		if(inp['wait'])	inp2['wait']=inp['wait'];
		if(lenW)
		{	if((gW=parseInt(inp['give']*lenW/len))==0)	gW=lenW>0?1:-1;
			inp2['wid']=inp['wid']+gW;
			inp3['wid']=inp['wid'];
		}
		if(lenH)
		{	if((gH=parseInt(inp['give']*lenH/len))==0)	gH=lenH>0?1:-1;
			inp2['hei']=inp['hei']+gH;
			inp3['hei']=inp['hei'];
		}
		inp2["callBack"]=function() { setTimeout('sizeTo2("'+id+'", '+JSON.stringify(inp3)+')', 1); 
		};
//		alert(JSON.stringify(inp2));
		sizeTo2(id, inp2);
	}
}

//-----------------------------------------------------------------------------------------------------------------透明控制
function opacityTo2(id, inp)//, opa1, sp)
{
//if(inp) document.getElementById('workArea').innerHTML+=" | opa st["+id+"]"+JSON.stringify(inp)+", ";
	if(inp && inp['uni'])
	{
//document.getElementById('workArea').innerHTML+="^ set opa["+id+"], ";
		uniPool['opacityTo'][id]=1;
		threadInit();
		poolInit(id, 'opacityTo', inp);
		return;
	}
	inp=poolInit(id, 'opacityTo', inp);
		
//document.getElementById('workArea').innerHTML+="* 1["+id+"], ";
	if(inp)
	{
		if(inp['wait'])
		{
			inp['sTime']=new Date().getTime()+inp['wait'];
			delete inp['wait'];
		}
		else if(!inp['sTime'] || new Date().getTime()>=inp['sTime'])
		{
// document.getElementById('workArea').innerHTML+="do opa["+id+"], ";
			if(inp['sTime'])	delete inp['sTime'];
			
			var fme=document.getElementById(id);
			if(!fme)	return;
			if(inp['opa1']>100)	inp['opa1']=100;
			var opa1=inp['opa1'], sp=inp['sp'];
			if(opa1>0 &&(fme.style.display=='none'||fme.style.display==''))	show(id, 1);
			else if(opa1<0) opa1=0;
			
	//		alert('show');
			var opa0=(IE&&fme.filters?fme.filters.alpha.opacity:fme.style.opacity*100);
			if(isNaN(opa0))fme.style.opacity=opa0=1;
			if(opa0<opa1)
			{
				if(opa0+sp<opa1)	opa0+=sp;
				else	opa0=opa1;
			}
			else if(opa0>opa1)
			{
				if(opa0-sp>opa1)	opa0-=sp;
				else	opa0=opa1;
			}
			opacitySet(fme, opa0);

			if(opa0==opa1)
			{	delete actList[id]['opacityTo'];
				if(uniPool['opacityTo'][id])	delete uniPool['opacityTo'][id];
				if(inp['opa1']<0)	show(id, 0);
				if(inp['callBack'])	inp['callBack']();
			}
			else if(!inp['uni'])
				setTimeout('opacityTo2("'+id+'");', 50);
		}
	}
//	else
// document.getElementById('workArea').innerHTML+="no inp opa["+id+"], ";

}

function opacitySet(fme, opa0)
{
	if(isNaN(opa0)||opa0>100) opa0=100;
	else if(opa0<0) opa0=0;
	if(IE && fme.filters)
	{
		fme.style.filter="alpha(opacity=" + opa0 + ")";
//		document.getElementById("info").innerHTML+='IE opa, ';
	}
	else
	{
		fme.style.opacity =(opa0/100);
//		document.getElementById("info").innerHTML+='FF opa, ';
	}
}

function getDisplay(fme)
{
	if(!fme || fme.offsetLeft==undefined) return null;
	return !(fme.offsetLeft==0 && fme.offsetTop==0 && fme.offsetWidth==0 && fme.offsetHeight==0 && fme.scrollWidth==0 && fme.scrollHeight==0 && fme.scrollLeft==0 && fme.scrollTop==0);
}

function show(obj, dpl)
{
	var fme=document.getElementById(obj);
	if(!fme)
	{
		if(debug) alert('no id show['+id+']');
		return;
	}
	if(!dpl)
		fme.style.display="none";
	else if(isNaN(dpl))
		fme.style.display=dpl;
	else if(dpl<0)
		show(obj,getDisplay(fme)?0:1);
	else if(dpl>0)
	{
		fme.style.display="";
		if(!getDisplay(fme))
		{
				switch(fme.tagName)
				{
					case 'P':
					case 'DIV':
						fme.style.display='block';
						break;
					case 'SPAN':
					case 'A':
						fme.style.display='inline';
						break;
					case 'TABLE':
						fme.style.display='table';
						break;
					case 'TR':
						fme.style.display='table-row';
						break;
					case 'TH':
					case 'TD':
						fme.style.display='table-cell';
						break;
					case 'LI':
						fme.style.display='list-item';
						break;
					case '':
					case '':
					case '':
					default:
//alert("unknow TAG: "+fme.tagName)
						fme.style.display='inline';
				}
		}
	}
}

//-----------------------------------------------------------------------------------------------------------------淡入
function fadeINs2(obj, inp)//st, end, toX, toY, ver, opa0, opaV, wait
{
	var fList=inp.list;
	if(!fList)
	{
		if(!isNaN(inp.end))
		{
			fList=[];
			for(j=0, i=inp.st; j<500; j++)
			{
				fList[j]=i;
				if(i==inp.end) break;
				else if(i>inp.end)	i--;
				else	i++;
			}
			
		}
		else
			fList=[''];
	}
	w=inp.wait;
	if(!w) w=0;
	var wait=inp.bWait;
	if(!wait) wait=0;
	if(isNaN(inp.opaV)) inp.opaV=10;
	if(isNaN(inp.ver)) inp.ver=10;
	for(var i=0; i<fList.length; wait+=w, i++)
	{
		if(document.getElementById(obj+fList[i]))
		{
			var inpM={"speed":inp.ver, 'uni':1}
			, inpO={"opa1":inp.opa0, "sp":inp.opaV, 'uni':1};
			if(inp.give) inpM.give=inp.give;
			if(inp.lowSp) inpM.lowSp=inp.lowSp;
			if(!isNaN(inp.toX)) inpM.toX=inp.toX;
			if(!isNaN(inp.toY)) inpM.toY=inp.toY;
			if(inp.force) inpO.force=inpM.force=inp.force;
			inpM.wait=inpO.wait=wait;

			if(inp.give)
				moveGive(obj+fList[i], inpM);
			else
				moveTo2(obj+fList[i], inpM);
			
			if(!isNaN(inp.opa0)) opacityTo2(obj+fList[i], inpO);
		}
	}

/*	if(inp.st==inp.end)	return;
	else if(inp.st>inp.end)	inp.st--;
	else	inp.st++;
	var loop1=setTimeout('fadeINs2("'+obj+'", '+JSON.stringify(inp)+');', inp.wait);
	if(inp.loop)
		inp.loop=loop1;*/

}


//------------------------------------------------------------------------------

