IPC_DEFINE = {
    OPEN_DOT : "open-dot",
    SAVE_DOT : "save-dot",
    SAVE_SVG : "save-svg",
    SAVE_PNG : "save-png",

    SELECTED_DOT_FILE : "selected-dot-file", // return file path while open dot file dialog
    TRY_LOAD_DOT_FILE : "try-load-dot-file",
    LOAD_DOT_FILE_SUCCESS : "load-dot-file-success", // load dot file succeed
    LOAD_DOT_FILE_FAILED : "load-dot-file-failed", // load dot file failed

    TOAST : "toast",
};

module.exports = IPC_DEFINE;