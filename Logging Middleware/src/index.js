"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = log;
// Logging Middleware reusable package
const axios_1 = __importDefault(require("axios"));
async function log({ stack, level, package: pkg, message, accessToken }) {
    try {
        await axios_1.default.post('http://20.244.56.144/evaluation-service/logs', {
            stack,
            level,
            package: pkg,
            message
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
    }
    catch (error) {
        // Optionally handle logging errors (do not throw)
    }
}
