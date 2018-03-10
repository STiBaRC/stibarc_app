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
	var thing = new XMLHttpRequest();
	thing.open("GET", "https://api.stibarc.gq/gettitle.sjs?id=" + item, false);
	thing.send(null);
    var title = thing.responseText;
    try {
        document.getElementById("posts").innerHTML = document.getElementById("posts").innerHTML.concat('<li><a href="post.html?id=').concat(item).concat('">').concat(title).concat("</a></li>");
    } catch (err) {
        console.log("Whoops");
    }
}

var getStuff = function (id) {
	var thing = new XMLHttpRequest();
	thing.open("GET", "https://api.stibarc.gq/getuser.sjs?id=" + id, false);
	thing.send(null);
    var stuff = thing.responseText;
	var tmp = stuff.split("\n");
	var rank = tmp[4].split(":")[1];
	var name = tmp[0].split(":")[1];
	var email = tmp[1].split(":")[1];
	var posts = tmp[2].split(":")[1];
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
	posts = posts.split(",");
	document.getElementById("posts").innerHTML = "";
	for (i = 0; i < posts.length; i++) {
        toLink(posts[i]);
    }
}

window.onload = function () {
	var id = getAllUrlParams().id;
	//var cookie = toJSON(document.cookie);
	var sess = window.localStorage.getItem("sess");
	getStuff(id);
    if (sess != undefined && sess != "" && sess != null) {
        document.getElementById("footerout").style.display = "none";
        document.getElementById("footerin").style.display = "";
    }
}
