"use strict";
// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var LogLevel_1 = require("../logger/LogLevel");
var IntervalScheduler_1 = require("../scheduler/IntervalScheduler");
var Log_1 = require("./Log");
var MeetingSessionPOSTLogger = /** @class */ (function () {
    function MeetingSessionPOSTLogger(name, configuration, batchSize, intervalMs, url, level) {
        var _this = this;
        if (level === void 0) { level = LogLevel_1.default.WARN; }
        this.name = name;
        this.configuration = configuration;
        this.batchSize = batchSize;
        this.intervalMs = intervalMs;
        this.url = url;
        this.level = level;
        this.logCapture = [];
        this.sequenceNumber = 0;
        this.lock = false;
        this.intervalScheduler = new IntervalScheduler_1.default(this.intervalMs);
        this.startLogPublishScheduler(this.batchSize);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        var GlobalAny = global;
        GlobalAny['window']['addEventListener'] &&
            window.addEventListener('unload', function () {
                _this.stop();
            });
    }
    MeetingSessionPOSTLogger.prototype.debug = function (debugFunction) {
        if (LogLevel_1.default.DEBUG < this.level) {
            return;
        }
        this.log(LogLevel_1.default.DEBUG, debugFunction());
    };
    MeetingSessionPOSTLogger.prototype.info = function (msg) {
        this.log(LogLevel_1.default.INFO, msg);
    };
    MeetingSessionPOSTLogger.prototype.warn = function (msg) {
        this.log(LogLevel_1.default.WARN, msg);
    };
    MeetingSessionPOSTLogger.prototype.error = function (msg) {
        this.log(LogLevel_1.default.ERROR, msg);
    };
    MeetingSessionPOSTLogger.prototype.setLogLevel = function (level) {
        this.level = level;
    };
    MeetingSessionPOSTLogger.prototype.getLogLevel = function () {
        return this.level;
    };
    MeetingSessionPOSTLogger.prototype.getLogCaptureSize = function () {
        return this.logCapture.length;
    };
    MeetingSessionPOSTLogger.prototype.startLogPublishScheduler = function (batchSize) {
        var _this = this;
        this.intervalScheduler.start(function () { return __awaiter(_this, void 0, void 0, function () {
            var batch, body, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.lock === true || this.getLogCaptureSize() === 0) {
                            return [2 /*return*/];
                        }
                        this.lock = true;
                        batch = this.logCapture.slice(0, batchSize);
                        body = this.makeRequestBody(batch);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, fetch(this.url, {
                                method: 'POST',
                                body: body,
                            })];
                    case 2:
                        response = _a.sent();
                        if (response.status === 200) {
                            this.logCapture = this.logCapture.slice(batch.length);
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        console.warn('[MeetingSessionPOSTLogger] ' + error_1.message);
                        return [3 /*break*/, 5];
                    case 4:
                        this.lock = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    MeetingSessionPOSTLogger.prototype.stop = function () {
        this.intervalScheduler.stop();
        var body = this.makeRequestBody(this.logCapture);
        navigator.sendBeacon(this.url, body);
    };
    MeetingSessionPOSTLogger.prototype.makeRequestBody = function (batch) {
        return JSON.stringify({
            meetingId: this.configuration.meetingId,
            attendeeId: this.configuration.credentials.attendeeId,
            appName: this.name,
            logs: batch,
        });
    };
    MeetingSessionPOSTLogger.prototype.log = function (type, msg) {
        if (type < this.level) {
            return;
        }
        var date = new Date();
        this.logCapture.push(new Log_1.default(this.sequenceNumber, msg, date.getTime(), LogLevel_1.default[type]));
        this.sequenceNumber += 1;
    };
    return MeetingSessionPOSTLogger;
}());
exports.default = MeetingSessionPOSTLogger;
//# sourceMappingURL=MeetingSessionPOSTLogger.js.map