var login = function () {
    document.getElementById("blank").style.display = "none";
    document.getElementById("badnamepass").style.display = "none";
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (username != undefined && username != "" && password != undefined && password != "") {
        var xmlHttp = new XMLHttpRequest();
		var appid = window.localStorage.getItem("appID");
		if (appid == "" || appid == null || appid == undefined) appid = "none";
        xmlHttp.open("GET", "https://api.stibarc.gq/createsess.sjs?username=" + username + "&password=" + password + "&appid=" + appid , false);
        xmlHttp.send(null);
        sess = xmlHttp.responseText;
        if (sess != "Invalid username or password\n") {
            //document.cookie = "sess=" + sess;
			window.localStorage.setItem("sess", sess.split("\n")[0]);
			location.href = "index.html"
        } else {
            document.getElementById("badnamepass").style.display = "";
        }
    } else {
        document.getElementById("blank").style.display = "";
    }
}

window.onload = function () {
    document.getElementById("login").onclick = function (evt) {
        login();
    }
}