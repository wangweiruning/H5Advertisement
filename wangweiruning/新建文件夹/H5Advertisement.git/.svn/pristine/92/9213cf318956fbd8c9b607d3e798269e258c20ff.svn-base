var isMobile = navigator.userAgent.match(/pad|midp|ucweb|android|windows ce|mobile|phone/ig);

export function touchProxy(calbk) {
    return function (e) {
        var pe = e;
        if (e.touches && e.touches.length) e = e.touches[0];
        if (e.originalEvent) e = e.originalEvent;
        if (e.targetTouches && e.targetTouches.length) e = e.targetTouches[0] || e;
        if (calbk.call(this, e, pe) == false) {
            pe.stopPropagation();
            pe.preventDefault();
            pe.handled = true;
        }
    };
}

 //触摸范围管理
 export function startTouch(ele, obj) {
    var doc = document.body;
    var cache;
    var move = touchProxy(function (e) {
        if (obj.move) return obj.move.call(cache, e);
    });
    var ex = 0;
    var up = function () {
        if (!ex) return;
        ex = false;
        doc.removeEventListener(isMobile ? "touchstart" : "mousedown", move);
        doc.removeEventListener(isMobile ? "touchend" : "mouseup", up);
        if (obj.up) return obj.up.call(cache);
    };
    obj.exit = up;
    ele.addEventListener(isMobile ? "touchstart" : "mousedown", touchProxy(function (e, pe) {
        if (ex) return;
        var pei = pe.srcElement || pe.target;
        while(pei) {
            if (pei == (ele[0] || ele)) break;
            pei = pei.parentNode;
        }
        if (!pei) return;
        ex = true;
        cache = this;
        doc.addEventListener(isMobile ? "touchstart" : "mousedown", move);
        doc.addEventListener(isMobile ? "touchend" : "mouseup", up);
        if (obj.down) return obj.down.call(this, e);
    }));
    return function () {
        ele.removeEventListener(isMobile ? "touchstart" : "mousedown");
    };
}

//單個手指的手勢
export function singleTouch(ele, sett, distance) {
    sett = sett || {};
    var pos, tpos, istap = false, startTime;
    var wScale = document.documentElement.offsetWidth || window.innerWidth || document.body.offsetWidth;
    wScale = wScale * 100 / psdWidth;
    distance = (distance || 5) / wScale;
    return startTouch(ele, {
        down: function (e) {
            pos = {
                x: e.pageX / wScale,
                y: e.pageY / wScale
            };
            tpos = pos;
            startTime = new Date().getTime();
            istap = true;
            if (sett.down) sett.down.call(this, pos, e);
        },
        move: function (e) {
            if (!pos) return;
            tpos = {
                x: e.pageX / wScale,
                y: e.pageY / wScale
            };
            var dp = {
                deltaX: tpos.x - pos.x,
                deltaY: tpos.y - pos.y
            };
            if (Math.abs(dp.deltaX) > 20 || Math.abs(dp.deltaY) > 20) istap = false;
            var deg = Math.abs(dp.deltaX / dp.deltaY);
            if (!sett.move && deg < 0.5) {
                if (dp.deltaY > 0 && !sett.top) return;
                if (dp.deltaY < 0 && !sett.bottom) return;
            }
            if (sett.move && sett.move.call(this, dp, tpos, pos, e)) return;
            return false;
        },
        up: function () {
            if (!pos) return;
            var dtime = new Date().getTime() - startTime;
            if (dtime < 800) {
                var e = {
                    deltaX: tpos.x - pos.x,
                    deltaY: tpos.y - pos.y
                };
                var deg = Math.abs(e.deltaX / e.deltaY);
                if (isNaN(deg) || deg > 2) {
                    if (e.deltaX > distance && sett.left) return sett.left.call(this);
                    else if (e.deltaX < -distance && sett.right) return sett.right.call(this);
                } else if (deg < 0.5) {
                    if (e.deltaY > distance && sett.top) return sett.top.call(this);
                    else if (e.deltaY < -distance && sett.bottom) return sett.bottom.call(this);
                }
            }
            if (dtime < 300) {
                if (istap) {
                    istap = false;
                    if (sett.tap) sett.tap.call(this);
                }
            }
            if (sett.up) sett.up.call(this);
            pos = null;
            tpos = null;
        }
    }, sett.target);
}