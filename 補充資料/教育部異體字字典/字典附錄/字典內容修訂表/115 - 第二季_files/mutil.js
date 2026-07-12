

/** set image size. */
HTMLImageElement.prototype.size=function(w, h)
{
	if(this.tagName!="IMG") return;
	if(!w)
	{
		w=this.naturalWidth;
		h=this.naturalHeight;
	}
	if(h==undefined) h=w;
	var rat=this.naturalWidth/this.naturalHeight, rat2=w/h;
	if(rat2<rat)
	{
		this.width=w;
		this.height=this.naturalHeight/this.naturalWidth*w
	}
	else
	{
		this.height=h;
		this.width=this.naturalWidth/this.naturalHeight*h
	}
}




//switch------------------------------------------------------------------------



var useIcon={};
function iconOne(objs, img, id, max) //抓取objs* 將img路徑中*為開關
{
	var dom;
	for(i=0; (dom=document.getElementById(objs+i)) || i<id || i<=max; i++)
		if(dom)	document.getElementById(objs+i).src=img.replace("*",0);
		
	if(useIcon[objs]!=id)
	{
		document.getElementById(objs+id).src=img.replace("*",1);
		useIcon[objs]=id;
	}
	else	useIcon[objs]=0;
}

var useShow={};
function showOne(objs, id, max)
{
	for(i=0; i<=id || i<=max || document.getElementById(objs+i); i++)	show(objs+i,0);
	if(useShow[objs]!=id)
	{
		show(objs+id,1);
		useShow[objs]=id;
	}
	else	useShow[objs]=null;
}



/** Play audio list by array.

*/
HTMLAudioElement.prototype.playTrack=function(tk)
{
	if(typeof tk=="object")
	{
		this.trackNo=0;
		this.trackList=tk;
	}
	if(!this.onended2 && this.onended) this.onended2=this.onended;

	this.onended=this.toNext=function()
	{
		if(this.trackNo<0) this.trackNo=0;
		if(typeof(this.trackNo)!='number' || !this.trackList){}
		else if(this.trackNo<this.trackList.length)
		{
			this.src=this.trackList[this.trackNo++];
			if(this.trackRate) this.playbackRate=this.trackRate;
			this.play();
		}
		else if(this.onended2)	this.onended2(event);
	};
	this.toNext();
};

HTMLAudioElement.prototype.track=function(tkn)
{
	if(this.trackList && tkn<=this.trackList.length)
	{
		this.trackNo=tkn-1;
		this.toNext();
	}
}


