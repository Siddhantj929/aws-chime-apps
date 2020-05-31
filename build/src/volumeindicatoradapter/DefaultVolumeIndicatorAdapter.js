"use strict";
// Copyright 2019-2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
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
var DefaultVolumeIndicatorAdapter = /** @class */ (function () {
    function DefaultVolumeIndicatorAdapter(logger, realtimeController, minVolumeDecibels, maxVolumeDecibels) {
        this.logger = logger;
        this.realtimeController = realtimeController;
        this.minVolumeDecibels = minVolumeDecibels;
        this.maxVolumeDecibels = maxVolumeDecibels;
        this.streamIdToAttendeeId = {};
        this.streamIdToExternalUserId = {};
        this.warnedAboutMissingStreamIdMapping = {};
    }
    DefaultVolumeIndicatorAdapter.prototype.sendRealtimeUpdatesForAudioStreamIdInfo = function (info) {
        var e_1, _a;
        // @ts-ignore
        info.streams.sort(function (a, b) {
            a.audioStreamId - b.audioStreamId;
        });
        try {
            for (var _b = __values(info.streams), _c = _b.next(); !_c.done; _c = _b.next()) {
                var stream = _c.value;
                var hasAttendeeId = !!stream.attendeeId;
                var hasExternalUserId = !!stream.externalUserId;
                var hasMuted = stream.hasOwnProperty('muted');
                var hasDropped = !!stream.dropped;
                if (hasAttendeeId) {
                    this.streamIdToAttendeeId[stream.audioStreamId] = stream.attendeeId;
                    var externalUserId = hasExternalUserId ? stream.externalUserId : stream.attendeeId;
                    this.streamIdToExternalUserId[stream.audioStreamId] = externalUserId;
                    this.realtimeController.realtimeSetAttendeeIdPresence(stream.attendeeId, true, externalUserId, false);
                }
                if (hasMuted) {
                    var attendeeId = this.streamIdToAttendeeId[stream.audioStreamId];
                    var externalUserId = this.streamIdToExternalUserId[stream.audioStreamId];
                    this.realtimeController.realtimeUpdateVolumeIndicator(attendeeId, null, stream.muted, null, externalUserId);
                }
                if (!hasAttendeeId && !hasMuted) {
                    var attendeeId = this.streamIdToAttendeeId[stream.audioStreamId];
                    var externalUserId = this.streamIdToExternalUserId[stream.audioStreamId];
                    delete this.streamIdToAttendeeId[stream.audioStreamId];
                    delete this.streamIdToExternalUserId[stream.audioStreamId];
                    delete this.warnedAboutMissingStreamIdMapping[stream.audioStreamId];
                    this.realtimeController.realtimeSetAttendeeIdPresence(attendeeId, false, externalUserId, hasDropped);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    DefaultVolumeIndicatorAdapter.prototype.sendRealtimeUpdatesForAudioMetadata = function (metadata) {
        var e_2, _a;
        var volumes = null;
        var signalStrengths = null;
        try {
            for (var _b = __values(metadata.attendeeStates), _c = _b.next(); !_c.done; _c = _b.next()) {
                var state = _c.value;
                var attendeeId = this.attendeeIdForStreamId(state.audioStreamId);
                if (state.hasOwnProperty('volume')) {
                    if (volumes === null) {
                        volumes = {};
                    }
                    if (attendeeId !== null) {
                        // @ts-ignore: TODO fix this protobufjs issue
                        volumes[attendeeId] = this.normalizedVolume(state);
                    }
                }
                if (state.hasOwnProperty('signalStrength')) {
                    if (signalStrengths === null) {
                        signalStrengths = {};
                    }
                    if (attendeeId !== null) {
                        // @ts-ignore: TODO fix this protobufjs issue
                        signalStrengths[attendeeId] = this.normalizedSignalStrength(state);
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this.applyRealtimeUpdatesForAudioMetadata(volumes, signalStrengths);
    };
    DefaultVolumeIndicatorAdapter.prototype.normalizedVolume = function (state) {
        var dBVolume = -state.volume;
        var normalized = 1.0 - (dBVolume - this.maxVolumeDecibels) / (this.minVolumeDecibels - this.maxVolumeDecibels);
        var clipped = Math.min(Math.max(normalized, 0.0), 1.0);
        return clipped;
    };
    DefaultVolumeIndicatorAdapter.prototype.normalizedSignalStrength = function (state) {
        var normalized = state.signalStrength / DefaultVolumeIndicatorAdapter.MAX_SIGNAL_STRENGTH_LEVELS;
        var clipped = Math.min(Math.max(normalized, 0.0), 1.0);
        return clipped;
    };
    DefaultVolumeIndicatorAdapter.prototype.applyRealtimeUpdatesForAudioMetadata = function (volumes, signalStrengths) {
        for (var streamId in this.streamIdToAttendeeId) {
            var attendeeId = this.streamIdToAttendeeId[streamId];
            var externalUserId = this.streamIdToExternalUserId[streamId];
            var volumeUpdate = null;
            var signalStrengthUpdate = null;
            if (volumes !== null) {
                if (volumes.hasOwnProperty(attendeeId)) {
                    volumeUpdate = volumes[attendeeId];
                }
                else {
                    volumeUpdate = DefaultVolumeIndicatorAdapter.IMPLICIT_VOLUME;
                }
            }
            if (signalStrengths !== null) {
                if (signalStrengths.hasOwnProperty(attendeeId)) {
                    signalStrengthUpdate = signalStrengths[attendeeId];
                }
                else {
                    signalStrengthUpdate = DefaultVolumeIndicatorAdapter.IMPLICIT_SIGNAL_STRENGTH;
                }
            }
            if (volumeUpdate !== null || signalStrengthUpdate !== null) {
                this.realtimeController.realtimeUpdateVolumeIndicator(attendeeId, volumeUpdate, null, signalStrengthUpdate, externalUserId);
            }
        }
    };
    DefaultVolumeIndicatorAdapter.prototype.attendeeIdForStreamId = function (streamId) {
        if (streamId === 0) {
            return null;
        }
        var attendeeId = this.streamIdToAttendeeId[streamId];
        if (attendeeId) {
            return attendeeId;
        }
        if (!this.warnedAboutMissingStreamIdMapping[streamId]) {
            this.warnedAboutMissingStreamIdMapping[streamId] = true;
            this.logger.warn("volume indicator stream id " + streamId + " seen before being defined");
        }
        return null;
    };
    DefaultVolumeIndicatorAdapter.MAX_SIGNAL_STRENGTH_LEVELS = 2;
    DefaultVolumeIndicatorAdapter.IMPLICIT_VOLUME = 0;
    DefaultVolumeIndicatorAdapter.IMPLICIT_SIGNAL_STRENGTH = 1;
    return DefaultVolumeIndicatorAdapter;
}());
exports.default = DefaultVolumeIndicatorAdapter;
//# sourceMappingURL=DefaultVolumeIndicatorAdapter.js.map