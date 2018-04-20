var attachedfile = "none";

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

var toLink = function (item) {
    try {
        var i = item.indexOf(':');
        var splits = [item.slice(0, i), item.slice(i + 1)];
        document.getElementById("shitlist").innerHTML = document.getElementById("shitlist").innerHTML.concat('<li><a href="post.html?id=').concat(splits[0]).concat('">').concat(splits[1]).concat("</a></li>");

    } catch (err) {
        console.log("Whoops");
    }
}

var toJSON = function (cookie) {
    var output = {};
    cookie.split(/\s*;\s*/).forEach(function (pair) {
        pair = pair.split(/\s*=\s*/);
        output[pair[0]] = pair.splice(1).join('=');
    });
    return output;
}

var post = function () {
    try {
    var content = document.getElementById("content").value;
	var title = document.getElementById("title").value;
	//var cookie = toJSON(document.cookie);
    //var sess = cookie.sess;
	var sess = window.localStorage.getItem("sess");
	var again = window.localStorage.getItem("canpostagain");
	if (again == null || again == "" || again == undefined) again = 0;
    if (content.trim() != "" && content != undefined && title.trim() != "" && title != undefined) {
		if (new Date().getTime() >= again) {
			var n = new Date().getTime() + 15000;
			window.localStorage.setItem("canpostagain", n);
			var thing = new XMLHttpRequest();
			thing.open("POST", "https://api.stibarc.gq/postpost.sjs", false);
			thing.send("sess="+sess+"&title="+encodeURIComponent(title)+"&image="+attachedfile+"&content="+encodeURIComponent(content).replace(/%0A/g, "%0D%0A"));
			location.href = "post.html?id=" + thing.responseText;
			document.getElementById("content").value = "";
			document.getElementById("title").value = "";
		} else {
			var left = again - new Date().getTime();
			left = Math.round(left/1000);
			document.getElementById("wait").innerHTML = "Please wait " + left + " more seconds before posting again";
			document.getElementById("wait").style.display = "";
		}
    }
    } catch(err) {
	senderr(err);
    }
}

/*var readFile = function(evt) {
	var f = evt.target.files[0];
	if(f) {
		var r = new FileReader();
		r.onload = function(e) {
			var contents = e.target.result;
			try {
				var xmlHttp = new XMLHttpRequest();
				xmlHttp.open("POST", "https://api.stibarc.gq/imageupload.sjs", false);
				xmlHttp.send("content=" + encodeURIComponent(contents));
				attachedfile = xmlHttp.responseText;
				document.getElementById("imageadd").style.display = 'none';
				document.getElementById("imageadded").style.display = '';
			} catch(err) {
				
			}
		}
		r.readAsDataURL(f);
	}
}*/

var uploadPart = function(file,part) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "https://api.stibarc.gq/uploadparts.sjs", false);
	xmlHttp.send("cont=true&file="+file+"&content=" + encodeURIComponent(part));
}

var renderBar = function(x) {
	var is = x*25;
	console.log(Math.round(is));
	var str = "[";
	for (i=0;i<is;i++) {
		str = str.concat("I");
	}
	for (i=0;i<(25-is);i++) {
		str = str.concat("&nbsp;&nbsp;");
	}
	str = str.concat("]");
	document.getElementById("imageprogress").innerHTML = str;
}

var readFile = function(evt) {
	document.getElementById("send").disabled = true;
	document.getElementById("imageadd").style.display = 'none';
	document.getElementById("pleasewait").style.display = '';
	document.getElementById("error").style.display = "none";
	var f = evt.target.files[0];
	if(f) {
		var r = new FileReader();
		r.onload = function(e) {
			var contents = e.target.result;
			document.getElementById("imageprogress").style.display = '';
			if (contents.length <= 98000) {
				console.log("Good");
				var xmlHttp = new XMLHttpRequest();
				xmlHttp.open("POST", "https://api.stibarc.gq/uploadparts.sjs", false);
				xmlHttp.send("content=" + encodeURIComponent(contents));
				renderBar((25/25));
				attachedfile = xmlHttp.responseText;
			} else {
				var bad = false;
				var xmlHttp = new XMLHttpRequest();
				xmlHttp.open("POST", "https://api.stibarc.gq/uploadparts.sjs", false);
				var stuff = contents.match(/.{1,98000}/g);
				var totalParts = stuff.length;
				xmlHttp.send("content=" + encodeURIComponent(stuff[0]));
				var file = xmlHttp.responseText.split("\n")[0];
				if (xmlHttp.responseText.split("\n")[0] != "ERR" && xmlHttp.responseText.split("\n")[0] != "") {
					bad = false;
				} else {
					var xmlHttp = new XMLHttpRequest();
					xmlHttp.open("POST", "https://api.stibarc.gq/uploadparts.sjs", false);
					xmlHttp.send("content=" + encodeURIComponent(stuff[0]));
					var file = xmlHttp.responseText.split("\n")[0];
					if (xmlHttp.responseText.split("\n")[0] == "GOOD") {
						bad = false;
					} else {
						bad = true;
					}
				}
				if (bad == false) {
					renderBar((1/totalParts));
					for (var i = 1; i < stuff.length; i++) {
						if (bad == false) {
							uploadPart(file,stuff[i],function(msg) {
								if ((msg) == "Error") {
									bad = true;
								}
							});
							renderBar(((i+1)/totalParts));
						}
					}
					if (bad == false) {
						attachedfile = file;
					} else {
						document.getElementById("imageadd").style.display = "";
						document.getElementById("error").style.display = "";
					}
				} else {
					document.getElementById("imageadd").style.display = "";
					document.getElementById("error").style.display = "";
				}
			}
			if (bad == false) {
				document.getElementById("pleasewait").style.display = 'none';
				document.getElementById("imageprogress").style.display = 'none';
				document.getElementById("imageadded").style.display = '';
			}
		}
		r.readAsDataURL(f);
		//r.readAsArrayBuffer(f);
	}
	document.getElementById("send").disabled = false;
}

window.onload = function () {
    try {
        document.getElementById("file").addEventListener('change',readFile,false);
        document.getElementById("removeimage").onclick = function (evt) {
            attachedfile = "none";
    	    document.getElementById("imageadded").style.display = 'none';
	    document.getElementById("imageadd").style.display = '';
        }
        document.getElementById("send").onclick = function (evt) {
            post();
        }
    } catch(err) {
	senderr(err);
    }
}
