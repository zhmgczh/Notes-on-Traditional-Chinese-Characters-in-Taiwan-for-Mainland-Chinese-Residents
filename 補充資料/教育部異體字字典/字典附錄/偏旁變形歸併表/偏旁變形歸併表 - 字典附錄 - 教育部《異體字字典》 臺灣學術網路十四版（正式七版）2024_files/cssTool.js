

function Css(id)
{
	this.setSheet=function(idx)
	{
		this.style=document.styleSheets[idx];
	};
	
	this.add=function(name, rule, idx)
	{
		this.style.addRule(name, rule, idx);
	}

//-----------------------------------------------------------------------------

	if(id===undefined)	id=0;
	if(!document.styleSheets.length) // css init
	{
		var style = document.createElement("style");

		// Add a media (and/or media query) here if you'd like!
		// style.setAttribute("media", "screen")
		// style.setAttribute("media", "only screen and (max-width : 1024px)")

		// WebKit hack :(
		style.appendChild(document.createTextNode(""));
		document.head.appendChild(style);
		
	}
	this.idx=id=Math.min(document.styleSheets.length-1, id);
	
	this.setSheet(id);
	
};