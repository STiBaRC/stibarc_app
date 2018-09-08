function toLink(id,item) {
	try {
		document.getElementById("shitlist").innerHTML = document.getElementById("shitlist").innerHTML.concat('<div class="post"><a style="font-size:100%;text-decoration:none;" href="post.html?id=').concat(id).concat('"><b>').concat(item['title'].replace(/</g, "&lt;").replace(/>/g, "&gt;")).concat('</b></a><br/>Posted by: <a href="user.html?id=').concat(item['poster']).concat('">').concat(item['poster']).concat("</a></div><br/>");
		lastid = id;
	} catch (err) {
		console.log(err);
	}
}

function checkSess() {
	var sess = window.localStorage.getItem("sess");
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("get", "https://api.stibarc.gq/checksess.sjs?sess="+sess, false);
	xmlHttp.send(null);
	if (xmlHttp.responseText.split("\n")[0] == "bad") {
		window.localStorage.removeItem("sess");
		window.localStorage.removeItem("username");
		location.reload();
	}
}

function getUsername() {
	var sess = window.localStorage.getItem("sess");
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "https://api.stibarc.gq/getusername.sjs", false);
	xmlHttp.send("sess="+sess);
	window.localStorage.setItem("username", xmlHttp.responseText.split("\n")[0]);
}

var lastid = 1;

function loadMore() {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", "https://api.stibarc.gq/v2/getposts.sjs?id="+lastid, false);
	xmlHttp.send(null);
	if (xmlHttp.responseText.trim() != "") {
		var tmp = JSON.parse(xmlHttp.responseText);
		var tmp2 = lastid-1;
		for (var i = tmp2; i > tmp2-20; i--) {
			toLink(i,tmp[i]);
		}
	} else {
		document.getElementById("loadmorecontainer").style.display = "none";
	}
}

window.onload = function () {
	var offline = false;
	var sess = window.localStorage.getItem("sess");
	if (sess != undefined && sess != null && sess != "") {
		checkSess();
		document.getElementById("loggedout").style.display = "none";
		document.getElementById("loggedin").style.display = "";
		document.getElementById("footerout").style.display = "none";
		document.getElementById("footerin").style.display = "";
	}
	document.getElementById("loadmore").onclick = function(evt) {
		loadMore();
	}
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", "https://api.stibarc.gq/v2/getposts.sjs", false);
	try {
		xmlHttp.send(null);
	} catch (err) {
		offline = true;
	}
	if (!offline) {
		if (window.localStorage.getItem("username") == "" || window.localStorage.getItem("username") == undefined) {
			if (sess != undefined && sess != null && sess != "") {
				getUsername();
			}
		}
		var tmp = JSON.parse(xmlHttp.responseText);
		document.getElementById("shitlist").innerHTML = "";
		for (var i = tmp['totalposts']; i > tmp['totalposts']-20; i--) {
			toLink(i,tmp[i]);
		}
		document.getElementById("loadmorecontainer").style.display = "";
	} else {
		document.getElementById("shitlist").innerHTML = "Error loading posts. Device offline.";
	}
	cordova.plugins.backgroundMode.enable();
	cordova.plugins.backgroundMode.overrideBackButton();
	startNotifs();
}
