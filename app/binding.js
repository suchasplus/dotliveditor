"use strict";
const electron = require('electron');
const fs = require("electron").remote.require("fs-extra-promise");
const utils = require("./app/utils");
const co = require("co");
//const DOMParser = new DOMParser();
//const parser = require('dom-parser').DOMParser;
const parser = new DOMParser();
const settings = require('electron-settings');
// const remote = require('electron').remote;
// const dialog = remote.require('dialog');
require("./app/renderproc");

let editor = undefined;
let currentFile=null;
window.currentFile = currentFile;

$(function() {
    utils.log("start to Document Ready!");

    let timer = 0;
    let isEditing = false;
    const svgSize = { "width": 100, "height": 100 };
    let theme = settings.get("theme");
    if(theme === undefined) {
        theme = "midnight";
    }
    let rawRate = settings.get("zoomRate");
    if(rawRate === undefined) {
        rawRate = "100%";
    }
    $("#zoomRate").text(rawRate);

    //init select2
    const themeSelector = $("#themeSelector");
    themeSelector.select2({
        theme : "bootstrap",
        placeholder : "Coding Themes"
    });

    themeSelector.on("select2:select", (ev)=> {
        if(ev) {
            let theme_val = ev.params.data.id;
            editor.setOption("theme", theme_val);
            $("#theme-now").innerHTML = "theme: " + theme;
            settings.set("theme", theme_val);
        }
    });

    //init code mirror
    editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true
    });
    window.editor = editor;

    let lastContent = settings.get("dot");
    if( lastContent !== undefined) {
        editor.setValue(lastContent);
    }

    editor.setOption("theme", theme);
    $("#theme-now").innerHTML = "theme: " + theme;

    editor.on("change", () => {
        isEditing = true;
        utils.log("editor onChange: is editing");
    });

    $("#btnSync").on("click", (ev) =>{
        ev.preventDefault();
        console.log(ev);
        $(ev.target).toggleClass("active").blur();

        if ($(ev.target).hasClass("active")) {
            timer = setInterval(() => {
                if (isEditing) {
                    const data = editor.getValue();
                    settings.set("dot", data);
                    utils.log("updatePreview ret:" + updatePreview(data, $("#preview")));
                }
            }, 500);
        } else {
            clearInterval(timer);
            timer = 0;
        }
    }).click();

    $("#btnPreview").on("click", (ev) =>{
        ev.preventDefault();
        const data = editor.getValue();
        utils.log(data);
        updatePreview(data, $("#preview"));
    });

    $("#zoomRateList").find("a").on("click", (ev) => {
        const rawRate = $(ev.target).text();
        $("#zoomRate").text(rawRate);
        settings.set("zoomRate", rawRate);
        zoomingSVG(rawRate);
    });

    $("#btnSwitchSide").on('click', (ev) => {
        ev.preventDefault();
        const content = $(".content");
        let direction = (content.css("flex-direction") === 'row') ? 'row-reverse' : 'row';
        content.css("flex-direction", direction);
    });


    /**
     *
     * @param {string} dot
     * @param {object} canvas
     * @returns {string} dot produced svg string
     */
    function updatePreview(dot, canvas) {
        // parse dot -> svg
        if (dot === "") {
            isEditing = false;
            utils.log("updatePreview: dot is null");
            return undefined;
        }

        try {
            const xml = viz(dot, { format: "svg", engine: "dot" });
            utils.log(xml);
            if (!xml) {
                utils.log("viz xml is null");
                return undefined;
            }

            if (canvas) {
                const svg = parser.parseFromString(xml, "image/svg+xml");
                canvas.find("svg").remove();
                //utils.log(svg);
                canvas.append(svg.documentElement);
                //canvas.append(xml);
                isEditing = false;

                const $svg = $("svg");
                if ($svg.length === 1) {
                    const rawWidth = $svg.attr("width");
                    const rawHeight = $svg.attr("height");
                    svgSize.width = rawWidth ? parseInt(rawWidth.replace("pt", ""), 10) : 100;
                    svgSize.height = rawHeight ? parseInt(rawHeight.replace("pt", ""), 10) : 100;

                    zoomingSVG($("#zoomRate").text());
                }
            }
            return xml;
        } catch(err) {
            isEditing = false;
            utils.log(err);
            return undefined;
        }
    }


    /**
     * svg zooming
     * @param {string} rawRate
     */
    function zoomingSVG(rawRate){
        const $svg = $("svg");
        if ($svg.length === 1) {
            const rate = parseInt(rawRate.replace("%", ""), 10) / 100;
            utils.log("zooming " + rate);

            $svg.attr("width", `${svgSize.width * rate}pt`);
            $svg.attr("height", `${svgSize.height * rate}pt`);
        }
    }


    updatePreview(editor.getValue(), $("#preview"));
});
