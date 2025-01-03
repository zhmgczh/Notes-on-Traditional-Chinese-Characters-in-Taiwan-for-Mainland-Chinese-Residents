(function() {
if(_)
{
	if(!_.has('jjTest'))
	{
		var d = document.createElement('div');
		
		d.id="jjTest";
		d.style.cssText="position:fixed; display:inline-block; left:-999999999; top:-99999999;";

		document.documentElement.appendChild(d);
//		document.body.appendChild(d);
	}

	if(!_.has('jjCover') && false)
	{
		var d = document.createElement('div');
		d.id="jjCover";
		d.style.display='none';
		document.documentElement.appendChild(d);
	}

	_.confirmYes='確認';
	_.confirmNo='取消';
	_.alertLabel='確定';
	_.msgYes='確認';
	_.msgNo='取消';
	
	_.originFocus=null;
	
	if(!_.has('jjDialog')) // confirm init style default in jjTool.css
	{
		var d = document.createElement('dialog');
		d.id="jjDialog";
		d.className='jjDialog2';
		d.innerHTML=
		"<header><h3 id='jjDialogTitle' style='display:inline;'></h3></header>"+
		"<div id='jjDialogBody'></div>"+
		"<footer id='jjDialogFoot'>"+
		"<div id=jjDialogFootC style='display:none;'>"+
		"	<input type=button data-f='cnfY' value='Yes'>"+
		"	<input type=button data-f='cnfN' value='No'></div>"+
		
		"<div id=jjDialogFootA style='display:none;'>"+
		"	<input type=button data-f='alert' value='OK'></div>"+
		
		"<div id=jjDialogFootM style='display:none;'>"+
		"	<input id=jjDialogMsg aria-label='輸入訊息'><br/>"+
		"	<input type=button data-f='msgY' value='Yes'>"+
		"	<input type=button data-f='msgN' value='No'></div>"+
		"</footer>";




//		d.style.display='none';
//		document.documentElement.appendChild(d);
		document.documentElement.insertBefore(d, document.documentElement.children[1])

/** Click event
*/
		_.id("jjDialogFoot").addEventListener('click', function(ev)
			{
				var i=ev.target;
				if(i.tagName=='INPUT' && i.type=="button")
				{
					_.id('jjDialog').close();
//					document.body.style.overflow='';

					
					var val=null;
					
					switch(i.getAttribute("data-f"))	// dataset.f
					{
						case 'cnfY':
							val=true;
							break;
						case 'cnfN':
							val=false;
							break;
						case 'alert':
							val=null;
							break;
						case 'msgY':
							val=_.id('jjDialogMsg').value;
							break;
						case 'msgN':
							val=null;
							break;
					}
					if(_.originFocus && _.originFocus.tagName)
						_.originFocus.focus();
					if(this.callBack && typeof this.callBack=='function')
						this.callBack(val);
				}
			});

		d.addEventListener('mousewheel'			// 對話框阻止視窗捲動
			, function(event)
			{ 
// console.log('wheel', event.path);
				if(event.path.indexOf(_.id('jjDialogBody'))==-1)
				{
					event.preventDefault();
					event.returnValue=false; 
				}
			}
			, { "passive":true, "once":true }
		);
	}

/** Show dialog box.
@param title	Title of dialog.
@param content	content text
@param callBack	Callback function of button click.
*/
	_.dialog=function(title, content, callBack)
	{
		if(!this.has('jjDialog'))
		{	console.error('視窗物件遺失!!');
			return false;
		}
		else
		{
			_.id('jjDialog').showModal();
			_.id('jjDialogTitle').innerHTML=title;
			_.id('jjDialogFoot').callBack=typeof callBack=='function'? callBack: null;

			var b=_.id('jjDialogBody');
			if(content==undefined)
				b.innerHTML='';
			else if('|string|number||'.indexOf(typeof content)>0)
				b.innerHTML=content;
			else if(content.innerHTML!=undefined)
				b.innerHTML=content.innerHTML;
			else
				b.innerHTML=''; 

			_.id('jjDialogFootC').style.display=
			_.id('jjDialogFootA').style.display=
			_.id('jjDialogFootM').style.display='none';

//			document.body.style.overflow='hidden';
			return true;
		}
	}


	_.confirm=function(title, content, callBack, labelY, labelN)
	{
		if(!_.dialog(title, content, callBack)) return;
		if(this.tagName)	_.originFocus=this;
		_.id('jjDialogFootC').style.display='';
		var bt=_.id('jjDialogFoot').getElementsByTagName("INPUT");
		bt[0].value=labelY!=undefined? labelY: _.confirmYes;
		bt[1].value=labelN!=undefined? labelN: _.confirmNo;
		bt[0].focus();
	};

//	alert
	_.alert=function(title, content, callBack, labelBtn)
	{
		if(!_.dialog(title, content, callBack)) return;
		if(this.tagName)	_.originFocus=this;
// console.log(this, this.tagName);
		_.id('jjDialogFootA').style.display='';
		var bt=_.id('jjDialogFoot').getElementsByTagName("INPUT");
		bt[2].value=labelBtn!=undefined? labelBtn: _.alertLabel;
		bt[2].focus();
	};

//	message
	_.msg=function(title, content, callBack, labelY, labelN, placeholder)
	{
		if(!_.dialog(title, content, callBack)) return;
		if(this.tagName)	_.originFocus=this;
		_.id('jjDialogFootM').style.display='';
		var bt=_.id('jjDialogFoot').getElementsByTagName("INPUT");
		
		var m=_.id('jjDialogMsg');
		m.value='';
		m.placeholder=(placeholder==undefined?"":placeholder);
		bt[4].value=labelY!=undefined? labelY: _.msgYes;
		bt[5].value=labelN!=undefined? labelN: _.msgNo;
		bt[4].focus();
	};
	

}
})();