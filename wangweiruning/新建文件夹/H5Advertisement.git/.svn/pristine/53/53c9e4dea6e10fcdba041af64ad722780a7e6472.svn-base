var express = require('express');
var http = require('http');
var https = require('https');
var ws = require('ws');

const port = process.env.PORT || 8081;
const headerRefered = {};

var app = express();

//代理服务控制
function createProxy(host, port, prefix, isHttps) {
    var proxy = express();
    proxy.all("*", (sreq, sres) => {
        //todo：检查用户登录
        var options = {
            host: host, // 这里是代理服务器
            port: port, // 这里是代理服务器端口
            path: (prefix || "") + sreq.url,
            method: sreq.method,
            headers: {}
        };

        for (var k in sreq.headers) {
            var lk = k.toLowerCase();
            if (headerRefered[lk]) continue;
            var v = sreq.headers[k];
            if (lk == "referer" || lk == "origin" || lk == "host") {
                v = v.replace(new RegExp(sreq.headers.host.replace(".", "\\."), "ig"), host);
            }
            options.headers[k] = v;
        }

        var req = (isHttps ? https : http).request(options, res => {
            sres.writeHead(res.statusCode, res.headers);
            res.pipe(sres);
        });
        req.on('error', err => {
            sres.send("500:" + err.message);
        });
        sreq.pipe(req);
    });
    return proxy;
}
app.use("/h5", createProxy("localhost", 8080));
//app.use("/", createProxy("libertaime.infinitysia.com", 443, "", true));
//app.use("/", createProxy("forevermark-cvd.asaplus.com.cn", 443, "", true));
app.use("/", createProxy("libertaime.infinitysia.com", 80));
//服务器
var server = http.createServer(app);
var wsInstance = new ws.Server({
    server: server
});
function getQueryString(url, name) {
    var reg = new RegExp('(\\?|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = url.match(reg);
    if (r != null) return unescape(r[2]);
}
var socket1, socket2;
wsInstance.on("connection", function(socket, msg) {
    var clear = getQueryString(msg.url, "clear");
    if (clear) {
        var t1 = socket1, t2 = socket2;
        socket1 = socket2 = null;
        if (t1) t1.close();
        if (t2) t2.close();
        socket1 = socket;
    }
    else {
        if (socket2) socket2.close();
        socket2 = socket;
    }
    var an = function() {
        if (socket1 == socket) return socket2;
        else return socket1;
    };

    socket.on("message", function(msg) {
        var info = JSON.parse(msg);
        var ac = info['do'];
        var data = info.data;
        if (ac == "login") {
            var ret = {
                "code":0,
                "data":{
                    "list":{},
                    "uid":"1"
                },
                "route":"login"
            };
            if (an()) {
                var uid = socket == socket1 ? "2" : "1";
                ret.data.list[uid] = { userid: uid };
                an().send(JSON.stringify({
                    "code":0,"data":{"uid":socket == socket1 ? "1" : "2","roomId":"1"},
                    "route":"onJoin"   //前端路由名称，第2个玩家登陆
                }));
            }
            socket.send(JSON.stringify(ret));
        }
        else if (ac == "sendEvent") {
            console.log([!!an(), socket1 == socket]);
            if (an()) {
                an().send(JSON.stringify({
                    "code":0,"data":{...data,uid:socket == socket1 ? "1" : "2"},
                    "route":"sendEvent"
                }));
            }
        }
    });
});
//启动服务
server.listen(port);
console.log("Server started at " + port + " @ " + new Date());

process.on('uncaughtException', err => {
    console.log(err);
});