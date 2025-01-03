//	open

function IDB(dbn, ver, construction)
{
	if(!window.indexedDB)
	{
		alert("Don't support indexedDB!!");
		throw "Don't support indexedDB!!";
		return;
	}
	
	if(!dbn || typeof dbn!='string') 
	{
		alert('IDB name null!!');
		throw 'IDB name null!!';
		return;
	}
	if(!construction || typeof construction!='function')
	{
		alert('Miss DB construction!! ');
		console.error('Miss DB construction!! ',construction);
		throw 'Miss DB construction!!';
	}
	
	
	if(!ver) ver=1;
	this.dbName=dbn;
	this.ver=ver;
	this.debug=false;
	this.result=null;
	this.tableList=[];
	this.lastEv=null;
	this.construction=construction;
	
	this.dbTrans=function(tsAct, dbAct)
	{
/*		if(!act || typeof act!='function')
		{
			console.error('Not a function!! ',act);
			throw 'Not a function!!';
		} */
/*
(IDBOpenDBRequest)	dbo	= window.indexedDB.open();
(IDBDatabase)		db	= dbo.result;
(IDBObjectStore)	ITab=db.createObjectStore/deleteObjectStore()
(IDBTransaction)	ts	= db.transaction();
(IDBObjectStore)	ITab= ts.objectStore()
(IDBRequest)		req	= ITab.put/get/getAll/delete();
*/
		
		var dbo = window.indexedDB.open(this.dbName, this.ver); //	(IDBOpenDBRequest)
		dbo.onsuccess = function(event)
		{
			var db = dbo.result //	(IDBDatabase)
			, ts = db.transaction(this.tableList=db.objectStoreNames, "readwrite"); //	(IDBTransaction)
			var d=new Date();
console.log('['+(d.format?d.format('HH:MM:ss'):d)+'] IDBDatabase['+db.name+', '+db.version+'] open.');
			
			ts.oncomplete = function(event) 
			{	console.log('IDBTransaction close. %o', this);	};

			ts.onerror = function(event) 
			{ console.error('IDBTransaction fault. %o', this.lastEv=event);	};
			
			if(tsAct) tsAct.call(ts);
			if(dbAct) dbAct.call(db);
		};
		dbo.onerror = function(event) 
		{	console.error('IDBRequest fault. %o', this.lastEv=event ); };
		dbo.onupgradeneeded = this.construction; // (IDBDatabase)
	};
	
	this.insert=function(tab, dat, pk, cb)
	{
		if(!dat) return;
		if(!tab)	throw 'table null!!';
		dbTrans(function()
		{
			if(this.tableList.indexOf(tab)==-1)
				throw 'IDBDatabase.insert Table miss!! ['+tab+']';
			
			var ITab = this.objectStore(tab)	// (IDBObjectStore)
			var req = this.result = ITab.put(dat);	// (IDBRequest)
			req.onsuccess = function(event) 
			{	if(this.debug) console.log('IDBRequest.put success.', this.lastEv=event);
				if(cb && typeof cb=="function") cb.call(req);
			};
			req.onerror = function(event) 
			{	console.error('IDBRequest.put error', this.lastEv=event);	};
		});
	};
	
	this.select=function(tab, q, cb)
	{
		dbTrans(function()
		{
			if(this.tableList.indexOf(tab)==-1)
				throw 'IDBDatabase.select Table miss!! ['+tab+']';

			var ITab = this.objectStore(tab)	// (IDBObjectStore)
			var req = this.result = ITab.getAll(q);	// (IDBRequest)
			
			req.onsuccess = function(event) 
			{	if(this.debug) console.log('IDBRequest.select success.', this.lastEv=event);
				if(cb && typeof cb=="function") cb.call(req);
				// event.target.result == customerData[i].<id>;
			};
			req.onerror = function(event) 
			{	console.error('IDBRequest.select error', this.lastEv=event);	};
		});
	}
	
	this.update=function(tab, dat, cb)
	{
		if(!dat || typeof dat!='object') return;
		if(!tab) throw 'table null!!';
		
		dbTrans(function()
		{
			if(this.tableList.indexOf(tab)==-1)
				throw 'IDBDatabase.select Table miss!! ['+tab+']';

			var ITab = this.objectStore(tab)	// (IDBObjectStore)
			, k=ITab.keyPath;
			
			if(dat[k])
			{
				var req = this.result = ITab.get(dat[k]);	// (IDBRequest)
				
				req.onsuccess = function(event) 
				{
if(this.debug) console.log('IDBRequest.select success.', this.lastEv=event);
					var dat2=this.reset;
					for(var i in dat)
						dat2[i]=dat[i];
					if(cb && typeof cb=="function") cb.call(this);
				};
				req.onerror = function(event) 
				{	console.error('IDBRequest.update error', this.lastEv=event);	};
			}
			else if(dat.length)
			{
				var reqs=[];
				for(var a=0; a<dat.length; a++)
				{
					(reqs[a] = ITab.get(dat[a][k])).onsuccess = function(event) 
					{
if(this.debug) console.log('IDBRequest.select success.', this.lastEv=event);
						var dat2=this.reset;
						for(var i in dat[a])
							dat2[i]=dat[a][i];
					};
					reqs[a].onerror = function(event) 
					{	console.error('IDBRequest.update error', this.lastEv=event);	};
					
				}
				if(cb && typeof cb=="function") cb.call(req);
			}
		});
	}
	
	this.delete=function(tab, k, cb)
	{
		if(!k) return;
		dbTrans(function()
		{
			if(this.tableList.indexOf(tab)==-1)
				throw 'IDBDatabase.delete Table miss!! ['+tab+']';
			
			var ITab = this.objectStore(tab)	// (IDBObjectStore)
			ITab.delete(k);
			if(cb && typeof cb=="function") cb.call(ITab);
			
		});
	}

	this.create=function(tab, key, idxs, cb)
	{
		if(!tab || !k) return;
		dbTrans(function()
		{
			var db=this.db;
			if(db.objectStoreNames.indexOf(tab==-1))
			{
				var tab = db.createObjectStore(tab, { "keyPath": key });
				
				if(idxs && idxs[0])
				{
					if(typeof idxs[0]=='string')
						tab.createIndex(idxs[0], idxs[1], idxs[2]);
					else if(typeof idxs[0]=='object')
					{
						for(var i=0; i<idxs.length; i++)
						{
							if(idxs[i].length)
								tab.createIndex(idxs[i][0], idxs[i][1], idxs[i][2]);
						}
					}
				}
				if(cb && typeof cb=="function") cb.call(tab);
			}
			else
				console.war("IDBDatabase.create Table exists!! ["+tab+"]");
		});
	}
}


function dbTrans(dbn, ver, act)
{
	if(!dbn || typeof dbn!='string') 
	{
		alert('IDB name null!!');
		return;
	}
	if(!ver) ver=1;
	
	var dbo = window.indexedDB.open(dbn, ver); //	(IDBRequest)
	dbo.onsuccess = function(event) {
		db = dbo.result; //	(IDBDatabase)
		var ts = db.transaction(db.objectStoreNames, "readwrite"); //	(IDBTransaction)
console.log('['+new Date().format('HH:MM:ss')+'] IDBRequest['+db.name+', '+db.version+'] open.');
		
		ts.oncomplete = function(event) 
		{	console.log('IDBTransaction close.', this);	};

		ts.onerror = function(event) 
		{ console.log('IDBTransaction fault. %o', e=event);	};
		
		if(act) act.call(ts);
	};
	dbo.onerror = function(event) 
	{ console.error('IDBRequest fault. %o', e=event ); };
	dbo.onupgradeneeded = function(event) 
	{
	  db = event.target.result;

	  // Create an objectStore to hold information about our customers. We're
	  // going to use "ssn" as our key path because it's guaranteed to be
	  // unique.
	  var tab = db.createObjectStore("note", { keyPath: "meanID" })
	  , idx=tab.createIndex("idiom", "idiom", { unique: false });
	};
}

function tabReplace(db, ver, tab, dat, pk, cb)
{
	dbTrans(db, ver, function()
	{
		var ITab = this.objectStore(tab)	// (IDBObjectStore)
		var req = ITab.put(dat);	// (IDBRequest)
		req.onsuccess = function(event) 
		{	if(IDBdebug) console.log('IDBRequest.put success.', e=event);
			if(cb) cb.call(req);
			// event.target.result == customerData[i].<id>;
		};
		req.onerror = function(event) 
		{	console.log('IDBRequest.put error', e=event);	};
	});
}

function tabSelect(db, ver, tab, q, cb)
{
	dbTrans(db, ver, function()
	{
		var ITab = this.objectStore(tab)	// (IDBObjectStore)
		var req = ITab.getAll(q);	// (IDBRequest)
		
		req.onsuccess = function(event) 
		{	console.log('IDBRequest.select success.', e=event);
			if(cb) cb.call(req);
			// event.target.result == customerData[i].<id>;
		};
		req.onerror = function(event) 
		{	console.log('IDBRequest.select error', e=event);	};
	});
}

function tabDelete(db, ver, tab, k, cb)
{
	if(!k) return;
	dbTrans(db, ver, function()
	{
		var ITab = this.objectStore(tab)	// (IDBObjectStore)
		ITab.delete(k);
		ITab.delete(k+"");
		if(cb) cb.call(ITab);
		
	});
}
	
// initL.push(dbTrans);

//	var ts=db.transaction([tables, ....], "readwrite")

/*		add
for (var i in customerData) {
  var request = noteTab.add(customerData[i]);
  request.onsuccess = function(event) {
    // event.target.result == customerData[i].ssn;
  };
}

*/

/*		del
	var request = ta.objectStore(table).delete(pk);
	request.onsuccess = function(event) 
	{	// It's gone!
	};
*/


/**		get
var request = noteTab.get(pk);
request.onerror = function(event) {
  // Handle errors!
};
request.onsuccess = function(event) {
  // Do something with the request.result!
  alert("Name for SSN 444-44-4444 is " + request.result.name);
};


*/

/** get all
	var noteTab = db.transaction(tab||[tsbs]||db.objectStoreNames).objectStore(tab);

	noteTab.openCursor().onsuccess = function(event) {
	  var cursor = event.target.result;
	  if (cursor) {
		alert("Name for SSN " + cursor.key + " is " + cursor.value.<name>);
		cursor.continue();
	  }
	  else {
		alert("No more entries!");
	  }
	};


*/