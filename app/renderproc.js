const ipc = require('electron').ipcRenderer;
const utils = require('./utils');
const im = require('./ipcdefine');
const Toast = require('./toast');

const openBtn = document.getElementById('btnOpen');
const saveBtn = document.getElementById('btnSave');
const svgBtn = document.getElementById('btnSVG');
const pngBtn = document.getElementById('btnPNG');

openBtn.addEventListener('click', (event) => {
    ipc.send(im.OPEN_DOT);
});

saveBtn.addEventListener('click', (event) => {
    ipc.send(im.SAVE_DOT, window.editor.getValue(), window.currentFile);
});

svgBtn.addEventListener('click', (event) => {
    let svg = "";
    try{
        svg = viz(window.editor.getValue(), { format: "svg", engine: "dot" })
    } catch(ex) {
        console.log(ex);
    } finally {
        if(svg !== "") {
            ipc.send(im.SAVE_SVG, svg);
        }
    }
});

ipc.on(im.SELECTED_DOT_FILE, (event, filename) => {
    if(filename !== null && filename !== undefined && filename[0] !== null) {
        //send to main and load into code mirror
        ipc.send(im.TRY_LOAD_DOT_FILE, filename[0]);
        //(new Toast(Toast.SUCCESS, filename)).show();
    }
});

ipc.on(im.LOAD_DOT_FILE_SUCCESS, (event, filename, content) => {
    console.log(window.editor);
    window.currentFile = filename;
    window.editor.doc.setValue(content);
    document.getElementById("opened-file").innerHTML = "File: " + filename;
    (new Toast(Toast.SUCCESS, "Load "+ filename + " Succeed!")).show();
});

ipc.on(im.LOAD_DOT_FILE_FAILED, (event, filename) => {
    (new Toast(Toast.ERROR, "Load " + filename + " Failed!")).show();
});

ipc.on(im.TOAST, (event, type, msg, timeout) => {
    (new Toast(type, msg, timeout)).show();
});

