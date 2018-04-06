var checkNotifs = function() {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("get", "https://api.stibarc.gq/getnotifs.sjs", false);
	xmlHttp.send();
	var tmp = xmlHttp.responseText.split("\n");
	var lastID = window.localStorage.getItem("lastNotifID");
	if (lastID == "" || lastID == undefined || lastID == null) {lastID = -1;}
	if (tmp[0] > lastID) {
		var text = "";
		for (var i = 1; i < tmp.length-3; i++) {
			text = text.concat(tmp[i]+"\n");
		}
		text = text.concat(tmp[tmp.length-3]);
		window.localStorage.setItem("lastNotifID", tmp[0]);
        cordova.plugins.notification.local.schedule({
            title: "New post",
            message: text,
            icon: "https://stibarc.gq/icon.png"
        });
		cordova.plugins.notification.local.on("click", function (notification) {
			var postID = tmp[tmp.length-2];
			window.location.assign("post.html?id="+postID);
		});
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

var startNotifs = function() {
	//setupNotifs();
	setInterval(checkNotifs, 500);
}
