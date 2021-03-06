import BrowserBehavior from '../browserbehavior/BrowserBehavior';
import Logger from '../logger/Logger';
import VideoStreamIdSet from '../videostreamidset/VideoStreamIdSet';
import VideoStreamIndex from '../videostreamindex/VideoStreamIndex';
import TransceiverController from './TransceiverController';
export default class DefaultTransceiverController implements TransceiverController {
    private logger;
    private browserBehavior;
    private _localCameraTransceiver;
    private _localAudioTransceiver;
    private videoSubscriptions;
    private defaultMediaStream;
    private peer;
    constructor(logger: Logger, browserBehavior: BrowserBehavior);
    static setVideoSendingBitrateKbpsForSender(sender: RTCRtpSender, bitrateKbps: number, _logger: Logger): Promise<void>;
    static replaceAudioTrackForSender(sender: RTCRtpSender, track: MediaStreamTrack): Promise<boolean>;
    localAudioTransceiver(): RTCRtpTransceiver;
    localVideoTransceiver(): RTCRtpTransceiver;
    setVideoSendingBitrateKbps(bitrateKbps: number): Promise<void>;
    setPeer(peer: RTCPeerConnection): void;
    reset(): void;
    useTransceivers(): boolean;
    trackIsVideoInput(track: MediaStreamTrack): boolean;
    setupLocalTransceivers(): void;
    replaceAudioTrack(track: MediaStreamTrack): Promise<boolean>;
    setAudioInput(track: MediaStreamTrack | null): Promise<void>;
    setVideoInput(track: MediaStreamTrack | null): Promise<void>;
    updateVideoTransceivers(videoStreamIndex: VideoStreamIndex, videosToReceive: VideoStreamIdSet): number[];
    private unsubscribeTransceivers;
    private subscribeTransceivers;
    private transceiverIsVideo;
    private debugDumpTransceivers;
    private setTransceiverInput;
}
