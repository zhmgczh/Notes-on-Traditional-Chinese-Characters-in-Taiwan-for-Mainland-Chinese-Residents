const cacheVersion = 'v0626';
const filesToCache = 
[ 'favicon.ico'
, 'favicon_144.png'
, 'favicon_192.png'
//, 'index.jsp'
, 'set.css'
, 'jjTool.css'
, 'manifest.json'
, 'func.js'
, 'func2.js'
, '/img/banner.jpg'
, '/img/logo2.png'
, '/img/icon_bookmark.png'
, '/img/icon_member.png'
, '/img/u919.png'
, '/img/naer.png'
, '/img/aa.jpg'
, '/img/bg2.jpg'
, '/img/seal.png'
, '/img/selectR.png'
, '/img/home.png'
, '/img/icon_warn.png'

, 'js/ajaxTool.js'
, 'js/anime.js'
, 'js/baseTool.js'
, 'js/cssTool.js'
, 'js/dataTool.js'
, 'js/db.js'
, 'js/dhtmlgoodies_calendar.js'
, 'js/domTool.js'
, 'js/eventTool.js'
, 'js/formTool.js'
, 'js/formTool.old.js'
, 'js/geoTool.js'
, 'js/IncludeFile.js'
, 'js/saveAs.js'

];

self.addEventListener('install', event => 
{
	console.log('[ServiceWorker] Install', event);

	event.waitUntil(
		caches.open(cacheVersion)
		.then(cache => {
			console.log('[ServiceWorker] Caching app shell');
			return cache.addAll(filesToCache);
		})
	);
});

self.addEventListener('activate', event => {
	console.log('[ServiceWorker] activate', event);
	event.waitUntil(clients.claim());
	event.waitUntil(
		caches.keys()
		.then(keyList => {
			return Promise.all(keyList.map(key => {
				if (key !== cacheVersion) {
					return caches.delete(key);
				}
			}));
		})
	);
});

self.addEventListener('fetch', event => 
{
	var r=event.request, u=event.request.url;
//	console.log('[ServiceWorker] fetch', event, event.request, caches);
	event.respondWith(
		caches.match(r).then(response => 
		{
// ¦³CACHE
			if(response)	return response;

			return fetch(r).then(
				function (response) 
				{
					if (response.ok)
					{
						if(u.indexOf("book_piece/")>0 || u.indexOf(".woff")>0 || u.indexOf("/images/")>=0)
						{
							console.log('[ServiceWorker] add: '+u, r);
							caches.open(cacheVersion)
								.then(cache => { cache.add(r); });
						}
						return response;
					}
					else return response;
				});

/*
			var re=fetch(r);
// console.log(re, response);
			if(u.indexOf("book_piece/")>0 || u.indexOf(".woff")>0 || u.indexOf("/images/")>=0)
				caches.open(cacheVersion)
					.then(cache => {
						console.log('[ServiceWorker] add: '+u, r);
//						cache.add(re.clone());
						cache.add(r);
					});
*/

			return re;

		})
	);
});

