"use strict";
console.log("build start");

const packager = require("electron-packager");
const config = require("./package.json");
const electron = require("./node_modules/electron-prebuilt/package.json");
const co = require("co");
const fs = require("fs-extra-promise");
// all, linux, win32, darwin
const targetPlatform = process.argv[2] || "win32";
// 64bit:x64, 32bit:ia32, all
const targetArch = process.argv[3] || "x64";

co(function*(){
    yield fs.removeAsync("./bin");
    yield pack();
    console.log("done!");
}).catch((err) => {
    console.error(err);
});

function pack(){
    return new Promise((resolve, reject) => {
        packager({
            dir: "./",
            out: "./bin",
            name: config.name,
            platform: targetPlatform, // all, linux, win32, darwin
            arch: targetArch,        // 64bit:x64, 32bit:ia32, all
            electronVersion: electron.version,
            appBundleId: "com.suchasplus.dotle",
            appVersion: config.version,
            overwrite: true,
            asar: true,
            prune: true,
            ignore: "node_modules/(electron-packager|electron-prebuilt|\.bin)|build\.js|bin/dotle-*",
        }, function done (err, appPath) {
            if (err) {
                reject(err);
            }
            resolve(appPath);
        });
    });
}