var appBaseUrl = "http://www.myfavouritesandwich.org/";
//var appBaseUrl = "https://www.myfavouritesandwich.org/";
var loginUrl = appBaseUrl + "login.html";

// app state shared with login.html:
// =================================
// localStorage::"unhosted".userName
// localStorage::"unhosted".davAuth
// localStorage::"unhosted".cryptoPwd
// localStorage::"unhosted".davBaseUrl


  /////////
 // DAV //
/////////

var DAV = function() {
	var dav = {}
	keyToUrl = function(key) {
		var userNameParts = localStorage.getItem("unhosted").userName.split("@");
		var resource = document.domain;
		var url = localStorage.getItem("unhosted").davBaseUrl
			+"webdav/"+userNameParts[1]
			+"/"+userNameParts[0]
			+"/"+resource
			+"/"+key;
		return url;
	}
	dav.get = function(key) {
return null;
return "{ingredients:['', '']}";	

	var xhr = new XMLHttpRequest();
		xhr.open("GET", keyToUrl(key), false);
		xhr.setRequestHeader("Authorization", localStorage.getItem("unhosted").davAuth);
		xhr.withCredentials = "true";
		xhr.send();
		if(xhr.status == 200) {
			return xhr.responseText;
		} if(xhr.status == 404) {
			return null;
		} else {
			alert("error: got status "+xhr.status+" when doing basic auth GET on url "+keyToUrl(key));
		}
	}
	dav.put = function(key, text) {
		var xhr = new XMLHttpRequest();
		xhr.open("PUT", keyToUrl(key), false);
		xhr.setRequestHeader("Authorization", localStorage.getItem("unhosted").davAuth);
		xhr.withCredentials = "true";
		xhr.send(text);
		if(xhr.status != 200 && xhr.status != 201 && xhr.status != 204) {
			alert("error: got status "+xhr.status+" when doing basic auth PUT on url "+keyToUrl(key));
		}
	}
	return dav;
}


  //////////////
 // Unhosted //
//////////////

var Unhosted = function() {
	var unhosted = {};
	var dav = DAV();
	unhosted.connect = function() {
		if(!localStorage.getItem("unhosted").userName) {
			window.location = loginUrl;
		}
	}
	unhosted.getUserName = function() {
		return localStorage.getItem("unhosted").userName;
	}
	unhosted.get = function(key) {
		return JSON.parse(dav.get(key));
		//return JSON.parse(sjcl.decrypt(localStorage.getItem("unhosted").cryptoPwd, dav.get(key)));
	}
	unhosted.set = function(key, value) {
		dav.put(key, JSON.stringify(value));
		//dav.put(key, sjcl.encrypt(localStorage.getItem("unhosted").cryptoPwd, JSON.stringify(value)));
	}
	unhosted.close = function() {
		localStorage.removeItem("unhosted").userName;
	}

	return unhosted;
}