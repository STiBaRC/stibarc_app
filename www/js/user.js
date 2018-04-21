var senderr = function(err) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("post", "https://api.stibarc.gq/senderror.sjs");
  xmlHttp.send("error="+err);
}

function getAllUrlParams(url) {
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
    var obj = {};
    if (queryString) {
        queryString = queryString.split('#')[0];
        var arr = queryString.split('&');
        for (var i = 0; i < arr.length; i++) {
            var a = arr[i].split('=');
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function (v) {
                paramNum = v.slice(1, -1);
                return '';
            });
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
            paramName = paramName;
            paramValue = paramValue;
            if (obj[paramName]) {
                if (typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                }
                if (typeof paramNum === 'undefined') {
                    obj[paramName].push(paramValue);
                }
                else {
                    obj[paramName][paramNum] = paramValue;
                }
            }
            else {
                obj[paramName] = paramValue;
            }
        }
    }
    return obj;
}

var toJSON = function (cookie) {
    var output = {};
    cookie.split(/\s*;\s*/).forEach(function (pair) {
        pair = pair.split(/\s*=\s*/);
        output[pair[0]] = pair.splice(1).join('=');
    });
    return output;
}

var toLink = function (item) {
    try {
        var i = item.indexOf(':');
        var splits = [item.slice(0, i), item.slice(i + 1)];
        document.getElementById("posts").innerHTML = document.getElementById("posts").innerHTML.concat('<li><a href="post.html?id=').concat(splits[0]).concat('">').concat(splits[1].replace(/</g, "&lt;").replace(/>/g, "&gt;")).concat("</a></li>");
    } catch (err) {
        console.log("Whoops");
    }
}

var getPosts = function(id) {
	var tmp = new XMLHttpRequest();
	tmp.open("GET", "https://api.stibarc.gq/getuserposts.sjs?id="+id, false);
	tmp.send(null);
	tmp = tmp.responseText.split("\n");
	for (i = 0; i < tmp.length - 1; i++) {
		toLink(tmp[i]);
	}
}

var getStuff = function (id) {
    try {
	var thing = new XMLHttpRequest();
	thing.open("GET", "https://api.stibarc.gq/getuser.sjs?id=" + id, false);
	thing.send(null);
    var stuff = thing.responseText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	var tmp = stuff.split("\n");
	var rank = tmp[4].split(":")[1];
	var name = tmp[0].split(":")[1];
	var email = tmp[1].split(":")[1];
	var birthday = tmp[3].split(":")[1];
	document.getElementById("username").innerHTML = "Username: ".concat(id);
	document.getElementById("rank").innerHTML = "Rank: ".concat(rank);
	document.getElementById("name").innerHTML = "Real name: ".concat(name);
	if (email != "Not shown" && email != "Not set") {
		document.getElementById("email").innerHTML = "Email: ".concat("<a href=\"mailto:" + email + "\">" + email + "</a>");
	} else {
		document.getElementById("email").innerHTML = "Email: ".concat(email);
	}
	document.getElementById("bday").innerHTML = "Birthday: ".concat(birthday);
	document.getElementById("posts").innerHTML = "";
	getPosts(id);
    } catch(err) {
	senderr(err);
    }
}

window.onload = function () {
	try {
	var id = getAllUrlParams().id;
	//var cookie = toJSON(document.cookie);
	var sess = window.localStorage.getItem("sess");
	getStuff(id);
    if (sess != undefined && sess != "" && sess != null) {
        document.getElementById("footerout").style.display = "none";
        document.getElementById("footerin").style.display = "";
    }
	} catch(err) {
		senderr(err);
	}
}
