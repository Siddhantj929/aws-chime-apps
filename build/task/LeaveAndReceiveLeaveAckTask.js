"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var SignalingClientEventType_1 = require("../signalingclient/SignalingClientEventType");
var SignalingProtocol_js_1 = require("../signalingprotocol/SignalingProtocol.js");
var BaseTask_1 = require("./BaseTask");
/**
 * [[LeaveAndReceiveLeaveAckTask]] sends a Leave frame and waits for a LeaveAck.
 */
var LeaveAndReceiveLeaveAckTask = /** @class */ (function (_super) {
    __extends(LeaveAndReceiveLeaveAckTask, _super);
    function LeaveAndReceiveLeaveAckTask(context) {
        var _this = _super.call(this, context.logger) || this;
        _this.context = context;
        _this.taskName = 'LeaveAndReceiveLeaveAckTask';
        _this.taskCanceler = null;
        return _this;
    }
    LeaveAndReceiveLeaveAckTask.prototype.cancel = function () {
        if (this.taskCanceler) {
            this.taskCanceler.cancel();
            this.taskCanceler = null;
        }
    };
    LeaveAndReceiveLeaveAckTask.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.context.signalingClient.ready()) return [3 /*break*/, 2];
                        this.context.signalingClient.leave();
                        this.context.logger.info('sent leave');
                        return [4 /*yield*/, this.receiveLeaveAck()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    LeaveAndReceiveLeaveAckTask.prototype.receiveLeaveAck = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var Interceptor = /** @class */ (function () {
                function Interceptor(signalingClient, logger) {
                    this.signalingClient = signalingClient;
                    this.logger = logger;
                }
                Interceptor.prototype.cancel = function () {
                    this.signalingClient.removeObserver(this);
                    reject(new Error("LeaveAndReceiveLeaveAckTask got canceled while waiting for IndexFrame"));
                };
                Interceptor.prototype.handleSignalingClientEvent = function (event) {
                    if (event.isConnectionTerminated()) {
                        this.signalingClient.removeObserver(this);
                        this.logger.info('LeaveAndReceiveLeaveAckTask connection terminated');
                        // don't treat this as an error
                        resolve();
                        return;
                    }
                    if (event.type === SignalingClientEventType_1.default.ReceivedSignalFrame &&
                        event.message.type === SignalingProtocol_js_1.SdkSignalFrame.Type.LEAVE_ACK) {
                        this.signalingClient.removeObserver(this);
                        this.logger.info('got leave ack');
                        resolve();
                    }
                };
                return Interceptor;
            }());
            var interceptor = new Interceptor(_this.context.signalingClient, _this.context.logger);
            _this.taskCanceler = interceptor;
            _this.context.signalingClient.registerObserver(interceptor);
        });
    };
    return LeaveAndReceiveLeaveAckTask;
}(BaseTask_1.default));
exports.default = LeaveAndReceiveLeaveAckTask;
//# sourceMappingURL=LeaveAndReceiveLeaveAckTask.js.map