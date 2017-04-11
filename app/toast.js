'use strict';

class Toast {
    constructor(type, message, time) {
        this.type = type;
        this.message = message;
        this.time = time || 0;
        this.id = `message-dialog-${Date.now()}`;
    }

    /**
     * @return {string}
     */
    static get SUCCESS() {
        return 'success';
    }

    /**
     * @return {string}
     */
    static get INFO() {
        return 'info';
    }

    /**
     * @return {string}
     */
    static get WARN() {
        return 'warn';
    }

    /**
     * @return {string}
     */
    static get ERROR() {
        return 'error';
    }

    get className() {
        switch(this.type) {
            case "success":
                return "alert-success";
            case "info":
                return "alert-info";
            case "warn":
                return "alert-warning";
            case "error":
                return "alert-danger"
            default:
                return "alert-warning";
        }
    }

    get icon() {
        switch(this.type) {
            case "success": // (v)
                return `<span class="glyphicon glyphicon-ok-sign"></span>`;
            case "info": // (i)
                return `<span class="glyphicon glyphicon-info-sign"></span>`;
            case "warn": // (!)
                return `<span class="glyphicon glyphicon-exclamation-sign"></span>`;
            case "error": // (x)
                return `<span class="glyphicon glyphicon-remove-sign"></span>`;
            default:
                return "";
        }
    }

    show() {
        $("#message-area").append(
            `<div id="${this.id}" class="alert ${this.className} alert-dismissible fade in" role="alert">
  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  ${this.icon} ${this.message}
</div>`
        );

        if (this.time >= 0) {
            if(this.time === 0 ) this.time = 3000;
            setTimeout(() => {
                $(`#${this.id}`).alert("close");
            }, this.time);
        }
    }
}

module.exports = Toast;