var checkNotifs = function() {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("get", "https://api.stibarc.gq/getnotifs.sjs", false);
	xmlHttp.send();
	var tmp = xmlHttp.responseText.split("\n");
	var lastID = window.localStorage.getItem("lastNotifID");
	if (lastID == "" || lastID == undefined || lastID == null) {lastID = -1;}
	if (tmp[0] != lastID) {
		var text = "";
		for (var i = 1; i < tmp.length-3; i++) {
			text = text.concat(tmp[i]+"\n");
		}
		text = text.concat(tmp[tmp.length-3]);
		window.localStorage.setItem("lastNotifID", tmp[0]);
        	cordova.plugins.notification.local.schedule({
            		title: "New post",
            		message: tmp[1],
            		icon: "icon.png",
			data: {postid:tmp[tmp.length-2]}
        	});
		cordova.plugins.notification.local.on("click", function (notification) {
			window.location.assign("post.html?id="+notification.data.postid);
		});
	}
}

var checkNotifsUser = function(user) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("post", "https://api.stibarc.gq/getusernotifs.sjs", false);
	xmlHttp.send("id="+user);
	if (xmlHttp.responseText.split("\n")[0] != "None") {
		var tmp = xmlHttp.responseText.split("\n");
		var lastID = window.localStorage.getItem("lastUserNotifID");
		if (lastID == "" || lastID == undefined || lastID == null) {lastID = -1;}
		if (tmp[0].concat(tmp[tmp.length-2]) != lastID) {
			var text = "";
			for (var i = 2; i < tmp.length-3; i++) {
				text = text.concat(tmp[i]+"\n");
			}
			text = text.concat(tmp[tmp.length-3]);
			window.localStorage.setItem("lastUserNotifID", tmp[0].concat(tmp[tmp.length-2]));
			cordova.plugins.notification.local.schedule({
				title: tmp[1],
				message: tmp[2],
				icon: "icon.png",
				data: {postid:tmp[tmp.length-2]}
			});
			cordova.plugins.notification.local.on("click", function (notification) {
				window.location.assign("post.html?id="+notification.data.postid);
			});
		}
	}
}

/*var setupNotifs = function() {
	if (Notification.permission == "default") {
		var perms = window.localStorage.getItem("notifs");
		if (perms == "" || perms == undefined || perms == null) {
			Notification.requestPermission(function (permission) {
				if (permission == "granted") {
					window.localStorage.setItem("notifs", "granted");
					var notification = new Notification("STiBaRC", {body: "Notifications enabled!",requireInteraction:true,icon:'icon.png'});
					notification.onclick = function(evt) {
						
					}
				} else {
					window.localStorage.setItem("notifs", "denied");
				}
			});
		}
	}
}*/

var doCheck = function() {
	checkNotifs();
	if (window.localStorage.getItem("username") != null && window.localStorage.getItem("username") != undefined && window.localStorage.getItem("username") != "") {
		checkNotifsUser(window.localStorage.getItem("username"));
	}
}

var startNotifs = function() {
	//setupNotifs();
	setInterval(doCheck, 500);
}
