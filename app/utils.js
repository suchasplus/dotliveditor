"use strict";

class Utils {

    static log(object) {
        if(true) {
            console.log(object);
        }
    }

    static isNullOrEmpty(value) {
        switch (typeof value) {
            case "object":
                if (value === null) {
                    return true;
                }
                if (value instanceof Array) {
                    if (value.length === 0) {
                        return true;
                    }
                }
                // Empty object？
                if (value instanceof Object) {
                    try {
                        let keys = Object.keys(value);
                        if (keys.length === 0) {
                            return true;
                        }
                    } catch (e) {
                        // In IE 8 and earlier, empty objects also true
                    }
                }
                break;
            case "string":
                if (value.length === 0) {
                    return true;
                }
                break;
            case "number":
                return false;
            case "boolean":
                return false;
            case "function":
                return false;
            case "undefined":
                return true;
        }

        return false;
    }

    static ltrim(value) {
        if (typeof value !== "string") {
            return value;
        }
        return value.replace(/^\s+/, "");
    }

    static rtrim(value) {
        if (typeof value !== "string") {
            return value;
        }
        return value.replace(/\s+$/, "");
    }

    static trim(value) {
        if (typeof value !== "string") {
            return value;
        }
        return value.replace(/^\s+|\s+$/, "");
    }
}


module.exports = Utils;