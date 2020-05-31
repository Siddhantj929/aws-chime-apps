"use strict";
// Copyright 2019-2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var Maybe_1 = require("../maybe/Maybe");
var AsyncScheduler_1 = require("../scheduler/AsyncScheduler");
var IntervalScheduler_1 = require("../scheduler/IntervalScheduler");
var DefaultVideoTile_1 = require("../videotile/DefaultVideoTile");
var DevicePermission_1 = require("./DevicePermission");
var DeviceSelection_1 = require("./DeviceSelection");
var DefaultDeviceController = /** @class */ (function () {
    function DefaultDeviceController(logger) {
        var _this = this;
        this.logger = logger;
        this.deviceInfoCache = null;
        this.activeDevices = { audio: null, video: null };
        this.audioOutputDeviceId = null;
        this.deviceChangeObservers = new Set();
        this.deviceLabelTrigger = function () {
            return navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        };
        this.audioInputContext = null;
        this.audioInputDestinationNode = null;
        this.audioInputSourceNode = null;
        this.videoWidth = DefaultDeviceController.defaultVideoWidth;
        this.videoHeight = DefaultDeviceController.defaultVideoHeight;
        this.videoFrameRate = DefaultDeviceController.defaultVideoFrameRate;
        this.videoMaxBandwidthKbps = DefaultDeviceController.defaultVideoMaxBandwidthKbps;
        this.useWebAudio = false;
        this.isAndroid = false;
        this.isPixel3 = false;
        this.alreadyHandlingDeviceChange = false;
        this.isAndroid = /(android)/i.test(navigator.userAgent);
        this.isPixel3 = /( pixel 3)/i.test(navigator.userAgent);
        if (this.isAndroid && this.isPixel3) {
            this.videoWidth = Math.ceil(this.videoWidth / 32) * 32;
            this.videoHeight = Math.ceil(this.videoHeight / 32) * 32;
        }
        this.logger.info("DefaultDeviceController video dimension " + this.videoWidth + " x " + this.videoHeight);
        // @ts-ignore
        navigator.mediaDevices.addEventListener('devicechange', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.handleDeviceChange()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    }
    DefaultDeviceController.prototype.listAudioInputDevices = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.listDevicesOfKind('audioinput')];
                    case 1:
                        result = _a.sent();
                        this.trace('listAudioInputDevices', null, result);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    DefaultDeviceController.prototype.listVideoInputDevices = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.listDevicesOfKind('videoinput')];
                    case 1:
                        result = _a.sent();
                        this.trace('listVideoInputDevices', null, result);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    DefaultDeviceController.prototype.listAudioOutputDevices = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.listDevicesOfKind('audiooutput')];
                    case 1:
                        result = _a.sent();
                        this.trace('listAudioOutputDevices', null, result);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    DefaultDeviceController.prototype.chooseAudioInputDevice = function (device) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chooseInputDevice('audio', device, false)];
                    case 1:
                        result = _a.sent();
                        this.trace('chooseAudioInputDevice', device, DevicePermission_1.default[result]);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    DefaultDeviceController.prototype.chooseVideoInputDevice = function (device) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.updateMaxBandwidthKbps();
                        return [4 /*yield*/, this.chooseInputDevice('video', device, false)];
                    case 1:
                        result = _a.sent();
                        this.trace('chooseVideoInputDevice', device, DevicePermission_1.default[result]);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    DefaultDeviceController.prototype.chooseAudioOutputDevice = function (deviceId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.audioOutputDeviceId = deviceId;
                this.bindAudioOutput();
                this.trace('chooseAudioOutputDevice', deviceId, null);
                return [2 /*return*/];
            });
        });
    };
    DefaultDeviceController.prototype.enableWebAudio = function (flag) {
        this.useWebAudio = flag;
    };
    DefaultDeviceController.prototype.addDeviceChangeObserver = function (observer) {
        this.logger.info('adding device change observer');
        this.deviceChangeObservers.add(observer);
        this.trace('addDeviceChangeObserver');
    };
    DefaultDeviceController.prototype.removeDeviceChangeObserver = function (observer) {
        this.logger.info('removing device change observer');
        this.deviceChangeObservers.delete(observer);
        this.trace('removeDeviceChangeObserver');
    };
    DefaultDeviceController.prototype.createAnalyserNodeForAudioInput = function () {
        if (!this.activeDevices['audio']) {
            return null;
        }
        var audioContext = DefaultDeviceController.createAudioContext();
        var analyser = audioContext.createAnalyser();
        audioContext.createMediaStreamSource(this.activeDevices['audio'].stream).connect(analyser);
        this.trace('createAnalyserNodeForAudioInput');
        return analyser;
    };
    DefaultDeviceController.prototype.startVideoPreviewForVideoInput = function (element) {
        var _this = this;
        if (!this.activeDevices['video']) {
            this.logger.warn('cannot bind video preview since video input device has not been chosen');
            this.trace('startVideoPreviewForVideoInput', element.id);
            return;
        }
        // TODO: implement MediaDestroyer to provide single release MediaStream function
        this.releaseMediaStream(element.srcObject);
        DefaultVideoTile_1.default.disconnectVideoStreamFromVideoElement(element, false);
        navigator.mediaDevices
            .getUserMedia(this.activeDevices['video'].constraints)
            .then(function (previewStream) {
            DefaultVideoTile_1.default.connectVideoStreamToVideoElement(previewStream, element, true);
        })
            .catch(function (error) {
            _this.logger.warn("Unable to reacquire video stream for preview to element " + element.id + ": " + error);
        });
        this.trace('startVideoPreviewForVideoInput', element.id);
    };
    DefaultDeviceController.prototype.stopVideoPreviewForVideoInput = function (element) {
        var stream = element.srcObject;
        if (stream) {
            this.releaseMediaStream(stream);
            DefaultVideoTile_1.default.disconnectVideoStreamFromVideoElement(element, false);
        }
        if (this.activeDevices['video']) {
            this.releaseMediaStream(this.activeDevices['video'].stream);
        }
        this.trace('stopVideoPreviewForVideoInput', element.id);
    };
    DefaultDeviceController.prototype.setDeviceLabelTrigger = function (trigger) {
        this.deviceLabelTrigger = trigger;
        this.trace('setDeviceLabelTrigger');
    };
    DefaultDeviceController.prototype.mixIntoAudioInput = function (stream) {
        var node = null;
        if (this.enableWebAudio) {
            this.ensureAudioInputContext();
            node = this.audioInputContext.createMediaStreamSource(stream);
            node.connect(this.audioInputDestinationNode);
        }
        else {
            this.logger.warn('WebAudio is not enabled, mixIntoAudioInput will not work');
        }
        this.trace('mixIntoAudioInput', stream.id);
        return node;
    };
    DefaultDeviceController.prototype.chooseVideoInputQuality = function (width, height, frameRate, maxBandwidthKbps) {
        if (this.isAndroid && this.isPixel3) {
            this.videoWidth = Math.ceil(width / 32) * 32;
            this.videoHeight = Math.ceil(height / 32) * 32;
        }
        else {
            this.videoWidth = width;
            this.videoHeight = height;
        }
        this.videoFrameRate = frameRate;
        this.videoMaxBandwidthKbps = maxBandwidthKbps;
        this.updateMaxBandwidthKbps();
    };
    DefaultDeviceController.prototype.acquireAudioInputStream = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.acquireInputStream('audio')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DefaultDeviceController.prototype.acquireVideoInputStream = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.acquireInputStream('video')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DefaultDeviceController.prototype.acquireDisplayInputStream = function (streamConstraints) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (streamConstraints &&
                    streamConstraints.video &&
                    // @ts-ignore
                    streamConstraints.video.mandatory &&
                    // @ts-ignore
                    streamConstraints.video.mandatory.chromeMediaSource &&
                    // @ts-ignore
                    streamConstraints.video.mandatory.chromeMediaSourceId) {
                    return [2 /*return*/, navigator.mediaDevices.getUserMedia(streamConstraints)];
                }
                // @ts-ignore https://github.com/microsoft/TypeScript/issues/31821
                return [2 /*return*/, navigator.mediaDevices.getDisplayMedia(streamConstraints)];
            });
        });
    };
    DefaultDeviceController.prototype.releaseMediaStream = function (mediaStreamToRelease) {
        var e_1, _a;
        if (!mediaStreamToRelease) {
            return;
        }
        var tracksToStop = null;
        if (!!this.audioInputDestinationNode &&
            mediaStreamToRelease === this.audioInputDestinationNode.stream) {
            // release the true audio stream if WebAudio is used.
            this.logger.info('stopping audio track');
            tracksToStop = this.audioInputSourceNode.mediaStream.getTracks();
            this.audioInputSourceNode.disconnect();
        }
        else {
            tracksToStop = mediaStreamToRelease.getTracks();
        }
        try {
            for (var tracksToStop_1 = __values(tracksToStop), tracksToStop_1_1 = tracksToStop_1.next(); !tracksToStop_1_1.done; tracksToStop_1_1 = tracksToStop_1.next()) {
                var track = tracksToStop_1_1.value;
                this.logger.info("stopping " + track.kind + " track");
                track.stop();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (tracksToStop_1_1 && !tracksToStop_1_1.done && (_a = tracksToStop_1.return)) _a.call(tracksToStop_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        for (var kind in this.activeDevices) {
            if (this.activeDevices[kind] && this.activeDevices[kind].stream === mediaStreamToRelease) {
                this.activeDevices[kind] = null;
            }
        }
    };
    DefaultDeviceController.prototype.bindToAudioVideoController = function (audioVideoController) {
        this.boundAudioVideoController = audioVideoController;
        this.bindAudioOutput();
    };
    DefaultDeviceController.createEmptyAudioDevice = function () {
        return DefaultDeviceController.synthesizeAudioDevice(0);
    };
    DefaultDeviceController.createEmptyVideoDevice = function () {
        return DefaultDeviceController.synthesizeVideoDevice('black');
    };
    DefaultDeviceController.synthesizeAudioDevice = function (toneHz) {
        var audioContext = DefaultDeviceController.createAudioContext();
        var outputNode = audioContext.createMediaStreamDestination();
        if (!toneHz) {
            var source = audioContext.createBufferSource();
            source.buffer = audioContext.createBuffer(1, audioContext.sampleRate * 5, audioContext.sampleRate);
            // Some browsers will not play audio out the MediaStreamDestination
            // unless there is actually audio to play, so we add a small amount of
            // noise here to ensure that audio is played out.
            source.buffer.getChannelData(0)[0] = 0.0003;
            source.loop = true;
            source.connect(outputNode);
            source.start();
        }
        else {
            var gainNode = audioContext.createGain();
            gainNode.gain.value = 0.1;
            gainNode.connect(outputNode);
            var oscillatorNode = audioContext.createOscillator();
            oscillatorNode.frequency.value = toneHz;
            oscillatorNode.connect(gainNode);
            oscillatorNode.start();
        }
        outputNode.addEventListener('ended', function () {
            audioContext.close();
        });
        return outputNode.stream;
    };
    DefaultDeviceController.synthesizeVideoDevice = function (colorOrPattern) {
        var canvas = document.createElement('canvas');
        canvas.width = 480;
        canvas.height = (canvas.width / 16) * 9;
        var scheduler = new IntervalScheduler_1.default(1000);
        var context = canvas.getContext('2d');
        scheduler.start(function () {
            if (colorOrPattern === 'smpte') {
                DefaultDeviceController.fillSMPTEColorBars(canvas, 0);
            }
            else {
                context.fillStyle = colorOrPattern;
                context.fillRect(0, 0, canvas.width, canvas.height);
            }
        });
        // @ts-ignore
        var stream = canvas.captureStream(5) || null;
        if (stream) {
            stream.getVideoTracks()[0].addEventListener('ended', function () {
                scheduler.stop();
            });
        }
        return stream;
    };
    DefaultDeviceController.fillSMPTEColorBars = function (canvas, xShift) {
        var w = canvas.width;
        var h = canvas.height;
        var h1 = (h * 2) / 3;
        var h2 = (h * 3) / 4;
        var h3 = h;
        var top = ['#c0c0c0', '#c0c000', '#00c0c0', '#00c000', '#c000c0', '#c00000', '#0000c0'];
        var middle = ['#0000c0', '#000000', '#c000c0', '#000000', '#00c0c0', '#000000', '#c0c0c0'];
        var bottom = [
            '#00214c',
            '#ffffff',
            '#32006a',
            '#131313',
            '#090909',
            '#131313',
            '#1d1d1d',
            '#131313',
        ];
        var bottomX = [
            w * 0,
            ((w * 1) / 4) * (5 / 7),
            ((w * 2) / 4) * (5 / 7),
            ((w * 3) / 4) * (5 / 7),
            w * (5 / 7),
            w * (5 / 7 + 1 / 21),
            w * (5 / 7 + 2 / 21),
            w * (6 / 7),
            w * 1,
        ];
        var segmentWidth = w / top.length;
        var ctx = canvas.getContext('2d');
        for (var i = 0; i < top.length; i++) {
            ctx.fillStyle = top[i];
            ctx.fillRect(xShift + i * segmentWidth, 0, segmentWidth, h1);
            ctx.fillStyle = middle[i];
            ctx.fillRect(xShift + i * segmentWidth, h1, segmentWidth, h2 - h1);
        }
        for (var i = 0; i < bottom.length; i++) {
            ctx.fillStyle = bottom[i];
            ctx.fillRect(xShift + bottomX[i], h2, bottomX[i + 1] - bottomX[i], h3 - h2);
        }
    };
    DefaultDeviceController.prototype.updateMaxBandwidthKbps = function () {
        if (this.boundAudioVideoController) {
            this.boundAudioVideoController.setVideoMaxBandwidthKbps(this.videoMaxBandwidthKbps);
        }
    };
    DefaultDeviceController.prototype.listDevicesOfKind = function (deviceKind) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.deviceInfoCache === null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.updateDeviceInfoCacheFromBrowser()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.listCachedDevicesOfKind(deviceKind)];
                }
            });
        });
    };
    DefaultDeviceController.prototype.updateDeviceInfoCacheFromBrowser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var doesNotHaveAccessToMediaDevices, devices, hasDeviceLabels, devices_1, devices_1_1, device, triggerStream, _a, _b, track, err_1;
            var e_2, _c, e_3, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        doesNotHaveAccessToMediaDevices = !MediaDeviceInfo;
                        if (doesNotHaveAccessToMediaDevices) {
                            this.deviceInfoCache = [];
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, navigator.mediaDevices.enumerateDevices()];
                    case 1:
                        devices = _e.sent();
                        hasDeviceLabels = true;
                        try {
                            for (devices_1 = __values(devices), devices_1_1 = devices_1.next(); !devices_1_1.done; devices_1_1 = devices_1.next()) {
                                device = devices_1_1.value;
                                if (!device.label) {
                                    hasDeviceLabels = false;
                                    break;
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (devices_1_1 && !devices_1_1.done && (_c = devices_1.return)) _c.call(devices_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        if (!!hasDeviceLabels) return [3 /*break*/, 6];
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, 5, , 6]);
                        this.logger.info('attempting to trigger media device labels since they are hidden');
                        return [4 /*yield*/, this.deviceLabelTrigger()];
                    case 3:
                        triggerStream = _e.sent();
                        return [4 /*yield*/, navigator.mediaDevices.enumerateDevices()];
                    case 4:
                        devices = _e.sent();
                        try {
                            for (_a = __values(triggerStream.getTracks()), _b = _a.next(); !_b.done; _b = _a.next()) {
                                track = _b.value;
                                track.stop();
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _e.sent();
                        this.logger.info('unable to get media device labels');
                        return [3 /*break*/, 6];
                    case 6:
                        this.deviceInfoCache = devices;
                        return [2 /*return*/];
                }
            });
        });
    };
    DefaultDeviceController.prototype.listCachedDevicesOfKind = function (deviceKind) {
        var e_4, _a;
        var devicesOfKind = [];
        try {
            for (var _b = __values(this.deviceInfoCache), _c = _b.next(); !_c.done; _c = _b.next()) {
                var device = _c.value;
                if (device.kind === deviceKind) {
                    devicesOfKind.push(device);
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return devicesOfKind;
    };
    DefaultDeviceController.prototype.handleDeviceChange = function () {
        return __awaiter(this, void 0, void 0, function () {
            var oldAudioInputDevices, oldVideoInputDevices, oldAudioOutputDevices, newAudioInputDevices, newVideoInputDevices, newAudioOutputDevices;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.deviceInfoCache === null) {
                            return [2 /*return*/];
                        }
                        if (this.alreadyHandlingDeviceChange) {
                            new AsyncScheduler_1.default().start(function () {
                                _this.handleDeviceChange();
                            });
                            return [2 /*return*/];
                        }
                        this.alreadyHandlingDeviceChange = true;
                        oldAudioInputDevices = this.listCachedDevicesOfKind('audioinput');
                        oldVideoInputDevices = this.listCachedDevicesOfKind('videoinput');
                        oldAudioOutputDevices = this.listCachedDevicesOfKind('audiooutput');
                        return [4 /*yield*/, this.updateDeviceInfoCacheFromBrowser()];
                    case 1:
                        _a.sent();
                        newAudioInputDevices = this.listCachedDevicesOfKind('audioinput');
                        newVideoInputDevices = this.listCachedDevicesOfKind('videoinput');
                        newAudioOutputDevices = this.listCachedDevicesOfKind('audiooutput');
                        this.forEachObserver(function (observer) {
                            if (!_this.areDeviceListsEqual(oldAudioInputDevices, newAudioInputDevices)) {
                                Maybe_1.default.of(observer.audioInputsChanged).map(function (f) { return f.bind(observer)(newAudioInputDevices); });
                            }
                            if (!_this.areDeviceListsEqual(oldVideoInputDevices, newVideoInputDevices)) {
                                Maybe_1.default.of(observer.videoInputsChanged).map(function (f) { return f.bind(observer)(newVideoInputDevices); });
                            }
                            if (!_this.areDeviceListsEqual(oldAudioOutputDevices, newAudioOutputDevices)) {
                                Maybe_1.default.of(observer.audioOutputsChanged).map(function (f) { return f.bind(observer)(newAudioOutputDevices); });
                            }
                        });
                        this.alreadyHandlingDeviceChange = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    DefaultDeviceController.prototype.forEachObserver = function (observerFunc) {
        var e_5, _a;
        var _this = this;
        var _loop_1 = function (observer) {
            new AsyncScheduler_1.default().start(function () {
                if (_this.deviceChangeObservers.has(observer)) {
                    observerFunc(observer);
                }
            });
        };
        try {
            for (var _b = __values(this.deviceChangeObservers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var observer = _c.value;
                _loop_1(observer);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
    };
    DefaultDeviceController.prototype.areDeviceListsEqual = function (a, b) {
        return (JSON.stringify(a.map(function (device) { return JSON.stringify(device); }).sort()) ===
            JSON.stringify(b.map(function (device) { return JSON.stringify(device); }).sort()));
    };
    DefaultDeviceController.prototype.deviceAsMediaStream = function (device) {
        // @ts-ignore
        return device && device.id ? device : null;
    };
    DefaultDeviceController.prototype.chooseInputDevice = function (kind, device, fromAcquire) {
        return __awaiter(this, void 0, void 0, function () {
            var proposedConstraints, oldStream, startTimeMs, newDevice, stream, error_1, restartVideo, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (device === null && kind === 'video') {
                            if (this.activeDevices[kind]) {
                                this.releaseMediaStream(this.activeDevices[kind].stream);
                                delete this.activeDevices[kind];
                            }
                            return [2 /*return*/, DevicePermission_1.default.PermissionGrantedByBrowser];
                        }
                        proposedConstraints = this.calculateMediaStreamConstraints(kind, device);
                        if (this.activeDevices[kind] &&
                            this.activeDevices[kind].matchesConstraints(proposedConstraints) &&
                            this.activeDevices[kind].stream.active) {
                            this.logger.info("reusing existing " + kind + " device");
                            return [2 /*return*/, DevicePermission_1.default.PermissionGrantedPreviously];
                        }
                        oldStream = this.activeDevices[kind]
                            ? this.activeDevices[kind].stream
                            : null;
                        if (kind === 'audio') {
                            this.releaseMediaStream(oldStream);
                        }
                        startTimeMs = Date.now();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        this.logger.info("requesting new " + kind + " device with constraint " + proposedConstraints);
                        stream = this.deviceAsMediaStream(device);
                        if (!(kind === 'audio' && device === null)) return [3 /*break*/, 2];
                        newDevice = new DeviceSelection_1.default();
                        newDevice.stream = DefaultDeviceController.createEmptyAudioDevice();
                        newDevice.constraints = null;
                        return [3 /*break*/, 5];
                    case 2:
                        if (!stream) return [3 /*break*/, 3];
                        this.logger.info("using media stream " + stream.id + " for " + kind + " device");
                        newDevice = new DeviceSelection_1.default();
                        newDevice.stream = stream;
                        newDevice.constraints = proposedConstraints;
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.getDeviceFromBrowser(proposedConstraints)];
                    case 4:
                        newDevice = _a.sent();
                        newDevice.stream.getTracks()[0].addEventListener('ended', function () {
                            if (_this.activeDevices[kind].stream === newDevice.stream) {
                                _this.logger.warn(kind + " input device which was active is no longer available, resetting to null device");
                                _this.chooseInputDevice(kind, null, false);
                                if (kind === 'video' &&
                                    _this.boundAudioVideoController &&
                                    _this.boundAudioVideoController.videoTileController.hasStartedLocalVideoTile()) {
                                    _this.boundAudioVideoController.videoTileController.stopLocalVideoTile();
                                }
                            }
                        });
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        this.logger.error("failed to get " + kind + " device for constraints " + JSON.stringify(proposedConstraints) + ": " + error_1.message);
                        return [2 /*return*/, Date.now() - startTimeMs <
                                DefaultDeviceController.permissionDeniedOriginDetectionThresholdMs
                                ? DevicePermission_1.default.PermissionDeniedByBrowser
                                : DevicePermission_1.default.PermissionDeniedByUser];
                    case 7:
                        this.logger.info("got " + kind + " device for constraints " + JSON.stringify(proposedConstraints));
                        restartVideo = kind === 'video' &&
                            !fromAcquire &&
                            this.boundAudioVideoController &&
                            this.boundAudioVideoController.videoTileController.hasStartedLocalVideoTile();
                        this.activeDevices[kind] = newDevice;
                        if (!restartVideo) return [3 /*break*/, 8];
                        this.logger.info('restarting local video to switch to new device');
                        this.boundAudioVideoController.restartLocalVideo(function () {
                            // TODO: implement MediaStreamDestroyer
                            // tracks of oldStream should be stopped when video tile is disconnected from MediaStream
                            // otherwise, camera is still being accessed and we need to stop it here.
                            if (oldStream && oldStream.active) {
                                _this.logger.warn('previous media stream is not stopped during restart video');
                                _this.releaseMediaStream(oldStream);
                            }
                        });
                        return [3 /*break*/, 14];
                    case 8:
                        if (!(kind === 'video')) return [3 /*break*/, 9];
                        this.releaseMediaStream(oldStream);
                        return [3 /*break*/, 14];
                    case 9:
                        if (!this.useWebAudio) return [3 /*break*/, 10];
                        this.attachAudioInputStreamToAudioContext(this.activeDevices[kind].stream);
                        return [3 /*break*/, 14];
                    case 10:
                        _a.trys.push([10, 13, , 14]);
                        if (!this.boundAudioVideoController) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.boundAudioVideoController.restartLocalAudio(function () { })];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        error_2 = _a.sent();
                        this.logger.info("cannot replace audio track due to: " + error_2.message);
                        return [3 /*break*/, 14];
                    case 14: return [2 /*return*/, Date.now() - startTimeMs <
                            DefaultDeviceController.permissionGrantedOriginDetectionThresholdMs
                            ? DevicePermission_1.default.PermissionGrantedByBrowser
                            : DevicePermission_1.default.PermissionGrantedByUser];
                }
            });
        });
    };
    DefaultDeviceController.prototype.bindAudioOutput = function () {
        return __awaiter(this, void 0, void 0, function () {
            var deviceInfo;
            return __generator(this, function (_a) {
                if (!this.boundAudioVideoController) {
                    return [2 /*return*/];
                }
                deviceInfo = this.deviceInfoFromDeviceId('audiooutput', this.audioOutputDeviceId);
                // TODO: fail promise if audio output device cannot be selected or setSinkId promise rejects
                this.boundAudioVideoController.audioMixController.bindAudioDevice(deviceInfo);
                return [2 /*return*/];
            });
        });
    };
    DefaultDeviceController.prototype.calculateMediaStreamConstraints = function (kind, device) {
        var trackConstraints = {};
        if (device === '') {
            device = null;
        }
        var stream = this.deviceAsMediaStream(device);
        if (device === null) {
            return null;
        }
        else if (typeof device === 'string') {
            trackConstraints.deviceId = { exact: device };
        }
        else if (stream) {
            // @ts-ignore - create a fake track constraint using the stream id
            trackConstraints.streamId = stream.id;
        }
        else {
            // @ts-ignore - device is a MediaTrackConstraints
            trackConstraints = device;
        }
        if (kind === 'video') {
            trackConstraints.width = trackConstraints.width || this.videoWidth;
            trackConstraints.height = trackConstraints.height || this.videoHeight;
            trackConstraints.frameRate = trackConstraints.frameRate || this.videoFrameRate;
        }
        if (kind === 'audio' && this.supportSampleRateConstraint()) {
            trackConstraints.sampleRate = { ideal: DefaultDeviceController.defaultSampleRate };
        }
        if (kind === 'audio' && this.supportSampleSizeConstraint()) {
            trackConstraints.sampleSize = { ideal: DefaultDeviceController.defaultSampleSize };
        }
        if (kind === 'audio' && this.supportChannelCountConstraint()) {
            trackConstraints.channelCount = { ideal: DefaultDeviceController.defaultChannelCount };
        }
        if (kind === 'audio') {
            // @ts-ignore
            trackConstraints.echoCancellation = true;
            // @ts-ignore
            trackConstraints.googEchoCancellation = true;
            // @ts-ignore
            trackConstraints.googAutoGainControl = true;
            // @ts-ignore
            trackConstraints.googNoiseSuppression = true;
            // @ts-ignore
            trackConstraints.googHighpassFilter = true;
            // @ts-ignore
            trackConstraints.googNoiseSuppression2 = true;
            // @ts-ignore
            trackConstraints.googEchoCancellation2 = true;
            // @ts-ignore
            trackConstraints.googAutoGainControl2 = true;
        }
        return kind === 'audio' ? { audio: trackConstraints } : { video: trackConstraints };
    };
    DefaultDeviceController.prototype.getDeviceFromBrowser = function (constraints) {
        return __awaiter(this, void 0, void 0, function () {
            var deviceSelection, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        deviceSelection = new DeviceSelection_1.default();
                        _a = deviceSelection;
                        return [4 /*yield*/, navigator.mediaDevices.getUserMedia(constraints)];
                    case 1:
                        _a.stream = _b.sent();
                        deviceSelection.constraints = constraints;
                        return [4 /*yield*/, this.handleDeviceChange()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, deviceSelection];
                }
            });
        });
    };
    DefaultDeviceController.prototype.deviceInfoFromDeviceId = function (deviceKind, deviceId) {
        var e_6, _a;
        if (this.deviceInfoCache === null) {
            return null;
        }
        try {
            for (var _b = __values(this.deviceInfoCache), _c = _b.next(); !_c.done; _c = _b.next()) {
                var device = _c.value;
                if (device.kind === deviceKind && device.deviceId === deviceId) {
                    return device;
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return null;
    };
    DefaultDeviceController.prototype.acquireInputStream = function (kind) {
        return __awaiter(this, void 0, void 0, function () {
            var existingConstraints, active, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (kind === 'audio') {
                            if (this.useWebAudio) {
                                this.ensureAudioInputContext();
                                return [2 /*return*/, this.audioInputDestinationNode.stream];
                            }
                        }
                        existingConstraints = null;
                        if (!this.activeDevices[kind]) {
                            if (kind === 'audio') {
                                this.logger.info("no " + kind + " device chosen, creating empty " + kind + " device");
                            }
                            else {
                                this.logger.error("no " + kind + " device chosen, stopping local video tile");
                                this.boundAudioVideoController.videoTileController.stopLocalVideoTile();
                                throw new Error("no " + kind + " device chosen, stopping local video tile");
                            }
                        }
                        else {
                            this.logger.info("checking whether existing " + kind + " device can be reused");
                            active = this.activeDevices[kind];
                            // @ts-ignore
                            existingConstraints = active.constraints ? active.constraints[kind] : null;
                        }
                        return [4 /*yield*/, this.chooseInputDevice(kind, existingConstraints, true)];
                    case 1:
                        result = _a.sent();
                        if (result === DevicePermission_1.default.PermissionDeniedByBrowser ||
                            result === DevicePermission_1.default.PermissionDeniedByUser) {
                            this.logger.error("unable to acquire " + kind + " device");
                            throw new Error("unable to acquire " + kind + " device");
                        }
                        return [2 /*return*/, this.activeDevices[kind].stream];
                }
            });
        });
    };
    DefaultDeviceController.prototype.ensureAudioInputContext = function () {
        if (this.audioInputContext) {
            return;
        }
        this.audioInputContext = DefaultDeviceController.createAudioContext();
        this.audioInputDestinationNode = this.audioInputContext.createMediaStreamDestination();
    };
    DefaultDeviceController.prototype.attachAudioInputStreamToAudioContext = function (stream) {
        this.ensureAudioInputContext();
        if (this.audioInputSourceNode) {
            this.audioInputSourceNode.disconnect();
        }
        this.audioInputSourceNode = this.audioInputContext.createMediaStreamSource(stream);
        this.audioInputSourceNode.connect(this.audioInputDestinationNode);
    };
    DefaultDeviceController.createAudioContext = function () {
        var options = {};
        if (navigator.mediaDevices.getSupportedConstraints().sampleRate) {
            options.sampleRate = DefaultDeviceController.defaultSampleRate;
        }
        // @ts-ignore
        return new (window.AudioContext || window.webkitAudioContext)(options);
    };
    DefaultDeviceController.prototype.supportSampleRateConstraint = function () {
        return this.useWebAudio && !!navigator.mediaDevices.getSupportedConstraints().sampleRate;
    };
    DefaultDeviceController.prototype.supportSampleSizeConstraint = function () {
        return this.useWebAudio && !!navigator.mediaDevices.getSupportedConstraints().sampleSize;
    };
    DefaultDeviceController.prototype.supportChannelCountConstraint = function () {
        return this.useWebAudio && !!navigator.mediaDevices.getSupportedConstraints().channelCount;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    DefaultDeviceController.prototype.trace = function (name, input, output) {
        var s = "API/DefaultDeviceController/" + name;
        if (typeof input !== 'undefined') {
            s += " " + JSON.stringify(input);
        }
        if (typeof output !== 'undefined') {
            s += " -> " + JSON.stringify(output);
        }
        this.logger.info(s);
    };
    DefaultDeviceController.permissionGrantedOriginDetectionThresholdMs = 1000;
    DefaultDeviceController.permissionDeniedOriginDetectionThresholdMs = 500;
    DefaultDeviceController.defaultVideoWidth = 960;
    DefaultDeviceController.defaultVideoHeight = 540;
    DefaultDeviceController.defaultVideoFrameRate = 15;
    DefaultDeviceController.defaultVideoMaxBandwidthKbps = 1400;
    DefaultDeviceController.defaultSampleRate = 48000;
    DefaultDeviceController.defaultSampleSize = 16;
    DefaultDeviceController.defaultChannelCount = 1;
    return DefaultDeviceController;
}());
exports.default = DefaultDeviceController;
//# sourceMappingURL=DefaultDeviceController.js.map