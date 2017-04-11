'use strict';
const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;
const im = require('./ipcdefine');
const fs = require("fs");
const Toast = require("./toast");

ipc.on(im.OPEN_DOT, (event) => {
    const options = {
        title: 'Please select files',
        filters: [
            {name: "Dot File", extensions: ['dot','DOT','Dot']}
        ],
        properties: ['openFile']
    };
    dialog.showOpenDialog(options, (filename) => {
        event.sender.send(im.SELECTED_DOT_FILE, filename);
    });
});

ipc.on(im.TRY_LOAD_DOT_FILE, (event, filename) => {
    if(!fs.existsSync(filename)) {
        event.sender.send(im.LOAD_DOT_FILE_FAILED, filename);
        return;
    }
    console.log(filename);
    let content = fs.readFileSync(filename, "utf8");
    event.sender.send(im.LOAD_DOT_FILE_SUCCESS, filename, content);
});

ipc.on(im.SAVE_DOT, (event, content, filename) => {
   if(filename === null || filename === undefined) {
       // open dialog to get filename
       const options = {
           title: 'Please select file',
           filters: [
               {name: "Dot File", extensions: ['dot','DOT','Dot']}
           ],
           properties: ['openFile']
       };
       dialog.showSaveDialog(options, (filename) => {
           console.log(filename);
           if(filename !== undefined) {
               fs.writeFileSync(filename, content, "utf8");
               event.sender.send(im.TOAST, Toast.SUCCESS, filename + " Saved !");
           } else {
               console.log("NO filename specified");
               event.sender.send(im.TOAST, Toast.INFO, "Save Failed without Filename Specified!");
           }
       });
   } else {
       fs.writeFileSync(filename, content, "utf8");
       event.sender.send(im.TOAST, Toast.SUCCESS, filename + " Saved !");
   }

});

ipc.on(im.SAVE_SVG, (event, svg) => {
    // open dialog to get filename
    const options = {
        title: 'Please select file',
        filters: [
            {name: "SVG File", extensions: ['svg','SVG']}
        ],
        properties: ['openFile']
    };
    dialog.showSaveDialog(options, (filename) => {
        if(filename !== undefined) {
            fs.writeFileSync(filename, svg, "utf8");
            event.sender.send(im.TOAST, Toast.SUCCESS, filename + " Saved !");
        } else {
            console.log("NO filename specified");
            event.sender.send(im.TOAST, Toast.INFO, "Save Failed without Filename Specified!");
        }
    });
});