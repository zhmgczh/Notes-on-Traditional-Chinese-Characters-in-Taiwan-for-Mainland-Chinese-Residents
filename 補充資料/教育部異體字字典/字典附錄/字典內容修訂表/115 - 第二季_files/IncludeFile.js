"use strict";
var includeFile = {};
includeFile.headElement = document.getElementsByTagName("head")[0];
 
// included-JsFile tracker
includeFile.loadedJsFiles = {};
 
includeFile.js = function(strUrl) 
{
    if (includeFile.loadedJsFiles[strUrl])
        return null;
 
    includeFile.loadedJsFiles[strUrl] = true;
 
    var newJsObj = document.createElement('script');
    newJsObj.type = 'text/javascript';
    newJsObj.src = strUrl;
    newJsObj.async = true;
    includeFile.headElement.appendChild(newJsObj);
 
    return newJsObj;
}
 
 
// included-CssFile tracker
includeFile.loadedCssFiles = {};
 
includeFile.css = function(strUrl)
{
    if (includeFile.loadedCssFiles[strUrl])
        return null;
 
    includeFile.loadedCssFiles[strUrl] = true;
 
    var newCssObj = document.createElement('link');
    newCssObj.type = 'text/css';
    newCssObj.rel = "stylesheet";
    newCssObj.href = strUrl;
    includeFile.headElement.appendChild(newCssObj);
 
    return newCssObj;
}