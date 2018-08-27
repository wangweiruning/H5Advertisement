import fs from 'fs';
import path from 'path';

export class Waiter {
    _wait = null;
    _callback = null;
    _result = null;
    _check() {
        if (this._callback && this._result) {
            if (this._result[0]) this._callback[1](this._result[0]);
            else this._callback[0](this._result[1]);
            this._wait = null;
            this._callback = null;
            this._result = null;
        }
    }
    _next() {
        var me = this;
        if (me._wait) throw new Error("上次等待未完成");
        this._wait = new Promise((ps, pe) => {
            me._callback = [ps, pe];
            me._check();
        });
    }
    next() {
        this._next();
        return (err, ret) => {
            this._result = [err, ret];
            this._check();
        };
    }
    pass() {
        this._next();
        return (ret) => {
            this._result = [null, ret];
            this._check();
        };
    }
    wait() {
        return this._wait;
    }
    call(callback) {
        callback(this.step());
        return this._wait;
    }
}

export function callFs(method) {
    var arr = [];
    for (var i = 1; i < arguments.length; ++i) arr.push(arguments[i]);
    return new Promise((ps, pe) => {
        arr.push((err, ret) => {
            if (err) pe(err);
            else ps(ret);
        });
        
        try { fs[method].apply(fs, arr); }
        catch(e) { pe(e); }
    });
}

export function callFsPass(method) {
    var arr = [];
    for (var i = 1; i < arguments.length; ++i) arr.push(arguments[i]);
    return new Promise(ps => {
        arr.push(ps);
        try { fs[method].apply(fs, arr); }
        catch(e) { pe(e); }
    });
}

export async function* getFiles(dir, search, sub) {
    let files = await callFs("readdir", dir);
    for (let f of files) {
        let ff = path.join(dir, f);
        let stat = await callFs("stat", ff);
        if (stat.isDirectory()) {
            if (sub) yield* await getFiles(ff, search, sub);
        }
        else if (!search || search.test(f)) yield {
            path: ff,
            size: stat.size,
            time: stat.birthtime
        };
    }
};