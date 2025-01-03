_.saveData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
        var json = JSON.stringify(data),
            blob = new Blob([json], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());

_.txtFile = function(txt, name, opts) {
//    var URL = window.URL || window.webkitURL
    var a = document.createElement('a')
    name = name || 'download.txt'

    a.download = name
    a.rel = 'noopener' // tabnabbing

    // TODO: detect chrome extensions & packaged apps
    // a.target = '_blank'
	opts=opts || {type:"text:plain"};
    {
      // Support blobs
      a.href = URL.createObjectURL(new Blob(['\ufeff', txt], opts));
      setTimeout(function () { URL.revokeObjectURL(a.href) }, 4E4) // 40s
      a.click();
    }
  }


/*
var data = { x: 42, s: "hello, world", d: new Date() },
    fileName = "my-download.json";

_.saveData(data, fileName);

*/