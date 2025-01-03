



function keyboardE()
{
	var str=["<table>"]
	, keyboard4=
	[ ["b", "p", "m", "f", "d", "t", "n", "l", "g", "k", "h"]
	, ["j", "q", "x", "zh", "ch", "sh", "r", "z", "c", "s"]
	, ["a", "ai", "an", "ang", "ao"]
	, ["e", "ê", "ei", "en", "eng", "er"]
	, ["i", "ia", "ian", "iang", "iao", "ie", "in", "ing", "iong", "iu"]
	, ["yi", "ya", "ye", "yao", "you", "yan", "yin", "yang", "ying", "yong"]
	, ["o", "ong", "ou"]
	, ["u", "ua", "uai", "uan", "uang", "ue", "ui", "un", "uo"]
	, ["wu", "wa", "wo", "wai", "wei", "wan", "wen", "wang", "weng"]
	, ["ü"]
	, ["yu", "yue", "yuan", "yun"]
	, ["-","ˊ","ˇ","ˋ","?", "*", "←", "", "", "", "❌"]];

	for(var y=0; y<keyboard4.length; y++)
	{
		str.push("<tr>");
		for(var x=0; x<keyboard4[0].length; x++)
		{
			var p=keyboard4[y][x]
			, bg=y<2?"#9d5642"
				:y<11?"#5d2523"
				:p=='❌'?"var(--colorR)"
				:p=='←'?"#182528"
				:"?*".indexOf(p)!=-1?"#9d5642"
				:"#d3b9a5"
				;
			
			str.push("	<td>"+
				(x<keyboard4[y].length && p!=''
					?"<input type=button id='eKey"+p+"' value='"+p+"' style='background:"+bg+";"+
					("?*".indexOf(p)!=-1?"color:yellow;"
						:(p=="←"?"color:#fff;"
						:""))+
					(y==11&&x<4?" color:#000;":"")+"'"+
					">":"")+
				"</td>");
		}
		str.push("</tr>");
	}
	str.push("</table>");
	return str.join('\n');
}


function keyboardC()
{
	var str=["<table>"]
	, p=' ', keyboard5=
[['手', '田', '水', '口', '廿', '卜', '山', '戈', '人', '心']
,['日', '尸', '木', '火', '土', '竹', '十', '大', '中']
,['重', '難', '金', '女', '月', '弓', '一', '*', '←', '❌']
];


for(var y=0; y<keyboard5.length; y++)
{
	str.push("<tr>");
	for(var x=0; x<keyboard5[0].length; x++)
	{
		var p=keyboard5[y][x]
		, bg=p=='←'?"#182528"
			:p=='❌'?"var(--colorR)"
			:"#9d5642";
		
		str.push("	<td"+(x<keyboard5[y].length && p==' '?" colspan=2":"")+">"+
			(x<keyboard5[y].length?(p!='.'
				?"<input type=button value='"+p+"' style='background:"+bg+";"+ //  id='key"+p+"'
					("?*".indexOf(p)!=-1?" color:yellow;":"")+
					"' "+(p==' '?" class=sp":"")+">":""):"")+
			"</td>\n");
	}
	str.push("</tr>\n");
}
	str.push("</table>\n");
	return str.join('\n');
}


function keyboardP()
{
	var str=["<table>"]
	, p=' ', keyboard3=
[['ㄅ','ㄉ','.','.','ㄓ','.','.','ㄚ','ㄞ','ㄢ','ㄦ']
,['ㄆ','ㄊ','ㄍ','ㄐ','ㄔ','ㄗ','ㄧ','ㄛ','ㄟ','ㄣ']
,['ㄇ','ㄋ','ㄎ','ㄑ','ㄕ','ㄘ','ㄨ','ㄜ','ㄠ','ㄤ']
,['ㄈ','ㄌ','ㄏ','ㄒ','ㄖ','ㄙ','ㄩ','ㄝ','ㄡ','ㄥ']
,['ˊ','ˇ','ˋ','˙','?', '*', '←', '.', '.', '.', '❌']]
;

for(var y=0; y<keyboard3.length; y++)
{
	str.push("<tr>"); //(y>0?"<td colspan="+y+">":"")
	for(var x=0; x<keyboard3[y].length; x++)
	{
		p=keyboard3[y][x];
		var bg=y<4
			?(x<6?"#9d5642":x==6?"#545348":"#5d2523")		//注音
			:p=='❌'?"var(--colorR)"
			:"?*".indexOf(p)!=-1?"#9d5642":p=='←'?"#182528":"#d3b9a5";	//調號
		
		str.push("	<td>"+
			(x<keyboard3[y].length?(p!='.'
				?"<input type=button value='"+(p+"")+"' style='background:"+bg+";"+ //  id='key"+p+"'
					("?*".indexOf(p)!=-1?" color:yellow;":"")+
					"' "+(p==' '?" class=sp":"")+">":""):"")+
			"</td>\n");
	}
	str.push("</tr>\n");
}
	str.push("</table>\n");
	return str.join('\n');
}




var keyBody=['', '', '', keyboardP(), keyboardE(), keyboardC(), ''];





var cj=
{'手': 'Q', '田': 'W', '水': 'E', '口': 'R', '廿': 'T', '卜': 'Y', '山': 'U', '戈': 'I', '人': 'O', '心': 'P',
'日': 'A', '尸': 'S', '木': 'D', '火': 'F', '土': 'G', '竹': 'H', '十': 'J', '大': 'K', '中': 'L',
'重': 'Z', '難': 'X', '金': 'C', '女': 'V', '月': 'B', '弓': 'N', '一': 'M',
};




function openQuick(inp) // 4:注音 6:倉頡 7:拼音
{
	if(inp>0 && document.getElementById("inp"+inp).innerHTML=='')
		document.getElementById("inp"+inp).innerHTML=keyBody[inp];
	keyboard(inp);
}


/** quick search */
var useKB=0, useKB2=0;
function keyboard(kb)
{
	useKB=kb;

	keyboard3.style.display=keyboard4.style.display=keyboard5.style.display=keyboardBar.style.display='none';
	if(document.getElementById("keyboard"+kb))
		document.getElementById("keyboard"+kb).style.display=keyboardBar.style.display='';
}
function quickKey(e)
{
	if(e.target.tagName!='INPUT') return;
	
	var i=document.headF.WORD
	, v=e.target.value
	, tone='	-ˊˇˋ˙';
	if(v=='❌') // close
	{
		keyboard3.style.display=keyboard4.style.display=keyboard5.style.display=
		keyboardBar.style.display="none";
	}
	else if(v=='←')
		i.value=i.value.substring(0, i.value.length-1);
	else if(useKB==4 && tone.indexOf(v)>0) // pinyin
		i.value+=tone.indexOf(v);
	else if(useKB==5 && v>'z')
	{	i.value+=cj[v]||v;	}
	else
		i.value+=v;
}

/** combo search */

function openCombo(inp) // 4:注音 6:倉頡 7:拼音
{
	
	if(inp==5)
	{
		ktp5.innerHTML=keyBody[5];
		ktp5.className=(ktp5.className=='keyboard'?"keyboard open":"keyboard");
		return;
	}

	var v=(document.searchF.PTP||'').value, ktp=document.getElementById('ktp'+v);
	document.getElementById("ktp"+v).innerHTML=keyBody[v];

	if(inp==0)
	{
		
		var open= ktp3.className.indexOf("open")>0 || ktp4.className.indexOf("open")>0 ;
		ktp3.className=ktp4.className="keyboard";
		ktp.className=(open?"keyboard open":"keyboard");
	}
	else if(inp==1)
		ktp.className=(ktp.className=='keyboard'?"keyboard open":"keyboard");
}


function keyboard2(kb)
{
	useKB2=kb;

	keyboard3.style.display=keyboard4.style.display=keyboard5.style.display=keyboardBar.style.display='none';
	if(document.getElementById("keyboard"+kb))
		document.getElementById("keyboard"+kb).style.display=keyboardBar.style.display='';
}

function comboKey(e, inp)
{
	if(e.target.tagName!='INPUT') return;

	var i=document.searchF[inp]
	, v=e.target.value
	, tone='	-ˊˇˋ˙';

//	console.log(i, v, e);

	if(v=='❌') // close
	{
		if(inp=='PH')	ktp3.className=ktp4.className="keyboard";
		if(inp=='CJ')	ktp5.className="keyboard";
	}
	else if(v=='←')
		i.value=i.value.substring(0, i.value.length-1);
	else if(inp=='CJ')
		i.value+=cj[v]||v;
	else if(document.searchF.PTP.value==4 && tone.indexOf(v)>0)
		i.value+=tone.indexOf(v);
	else
		i.value+=v;
}

/** index list */

function setRad()
{
	selectL.className='selectL rad'+(sessionStorage.radPh=="true"?" phon":"")+
		(sessionStorage.radSub=="true"?" full":"");
}

/** list */
function selAll(inp)
{
	var c=inp.checked, f=inp.form;
	
	for(var i=0; i<f.length; i++)
		if(f[i].type=="checkbox")
			f[i].checked=c;
	
}

/** view */

function fontSize(size)
{
	localStorage.fontSize=size;
	_.id("view").className="size"+size;
	_.id("size1").className=_.id("size2").className=_.id("size3").className="";
	_.id("size"+size).className+=" on";
}

/** cmmon */
function showTop()
{
	l=_.id('goTop');
	if(document.documentElement.scrollTop||document.body.scrollTop>400 && l.className=='') 
		l.className='show';
	else if(document.documentElement.scrollTop||document.body.scrollTop<400 && l.className!='') 
		l.className='';
}

function setScroll()
{
	var pages="|dictView|search|page|appendix"
	, path=location.pathname.split('/'), fn=path[path.length-1].split('.')[0];
	if(fn!='' && pages.indexOf(fn)!=-1)
	{
		window.addEventListener('scroll', showTop);
	}
}

function fixFour(inp)
{
	if(inp.value=='') return;
	else if(inp.value.length<5)
		inp.value+='?????'.substring(inp.value.length);
}


function chkPs(f)
{
	var p=f.ps.value;
	
	if(f.send)
	{
		alert('網頁處理中!!');
		return false;
	}
	
	if(p.length<8
		|| p.replace(/\d/gi, '')==p
		|| p.replace(/[a-z]+/g, '')==p
		|| p.replace(/[A-Z]+/g, '')==p
	)
	{
		alert("密碼複雜度不足");
		return false;
	}
	f.send=true;
	return true;
}


function voiceNote()
{
	var ado=document.createElement("AUDIO");
	var http=new XMLHttpRequest();
	http.GET("check.jsp", function()
	{
		var v=http.responseText, vL=[], at=[];
		for(var i=0; i<v.length; i++)
		{
			at[i]=document.createElement("AUDIO");
			at[i].src='sound/ascii/'+v[i]+'.mp3';
			vL.push('sound/ascii/'+v[i]+'.mp3');
		}
		ado.trackRate=2.0;
		ado.playTrack(vL);
	});
}



/** Service worker */

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(reg => {
      // registration worked
      console.log('[Service Worker] Registration succeeded. Scope is ' + reg.scope);
    }).catch(error => {
      // registration failed
      console.log('[Service Worker] Registration failed with ' + error);
    });
}