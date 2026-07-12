// 20170831
Date.prototype.format=function()
{
	return (1900+this.getYear())+'-'+
	(this.getMonth()+1+'').lpad(2,0)+'-'+
	(this.getDate()+'').lpad(2,0)+' '+
	(this.getHours()+'').lpad(2,0)+':'+
	(this.getMinutes()+'').lpad(2,0)+':'+
	(this.getSeconds()+'').lpad(2,0);
}

String.prototype.lpad=function(len, ch)
{
	if(ch===undefined)ch=' ';
	if(isNaN(len)) len=0;
	
	var j='';
	for(; len>this.length; len--,j+=ch);
	return j+this;
}


// Number

Number.prototype.lpad=function(len, ch)
{	return (this+'').lpad(len, (ch||'0')); }


Number.prototype.intTime=function(ln)
{
	ln=ln||2;
	var t=this, r='';
	for(var a=0; t||a<ln; a++)
	{
		var v=t%100;
		if(v<10) v="0"+v;
		r=":"+v+r;
		t=parseInt(t/100);
	}
	return r?r.substring(1):"00:00";
}
