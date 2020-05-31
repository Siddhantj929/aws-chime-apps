/**
 * ### Getting Started
 *
 * This guide explains how to create a meeting, add an attendee to that meeting, and use the returned information to join a meeting application to the meeting and send and receive audio. This guide assumes you have:
 * - A meeting service responsible for creating and managing meetings and their attendees.
 * - A meeting application that communicates with the meeting service to receive meeting and attendee information which it uses to join the meeting.
 *
 * #### Meeting Service
 *
 * In your meeting service, create an AWS SDK Chime object. You must currently use
 * `us-east-1` as the region (you can select a MediaRegion in the following step).
 * The following example assumes your meeting service uses the AWS SDK for JavaScript
 * following an async/await pattern and that the Chime object has credentials for a
 * role with a policy that allows
 * [chime:CreateMeeting](https://docs.aws.amazon.com/chime/latest/APIReference/API_CreateMeeting.html) and
 * [chime:CreateAttendee](https://docs.aws.amazon.com/chime/latest/APIReference/API_CreateAttendee.html):
 *
 * ```javascript
 * const uuid = require('uuid/v4');
 * const AWS = require('aws-sdk');
 * const chime = new AWS.Chime({region: 'us-east-1'});
 * ```
 *
 * Create a meeting using the `chime` object:
 *
 * ```javascript
 * const requestId = uuid();
 * const region = 'us-west-2'; // specify media placement region
 * try {
 *   const meeting = await chime.createMeeting({
 *     ClientRequestToken: requestId,
 *     MediaRegion: region,
 *   }).promise();
 * } catch (err) {
 *   // handle error - you can retry with the same requestId
 * }
 * const meetingId = meeting.Meeting.MeetingId; // meeting ID of the new meeting
 * ```
 *
 * Now create an attendee on the meeting:
 *
 * ```javascript
 * const externalUserId = uuid(); // or string ID you want to associate with the user
 * try {
 *   const attendee = await chime.createAttendee({
 *     MeetingId: meetingId,
 *     ExternalUserId: externalUserId,
 *   });
 * } catch (err) {
 *   // handle error - you can retry with the same externalUserId
 * }
 * const attendeeId = attendee.Attendee.AttendeeId // attendee ID of new attendee
 * ```
 *
 * Now securely transfer the `meeting` and `attendee` objects (e.g. in JSON) to your meeting application. These objects contain all the information needed for a
 * meeting application using the Amazon Chime SDK for JavaScript to join the meeting.
 *
 * #### Meeting Application
 *
 * Using the `meeting` and `attendee` objects supplied by the meeting service, create a new logger, device controller, meeting session configuration, and meeting session:
 *
 * ```javascript
 * import {
 *   ConsoleLogger,
 *   DefaultDeviceController,
 *   DefaultMeetingSession,
 *   LogLevel,
 *   MeetingSessionConfiguration,
 * } from 'amazon-chime-sdk-js';
 * const logger = new ConsoleLogger('ChimeMeetingLogs', LogLevel.INFO);
 * const deviceController = new DefaultDeviceController(logger);
 * const configuration = new MeetingSessionConfiguration(meeting, attendee);
 * const meetingSession = new DefaultMeetingSession(configuration, logger, deviceController);
 * ```
 *
 * The meeting session as an audio-video API interface `meetingSession.audioVideo` with most of the control surface you will use for managing the meeting session. See [here](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html) for a list of methods you can use. Now select an audio device. In this example, you will select the first device, which usually represents the system default.
 *
 * ```javascript
 * try {
 *   const audioInputs = await meetingSession.audioVideo.listAudioInputDevices();
 *   await meetingSession.audioVideo.chooseAudioInputDevice(audioInputs[0].deviceId);
 * } catch (err) {
 *   // handle error - unable to acquire audio device perhaps due to permissions blocking
 * }
 * ```
 *
 * To hear audio from remote participants you will need to *bind* to an `<audio>` element on
 * your webpage (it can be hidden with `display:none`).
 *
 * ```javascript
 * const audioOutputElement = document.getElementById('<your-audio-element-id>');
 * meetingSession.audioVideo.bindAudioElement(audioOutputElement);
 * ```
 *
 * Now start the session:
 *
 * ```javascript
 * meetingSession.audioVideo.start();
 * ```
 *
 * At this point if you have two meeting applications with different attendees, they should
 * now be able to hear each other.
 *
 * #### Next Steps
 *
 * - Implement [AudioVideoObserver](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html). Add an instance of the observer using the [addObserver](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#addobserver) method so you can receive events.
 * - Use the `realtime` methods to handle audio control such as muting, unmuting, receiving attendee presence events, and receiving volume indicators for remote participants.
 *
 * [Give feedback on this guide](https://github.com/aws/amazon-chime-sdk-js/issues/new?assignees=&labels=documentation&template=documentation-request.md&title=Getting%20Started%20feedback)
 */
declare namespace GettingStarted { }
/**
 * ### Content Share
 *
 * This guide explains how to share audio and video content such as screen capture or
 * media files in a meeting. This guide assumes you have already created a meeting and
 * added attendees to the meeting (see
 * [Getting Started](https://aws.github.io/amazon-chime-sdk-js/modules/gettingstarted.html)
 * for more information).
 *
 * Content share methods are accessed from the
 * [audio-video facade](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html)
 * belonging to the meeting session.
 *
 * #### Share content
 *
 * Using the audio-video facade, start sharing content by calling
 * [startContentShare](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#startcontentshare)
 * and provide a
 * [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream):
 *
 * ```javascript
 * const meetingSession = // reference to MeetingSession
 * await meetingSession.audioVideo.startContentShare(mediaStream);
 * ```
 *
 * To start a screen capture, call the convenience method
 * [startContentShareFromScreenCapture](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#startcontentsharefromscreencapture).
 *
 * When calling from a browser, leave `sourceId` empty. This will launch the
 * browser's native screen capture picker.
 *
 * ```javascript
 * const meetingSession = // reference to MeetingSession
 * await meetingSession.audioVideo.startContentShareFromScreenCapture();
 * ```
 *
 * When calling from Electron, build a screen capture picker into your application and
 * pass the `sourceId` of the chosen screen capture to the method. See the
 * [desktop-capture](https://github.com/hokein/electron-sample-apps/tree/master/desktop-capture)
 * sample application for more information.
 *
 * ```javascript
 * const meetingSession = // reference to MeetingSession
 * const sourceId = // get this from your custom Electron screen capture picker
 * await meetingSession. audioVideo.startContentShareFromScreenCapture(sourceId);
 * ```
 *
 * #### View the content share
 *
 * Content shares are treated as regular audio-video attendees. The attendee ID of a
 * content share has a suffix of
 * [#content](https://aws.github.io/amazon-chime-sdk-js/enums/contentshareconstants.html#modality).
 * You receive real-time attendee presence and volume indicator callbacks
 * for content audio and video tile updates for content video.
 *
 * To view the content share:
 *
 * - Create an instance of [AudioVideoObserver](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html) that implements [videoTileDidUpdate](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html#videotiledidupdate) to receive callbacks when the video tile is created and updated
 * - Add the observer with [addObserver](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#addobserver) method to receive events.
 * - In `videoTileDidUpdate`, bind the video tile to a video element in your app:
 *
 * ```javascript
 * const meetingSession = // reference to MeetingSession
 * const tileState = // reference to tileState parameter in videoTileDidUpdate
 * const videoElement = document.getElementById('video-element-id');
 * meetingSession.audioVideo.bindVideoElement(tileState.tileId , videoElement);
 * ```
 *
 * Use the
 * [isContent](https://aws.github.io/amazon-chime-sdk-js/classes/videotilestate.html#iscontent)
 * property of the
 * [TileState](https://aws.github.io/amazon-chime-sdk-js/classes/videotilestate.html)
 * to check if the video tile is a content share, and any add special logic you need
 * to handle the content share.
 *
 * You can also use the [Modality](https://aws.github.io/amazon-chime-sdk-js/interfaces/modality.html)
 * class to determine that an attendee ID is a content share:
 *
 * ```javascript
 * if (new DefaultModality(attendeeId).hasModality(DefaultModality.MODALITY_CONTENT)) {
 *   // ...special handling for content share...
 * }
 * ```
 *
 * #### Pause and unpause the content share
 *
 * To pause and unpause the content share, call
 * [pauseContentShare](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#pausecontentshare) and
 * [unpauseContentShare](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#unpausecontentshare).
 *
 * ```javascript
 * const meetingSession = // reference to MeetingSession
 * await meetingSession.audioVideo.pauseContentShare();
 * ````
 *
 * ```javascript
 * const meetingSession = // reference to MeetingSession
 * await meetingSession.audioVideo.unpauseContentShare();
 * ````
 *
 * #### Stop the content share
 *
 * To stop the content share, call
 * [stopContentShare](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#stopcontentshare).
 *
 * ```javascript
 * const meetingSession = // reference to MeetingSession
 * await meetingSession.audioVideo.stopContentShare();
 * ````
 *
 * #### Receive content share events
 *
 * Implement methods from [ContentShareObserver](https://aws.github.io/amazon-chime-sdk-js/interfaces/contentshareobserver.html) and
 * add an instance of the observer using
 * [addContentShareObserver](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#addcontentshareobserver)
 * to receive events.
 *
 * [Give feedback on this guide](https://github.com/aws/amazon-chime-sdk-js/issues/new?assignees=&labels=documentation&template=documentation-request.md&title=Content%20Share%20feedback)
 */
declare namespace ContentShare { }
/**
 * # API Overview
 *
 * This guide gives an overview of the API methods you can use to create meeting with audio and video with a roster of attendees and basic controls. Several additional API methods that may be helpful are also described and marked optional.
 *
 * ## 1. Create a session
 *
 * The [MeetingSession](https://aws.github.io/amazon-chime-sdk-js/interfaces/meetingsession.html) and its [AudioVideoFacade](https://aws.github.io/amazon-chime-sdk-js/interfaces/meetingsession.html#audiovideo) are the starting points for creating meetings. To create a meeting session, you will first need a [Logger](https://aws.github.io/amazon-chime-sdk-js/interfaces/logger.html), [DeviceController](https://aws.github.io/amazon-chime-sdk-js/interfaces/devicecontrollerbasedmediastreambroker.html), and [MeetingSessionConfiguration](https://aws.github.io/amazon-chime-sdk-js/classes/meetingsessionconfiguration.html). The subsequent sections assume that you have created these four things.
 *
 * ### 1a. Create a logger
 *
 * Create a [ConsoleLogger](https://aws.github.io/amazon-chime-sdk-js/classes/consolelogger.html) to log everything to the browser console. You can also implement the [Logger](https://aws.github.io/amazon-chime-sdk-js/interfaces/logger.html) interface to customize logging behavior.
 *
 * ```
 * const logger = new ConsoleLogger('MeetingLogs', LogLevel.INFO);
 * ```
 *
 * ### 1b. Create a device controller
 *
 * Create a [DefaultDeviceController](https://aws.github.io/amazon-chime-sdk-js/classes/defaultdevicecontroller.html#constructor) and pass in the Logger you created. This object allows you to enumerate and select audio and video devices and control some of their features, even before the meeting session has been created.
 *
 * ```
 * const deviceController = new DefaultDeviceController(logger);
 * ```
 *
 * ### 1c. Create a meeting session configuration
 *
 * Create a [MeetingSessionConfiguration](https://aws.github.io/amazon-chime-sdk-js/classes/meetingsessionconfiguration.html#constructor) object with the responses to [chime:CreateMeeting](https://docs.aws.amazon.com/chime/latest/APIReference/API_CreateMeeting.html) and [chime:CreateAttendee](https://docs.aws.amazon.com/chime/latest/APIReference/API_CreateAttendee.html). Your server application should make these API calls and securely pass the meeting and attendee responses to the browser client application.
 *
 * ```
 * const configuration = new MeetingSessionConfiguration(meetingResponse, attendeeResponse);
 * ```
 *
 * ### 1d. Create a meeting session
 *
 * Using the above objects, create a [DefaultMeetingSession](https://aws.github.io/amazon-chime-sdk-js/classes/defaultmeetingsession.html#constructor).
 *
 * ```
 * const meetingSession = new DefaultMeetingSession(configuration, logger, deviceController);
 * ```
 *
 * ## 2. Configure the session
 *
 * Before starting the meeting session, you should configure audio and video devices. By default, no devices are selected.
 *
 * ### 2a. Configure the device label trigger (optional)
 *
 * When obtaining devices to configure, the browser may initially decline to provide device labels due to privacy restrictions. However, without device labels the application user will not be able to select devices by name. When no labels are present, the device-label trigger is run. The default implementation of the device-label trigger requests permission to the mic and camera. If the user grants permission, the device labels will become available.
 *
 * You can override the behavior of the device-label trigger by calling meetingSession.audioVideo.[setDeviceLabelTrigger(trigger)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#setdevicelabeltrigger).
 *
 * ### 2b. Register a device-change observer (optional)
 *
 * You can receive events about changes to available devices by implementing a [DeviceChangeObserver](https://aws.github.io/amazon-chime-sdk-js/interfaces/devicechangeobserver.html) and registering the observer with the device controller.
 *
 * To add a DeviceChangeObserver, call deviceController.[addDeviceChangeObserver(observer)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#adddevicechangeobserver).
 *
 * To remove a DeviceChangeObserver, call deviceController.[removeDeviceChangeObserver(observer)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#removedevicechangeobserver).
 *
 * You can implement the following callbacks:
 *
 * * [audioInputsChanged](https://aws.github.io/amazon-chime-sdk-js/interfaces/devicechangeobserver.html#audioinputschanged): occurs when audio inputs are changed
 * * [audioOutputsChanged](https://aws.github.io/amazon-chime-sdk-js/interfaces/devicechangeobserver.html#audiooutputschanged): occurs when audio outputs are changed
 * * [videoInputsChanged](https://aws.github.io/amazon-chime-sdk-js/interfaces/devicechangeobserver.html#videoinputschanged): occurs when video inputs are changed
 *
 * ### 2c. Configure the audio input device
 *
 * To send audio to the remote attendees, list the available audio input devices and choose an input to use.
 *
 * To retrieve a list of available audio input devices, call meetingSession.audioVideo.[listAudioInputDevices()](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#listaudioinputdevices).
 *
 * To use the chosen audio input device, call meetingSession.audioVideo.[chooseAudioInputDevice(device)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#chooseaudioinputdevice).
 *
 * ### 2d. Preview microphone volume levels (optional)
 *
 * You can create a WebAudio [AnalyserNode](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode) from the current audio input to generate a display such as a mic indicator. This is useful for allowing attendees to preview their microphone volume level prior to joining the meeting.
 *
 * To create the AnalyserNode, call meetingSession.audioVideo.[createAnalyserNodeForAudioInput()](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#createanalysernodeforaudioinput).
 *
 * ### 2e. Configure the audio output device (optional)
 *
 * On browsers that [support setSinkId](https://caniuse.com/#search=setSinkId), you can optionally list the available audio output devices and choose one to use.
 *
 * To retrieve a list of available audio output devices, call meetingSession.audioVideo.[listAudioOutputDevices()](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#listaudiooutputdevices).
 *
 * To use the chosen audio output device, call meetingSession.audioVideo.[chooseAudioOutputDevice(deviceId)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#chooseaudiooutputdevice).
 *
 * ### 2f. Bind the audio output to an audio element
 *
 * To hear audio from the remote attendees, bind the audio output device to an HTMLAudioElement in the DOM. The element does not need to be visible; you can hide it with CSS style `display: none`.
 *
 * To bind the chosen audio output device to a HTMLAudioElement, call meetingSession.audioVideo.[bindAudioElement(element)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#bindaudioelement).
 *
 * To unbind the chosen audio output device, call meetingSession.audioVideo.[unbindAudioElement()](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#unbindaudioelement).
 *
 * ### 2g. Configure the video input device
 *
 * To send video to remote attendees, list the available video input devices, optionally select video quality settings, and choose a device to use.
 *
 * To get a list of available video input devices, call meetingSession.audioVideo.[listVideoInputDevices()](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#listvideoinputdevices).
 *
 * You can configure the quality of the video that is sent to the remote attendees by calling meetingSession.audioVideo.[chooseVideoInputQuality(width, height, frameRate, maxBandwidthKbps)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#choosevideoinputquality). The changes take effect the next time a video input device is chosen. The default quality is 960x540 @ 15 fps with a maximum uplink bandwidth of 1400 kbps. The maximum supported quality settings are 1280x720 @ 30 fps with a maximum uplink bandwidth of 2400 Kbps. Actual quality achieved may vary throughout the call depending on what the device, system, and network can provide.
 *
 * To use the chosen video input device, call meetingSession.audioVideo.[chooseVideoInputDevice(device)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#choosevideoinputdevice).
 *
 * ### 2h. Preview local camera in a video element (optional)
 *
 * Before the session is started, you can start a preview of the video in an HTMLVideoElement in the DOM.
 *
 * To start video preview, call meetingSession.audioVideo.[startVideoPreviewForVideoInput(element)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#choosevideoinputdevice).
 *
 * To stop video preview, call meetingSession.audioVideo.[stopVideoPreviewForVideoInput(element)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#stopvideopreviewforvideoinput).
 *
 * ## 3. Register an audio-video observer
 *
 * You can receive audio and video events by implementing the [AudioVideoObserver](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html) interface and registering the observer with the meeting session.
 *
 * To add an AudioVideoObserver, call meetingSession.audioVideo.[addObserver(observer)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#addobserver).
 *
 * To remove an AudioVideoObserver, call meetingSession.audioVideo.[removeObserver(observer)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#removeobserver).
 *
 * You should implement the following key observer callbacks:
 *
 * * [audioVideoDidStart](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html#audiovideodidstart): occurs when the audio-video session finishes connecting
 * * [audioVideoDidStartConnecting](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html#audiovideodidstartconnecting): occurs when the audio-video session is in the process of connecting or reconnecting
 * * [audioVideoDidStop](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html#audiovideodidstop): occurs when the audio-video session has disconnected. Use the provided [MeetingSessionStatus](https://aws.github.io/amazon-chime-sdk-js/classes/meetingsessionstatus.html) to determine why the session disconnected.
 * * [videoTileDidUpdate](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html#videotiledidupdate): occurs when either a video stream is started or updated. Use the provided VideoTileState to determine the tile ID and the attendee ID of the video stream.
 * * [videoTileWasRemoved](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html#videotilewasremoved): occurs when a video stream stops and the reference to the tile (the tile ID) is deleted
 * * [videoAvailabilityDidChange](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html#videoavailabilitydidchange): occurs video availability state has changed such as whether the attendee can start local video or whether remote video is available. See [MeetingSessionVideoAvailability](https://aws.github.io/amazon-chime-sdk-js/classes/meetingsessionvideoavailability.html) for more information.
 * * [videoSendDidBecomeUnavailable](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html#videosenddidbecomeunavailable): occurs when attendee tries to start video but the maximum video limit of 16 tiles has already been reached by other attendees sharing their video
 *
 * You may optionally listen to the following callbacks to monitor aspects of connection health:
 *
 * * [connectionDidBecomePoor](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html#connectiondidbecomepoor): occurs when the connection has been poor for a while
 * * [connectionDidSuggestStopVideo](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html#connectiondidsuggeststopvideo): occurs when the connection has been poor while using video. You can use this to prompt the attendee to turn off video.
 * * [connectionHealthDidChange](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html#connectionhealthdidchange): occurs when connection health has changed
 * * [estimatedDownlinkBandwidthLessThanRequired](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html#estimateddownlinkbandwidthlessthanrequired): occurs when the total downlink video bandwidth estimation is less than the required video bitrate
 * * [metricsDidReceive](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html#metricsdidreceive): occurs periodically when WebRTC media stats are available
 * * [videoNotReceivingEnoughData](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html#videonotreceivingenoughdata): occurs when one or more remote video streams do not meet the expected average bitrate
 * * [videoReceiveBandwidthDidChange](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html#videoreceivebandwidthdidchange): occurs when the available video receive bandwidth changed
 * * [videoSendBandwidthDidChange](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html#videosendbandwidthdidchange): occurs when available video send bandwidth changed
 * * [videoSendHealthDidChange](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html#videosendhealthdidchange): occurs when the actual video send bitrate or packets-per-second changes
 *
 * ## 4. Start and stop the session
 *
 * Call this API after doing pre-requisite configuration (See previous sections). Otherwise, there will not be working audio and video.
 *
 * To start the meeting session, call meetingSession.audioVideo.[start()](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#start). This method will initialize all underlying components, set up connections, and immediately start sending and receiving audio.
 *
 * To stop the meeting session, call meetingSession.audioVideo.[stop()](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#stop).
 *
 * The `stop()` method does not clean up observers. You can start and stop a session multiple times using the same observers. In other words observers are not tied to the lifecycle of the session.
 *
 * ## 5. Build a roster of participants using the real-time API
 *
 * Use the following methods to learn when attendees join and leave and when their volume level, mute state, or signal strength changes.
 *
 * When implementing a real-time callback, you must ensure that it never throws an exception. To preserve privacy, uncaught exceptions inside a real-time callback are treated as fatal: the session is disconnected immediately. The cautions around real-time callbacks do not apply to the observers. For example, uncaught exceptions are not fatal to observers (though they should be avoided).
 *
 * Real-time volume indicator callbacks are called at a rate of 5 updates per second. Ensure that your application is able to smoothly render these updates to avoid causing unnecessary CPU load that could degrade the meeting experience.
 *
 * *If you are using Angular*, ensure that all calls to the SDK are run outside of the Angular zone. Otherwise, the real-time messages received via the signaling channel and their real-time callbacks may cause the DOM to thrash with updates and degrade performance.
 *
 * ### 5a. Subscribe to attendee presence changes
 *
 * To learn when attendees join or leave, subscribe to the attendee ID presence changes. The callback provides both the attendee ID and external user ID from [chime:CreateAttendee](https://docs.aws.amazon.com/chime/latest/APIReference/API_CreateAttendee.html) so that you may map between the two IDs.
 *
 * To subscribe to attendee presence changes, call meetingSession.audioVideo.[realtimeSubscribeToAttendeeIdPresence(callback)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#realtimesubscribetoattendeeidpresence).
 *
 * To unsubscribe to attendee presence changes, call meetingSession.audioVideo.[realtimeUnsubscribeToAttendeeIdPresence(callback)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#realtimeunsubscribetoattendeeidpresence).
 *
 * ### 5b. Subscribe to volume indicators
 *
 * To show speaker volume, mute state, and signal strength for each attendee, subscribe to volume indicators for each attendee ID. You should subscribe and unsubscribe to attendee volume indicators as part of the attendee ID presence callback.
 *
 * Volume is on a scale of 0 to 1 (no volume to max volume). Signal strength is on a scale of 0 to 1 (full packet loss to no packet loss). You can use the signal strength of remote attendees to show an indication of whether an attendee is experiencing packet loss and thus may be unable to communicate at the moment.
 *
 * To subscribe to an attendee’s volume indicator, call meetingSession.audioVideo.[realtimeSubscribeToVolumeIndicator(attendeeId, callback)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#realtimesubscribetovolumeindicator).
 *
 * To unsubscribe from an attendee’s volume indicator, call meetingSession.audioVideo.[realtimeUnsubscribeFromVolumeIndicator(attendeeId)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#realtimeunsubscribefromvolumeindicator).
 *
 * ### 5c. Signal strength change (optional)
 *
 * To subscribe to the local attendee’s signal strength changes, call meetingSession.audioVideo.[realtimeSubscribeToLocalSignalStrengthChange(callback)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#realtimesubscribetolocalsignalstrengthchange).
 *
 * To unsubscribe from the local attendee’s signal strength changes, call meetingSession.audioVideo.[realtimeUnsubscribeToLocalSignalStrengthChange(callback)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#realtimeunsubscribetolocalsignalstrengthchange).
 *
 * ### 5d. Subscribe to an active-speaker detector (optional)
 *
 * If you are interested in detecting the active speaker (e.g. to display the active speaker’s video as a large, central tile), subscribe to the active-speaker detector with an active speaker policy such as the [DefaultActiveSpeakerPolicy](https://aws.github.io/amazon-chime-sdk-js/classes/defaultactivespeakerpolicy.html). You can receive updates when the list of active speakers changes. The list is ordered most active to least active. Active speaker policies use volume indicator changes to determine the prominence of each speaker over time.
 *
 * `DefaultActiveSpeakerPolicy` algorithm works as follows: as you speak, your active speaker score rises and simultaneously decreases the score of others. There are some adjustable weightings in the constructor to control how reactive it is. In general, the defaults do a reasonable job of identifying the active speaker, preventing short noises or interjections from switching the active speaker, but also allowing take over to be relatively quick.
 *
 * To subscribe to active speaker updates, call meetingSession.audioVideo.[subscribeToActiveSpeakerDetector(policy, callback)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#subscribetoactivespeakerdetector).
 *
 * To unsubscribe from active speaker updates, call meetingSession.audioVideo.[unsubscribeFromActiveSpeakerDetector(callback)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#unsubscribefromactivespeakerdetector).
 *
 * ## 6. Mute and unmute microphone audio with the real-time API
 *
 * Use the below real-time API methods to mute and unmute microphone audio. Mute is effective immediately and applied locally; no audio from the microphone will be transmitted to the server when muted.
 *
 * When implementing a real-time callback, you must ensure that it never throws an exception. To preserve privacy, uncaught exceptions inside a real-time callback are treated as fatal: the session is disconnected immediately.
 *
 * To ensure that attendee privacy is respected, pay close attention that the UI controls for mute are implemented properly with as direct a path possible to the mute and unmute methods. Use the real-time API to determine the current state of mute rather than keeping track of mute state yourself.
 *
 * ### 6a. Mute and unmute audio
 *
 * To mute the local attendee’s audio, call meetingSession.audioVideo.[realtimeMuteLocalAudio()](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#realtimemutelocalaudio).
 *
 * To unmute the local attendee’s audio, call meetingSession.audioVideo.[realtimeUnmuteLocalAudio()](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#realtimeunmutelocalaudio).
 *
 * To determine if the local attendee’s audio is muted, call meetingSession.audioVideo.[realtimeIsLocalAudioMuted()](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#realtimeislocalaudiomuted).
 *
 * To subscribe to changes in the local attendee’s audio mute state, call meetingSession.audioVideo.[realtimeSubscribeToMuteAndUnmuteLocalAudio(callback)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#realtimesubscribetomuteandunmutelocalaudio).
 *
 * To unsubscribe from changes in the local attendee’s audio mute state, call meetingSession.audioVideo.[realtimeUnsubscribeToMuteAndUnmuteLocalAudio(callback)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#realtimeunsubscribetomuteandunmutelocalaudio).
 *
 * ### 6b. Prevent a local attendee from unmuting audio (optional)
 *
 * Depending on the type of meeting application you are building, you may want to temporarily prevent the local attendee from unmuting (e.g. to avoid disruption if someone is presenting). If so, use the methods below rather than keeping track of your own can-unmute state.
 *
 * To set whether or not the local attendee can unmute, call meetingSession.audioVideo.[realtimeSetCanUnmuteLocalAudio(canUnmute)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#realtimesetcanunmutelocalaudio).
 *
 * To determine whether or not the local attendee can unmute, call meetingSession.audioVideo.[realtimeCanUnmuteLocalAudio()](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#realtimecanunmutelocalaudio).
 *
 * To subscribe to changes in whether or not the local attendee can unmute, call meetingSession.audioVideo.[realtimeSubscribeToSetCanUnmuteLocalAudio(callback)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#realtimesubscribetosetcanunmutelocalaudio).
 *
 * To unsubscribe from changes in whether or not the local attendee can unmute, call meetingSession.audioVideo.[realtimeUnsubscribeToSetCanUnmuteLocalAudio(callback)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#realtimeunsubscribetosetcanunmutelocalaudio).
 *
 * ## 7. Share and display video
 *
 * A video tile is a binding of four key things: a tile ID, an attendee ID, that attendee’s video stream, and an HTMLVideoElement in the DOM. If all those things are present, the video tile is said to be active, and the video element displays video.
 *
 * Local video is automatically displayed horizontally-mirrored by convention.
 *
 * ### 7a. Share local video
 *
 * After choosing the video input and starting the meeting session, you can share the local attendee’s video with remote attendees.
 *
 * To start sharing video with others, call meetingSession.audioVideo.[startLocalVideoTile()](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#startlocalvideotile).
 *
 * To stop sharing video with others, call meetingSession.audioVideo.[stopLocalVideoTile()](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#stoplocalvideotile).
 *
 * ### 7b. Display local and remote video
 *
 * You are responsible for maintaining HTMLVideoElement objects in the DOM and arranging their layout within the web page. To display a video, you must handle the [videoTileDidUpdate](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html#videotiledidupdate) and [videoTileWasRemoved](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html#videotilewasremoved) callbacks in an [AudioVideoObserver](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html). In the implementation of [videoTileDidUpdate](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html#videotiledidupdate), bind the tile ID from the provided VideoTileState with the HTMLVideoElement in your DOM by calling meetingSession.audioVideo.[bindVideoElement(tileId, videoElement)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#bindvideoelement).
 *
 * To unbind a tile, call meetingSession.audioVideo.[unbindVideoElement(tileId)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#unbindvideoelement).
 *
 * A `tileId` is a unique identifier representing a video stream. When you stop and start, it generates a new `tileId`. You can have tileIds exceeding 16; they merely identify a particular stream uniquely. When you start video it consumes a video publishing slot, when you stop video it releases that video publishing slot. Pausing does not affect video publishing slots; it allows a remote to choose to not receive a video stream (and thus not consume bandwidth and CPU for that stream).
 *
 * ### 7c. Pause and unpause video (optional)
 *
 * Video tiles may be paused individually. The server will not send paused video streams to the attendee requesting the pause. Pausing video does not affect remote attendees.
 *
 * To pause video, call meetingSession.audioVideo.[pauseVideoTile(tileId)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#pausevideotile).
 *
 * To resume a paused video, call meetingSession.audioVideo.[unpauseVideoTile(tileId)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#unpausevideotile).
 *
 * ### 7d. Find video tiles (optional)
 *
 * Aside from the [videoTileDidUpdate](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html#videotiledidupdate) and [videoTileWasRemoved](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html#videotilewasremoved) callbacks in an [AudioVideoObserver](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideoobserver.html), video tile information can be gathered from the following methods.
 *
 * To get all video tiles, call meetingSession.audioVideo.[getAllVideoTiles()](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#getallvideotiles).
 *
 * To get all remote attendees’ video tiles, call meetingSession.audioVideo.[getAllRemoteVideoTiles()](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#getallremotevideotiles).
 *
 * To get the local attendee’s video tile, call meetingSession.audioVideo.[getLocalVideoTile()](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#getlocalvideotile).
 *
 * To get a video tile, call meetingSession.audioVideo.[getVideoTile(tileId)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#getvideotile).
 *
 * ## 8. Share screen and other content (optional)
 *
 * You can share any [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream), such as from a screen capture or media file, as the content share for an attendee. When a content share is started, another attendee with the attendee ID `<attendee-id>#content` joins the meeting. The content audio and video appears like a regular attendee. You can subscribe to its volume indicator to show it in the roster and bind its video tile to a video element the same as you would for a regular attendee.
 *
 * Each attendee can share one content share in addition to their main mic and camera. Each meeting may have two simultaneous content shares. Content share does not count towards the max video tile limit. There may be up to two content shares irrespective of how many attendees are sharing their camera.
 *
 * ### 8a. Start and stop the content share
 *
 * To start the content share, call meetingSession.audioVideo.[startContentShare(stream)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#startcontentshare).
 *
 * To start sharing screen as a content share, call meetingSession.audioVideo.[startContentShareFromScreenCapture(sourceId)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#startcontentsharefromscreencapture).
 *
 * To stop the content share, call meetingSession.audioVideo.[stopContentShare()](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#stopcontentshare).
 *
 * To pause content share, call meetingSession.audioVideo.[pauseContentShare()](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#pausecontentshare).
 *
 * To resume content share, call meetingSession.audioVideo.[unpauseContentShare()](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#unpausecontentshare).
 *
 * ### 8b. Register a content share observer
 *
 * You can receive events about the content share by implementing a [ContentShareObserver](https://aws.github.io/amazon-chime-sdk-js/interfaces/contentshareobserver.html) and adding the observer to the meeting session.
 *
 * To add a ContentShareObserver, call meetingSession.audioVideo.[addContentShareObserver(observer)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#addcontentshareobserver).
 *
 * To remove a ContentShareObserver, call meetingSession.audioVideo.[removeContentShareObserver(observer)](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#removecontentshareobserver).
 *
 * You can implement the following callbacks:
 *
 * * [contentShareDidStart](https://aws.github.io/amazon-chime-sdk-js/interfaces/contentshareobserver.html#contentsharedidstart): occurs when a content share session is started
 * * [contentShareDidStop](https://aws.github.io/amazon-chime-sdk-js/interfaces/contentshareobserver.html#contentsharedidstop): occurs when a content share session is stopped
 * * [contentShareDidPause](https://aws.github.io/amazon-chime-sdk-js/interfaces/contentshareobserver.html#contentsharedidpause): occurs when a content share session is paused
 * * [contentShareDidUnpause](https://aws.github.io/amazon-chime-sdk-js/interfaces/contentshareobserver.html#contentsharedidunpause): occurs when a content share session is resumed
 *
 * ## 9. Send and receive data messages (optional)
 *
 * Attendees can broadcast small (2KB max) data messages to other attendees. Data messages can be used to signal attendees of changes to meeting state or develop custom collaborative features. Each message is sent on a particular topic, which allows you to tag messages according to their function to make it easier to handle messages of different types.
 *
 * To send a message on a given topic, call meetingSession.audioVideo.[realtimeSendDataMessage()](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#realtimesenddatamessage). When sending a message if you specify a lifetime, then the media server stores the messages for the lifetime. Up to 1024 messages may be stored for a maximum of 5 minutes. Any attendee joining late or reconnecting will automatically receive the messages in this buffer once they connect. You can use this feature to help paper over gaps in connectivity or give attendees some context into messages that were recently received.
 *
 * To receive messages on a given topic, set up a handler using the meetingSession.audioVideo.[realtimeSubscribeToReceiveDataMessage()](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#realtimesubscribetoreceivedatamessage). In the handler, you receive a [DataMessage](https://aws.github.io/amazon-chime-sdk-js/classes/datamessage.html) containing the payload of the message and other metadata about the message.
 *
 * To unsubscribe the receive message handler, call meetingSession.audioVideo.[realtimeUnsubscribeFromReceiveDataMessage()](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#realtimeunsubscribefromreceivedatamessage).
 *
 * If you send too many messages at once, your messages may be returned to you with the [throttled](https://aws.github.io/amazon-chime-sdk-js/classes/datamessage.html#throttled) flag set. If you continue to exceed the throttle limit, then the server may hang up the connection.
 *
 * **Note:** Take care when using data messages for functionality involving *asymmetric permissions* (e.g. a moderator attendee sending a message to regular attendees). Any attendee may, in theory, send any message on any topic. You should always confirm that the message's [senderAttendeeId](https://aws.github.io/amazon-chime-sdk-js/classes/datamessage.html#senderattendeeid) belongs to an attendee that is allowed to send that type of message, and your handler should tolerate messages that are not serialized in the format you are expecting.
 *
 * [Give feedback on this guide](https://github.com/aws/amazon-chime-sdk-js/issues/new?assignees=&labels=documentation&template=documentation-request.md&title=API%20Overview%20feedback)
 */
declare namespace APIOverview { }
/**
 *
 *
 * # Quality, Bandwidth, and Connectivity
 *
 * The Amazon Chime SDK for JavaScript, in conjunction with WebRTC, allows you to configure quality and bandwidth options for meeting sessions. It provides both automatic and manual controls to adapt to changing network conditions. Finding the right balance of quality and performance can be challenging when either the client's network or CPU is constrained. As network reliability and available bandwidth decrease, quality and functionality trade-offs must be made in real time to preserve the viability of the meeting. This guide gives an overview of challenges associated with devices and networks, degradation detection mechanisms, and mitigations for various levels of degradation.
 *
 * ## Goals
 *
 * When designing an application that shares audio and video you should determine which functionality is most important to your end users. Just as responsive web design allows a single web application to adapt to changing screen sizes, the audio-video component of your application can also be responsive to changing device and network conditions. For example, in a collaborative meeting it may be acceptable to gracefully degrade to an audio-only experience. However, in a presentation where the screen is shared, the presenter audio and screen share video may be the most important.
 *
 * ## Challenges
 *
 * To join an Amazon Chime SDK meeting, each client traverses the public internet to connect to the media services for that meeting which are hosted by the [AWS Global Infrastructure](https://aws.amazon.com/about-aws/global-infrastructure/) in one of the available SDK media regions. The following key factors influence the client experience:
 *
 * - **Application performance:** if your client application is consuming a lot of CPU, then it may hinder the device from simultaneously processing media and transmitting and receiving network packets.
 * - **Client device performance:** transcoding audio and video in real-time is CPU intensive and may both decrease performance and further constrain the device's network adapter. Browsers may or may not support hardware acceleration depending on the codec profile and device hardware. Furthermore, browsers do not allow you to directly monitor CPU usage, so it can be difficult to tell whether CPU consumption is a factor in performance issues for your end-user devices.
 * - **Differences in uplink and downlink:** In order for an attendee to send audio or video to a remote attendee, both the sender's uplink and the receiver's downlink must have enough bandwidth. However, most end users will be on a network that has more downlink (receiving) bandwidth than uplink (sending) bandwidth. It can be challenging to determine whether a drop in quality is due to constraints of the sender, the receiver, or both.
 * - **Last mile network connectivity:** issues with WiFi, local area network, or the internet service provider may limit the effective bandwidth due to packet loss, bandwidth caps, or other hardware limitations.
 * - **Complexity and length of the network path:** meeting attendees that are geographically distant from the SDK media region may experience higher packet loss, jitter, and round-trip times due to the number of intermediate networks, which may vary in quality.
 *
 * ## Detection Mechanisms
 * The Amazon Chime SDK for JavaScript produces several kinds of events on the [AudioVideoObserver](https://github.com/aws/amazon-chime-sdk-js/blob/48e1d3842f7bd72a2110659155e4c8df0bce7628/src/audiovideoobserver/AudioVideoObserver.ts) to monitor connectivity and quality. Use the following events and key health metrics to monitor the performance of the meeting session in real time. For code snippets showing how to subscribe to these events, see [Monitoring and Alerts](https://github.com/aws/amazon-chime-sdk-js#monitoring-and-alerts).
 *
 * *Metrics derived from WebRTC stats are not guaranteed to be present in all browsers. In such cases the value may be missing.*
 *
 * *For the browser support columns below, "All" refers to the browsers officially supported by the Chime SDK.*
 *
 * ### Events for monitoring local attendee uplink
 *
 * |Event | Notes | Browsers |
 * |------------ | ------------- | ------------- |
 * |[videoSendHealthDidChange](https://github.com/aws/amazon-chime-sdk-js/blob/bf6d01e236445684601e24f3e319dede728b5113/src/audiovideoobserver/AudioVideoObserver.ts#L48) | Indicates the current average upstream video bitrate being utilized| Chromium-based |
 * |[videoSendBandwidthDidChange](https://github.com/aws/amazon-chime-sdk-js/blob/bf6d01e236445684601e24f3e319dede728b5113/src/audiovideoobserver/AudioVideoObserver.ts#L53) | Indicates the estimated amount of upstream bandwidth| Chromium-based |
 *
 * ### Events for monitoring local attendee downlink
 *
 * |Event | Notes | Browsers |
 * |------------ | ------------- | ------------- |
 * |[connectionDidSuggestStopVideo](https://github.com/aws/amazon-chime-sdk-js/blob/master/src/audiovideoobserver/AudioVideoObserver.ts#L92) | Indicates that the audio connection is experiencing packet loss. Stopping local video and pausing remote video tiles may help the connection recover by reducing CPU usage and network consumption. | All |
 * |[connectionDidBecomeGood](https://github.com/aws/amazon-chime-sdk-js/blob/master/src/audiovideoobserver/AudioVideoObserver.ts#L98) | Indicates that the audio connection has improved. | All |
 * |[connectionDidBecomePoor](https://github.com/aws/amazon-chime-sdk-js/blob/48e1d3842f7bd72a2110659155e4c8df0bce7628/src/audiovideoobserver/AudioVideoObserver.ts#L86) | Similar to the previous metric, but is fired when local video is already turned off. | All |
 * |[videoNotReceivingEnoughData](https://github.com/aws/amazon-chime-sdk-js/blob/master/src/audiovideoobserver/AudioVideoObserver.ts#L71) | Called when one or more remote attendee video streams do not meet the expected average bitrate which may be due to downlink packet loss. | All |
 * |[estimatedDownlinkBandwidthLessThanRequired](https://github.com/aws/amazon-chime-sdk-js/blob/bf6d01e236445684601e24f3e319dede728b5113/src/audiovideoobserver/AudioVideoObserver.ts#L63) | Aggregated across all attendees, this event fires when more bandwidth is requested than what the WebRTC estimated downlink bandwidth supports. It is recommended to use this event over [videoNotReceivingEnoughData](https://github.com/aws/amazon-chime-sdk-js/blob/master/src/audiovideoobserver/AudioVideoObserver.ts#L71). | Chromium-based |
 * |[videoReceiveBandwidthDidChange](https://github.com/aws/amazon-chime-sdk-js/blob/bf6d01e236445684601e24f3e319dede728b5113/src/audiovideoobserver/AudioVideoObserver.ts#L58) | This is the estimated amount of downstream bandwidth | Chromium-based |
 *
 * ### Events for monitoring remote attendee uplink
 *
 * |Event | Notes | Browsers |
 * |------------ | ------------- | ------------- |
 * |[realtimeSubscribeToVolumeIndicator](https://github.com/aws/amazon-chime-sdk-js/blob/2fd1027ecf23ac67421078293337d1788bbbf6c8/src/audiovideofacade/DefaultAudioVideoFacade.ts#L220) | The `signalStrength` field indicates whether the server is receiving the remote attendee's audio. A value of 1 indicates a good connection, a value of 0.5 or 0 indicates some or total packet loss. Since each attendee receives the signal strength for all attendees, this event can be used to monitor the ability of attendees to share their audio in real-time. | All |
 *
 * ### Metrics exposed directly from the WebRTC peer connection
 *
 * |Event| Notes | Browsers |
 * |------------ | ------------- | ------------- |
 * |[metricsDidReceive](https://github.com/aws/amazon-chime-sdk-js/blob/bf6d01e236445684601e24f3e319dede728b5113/src/audiovideoobserver/AudioVideoObserver.ts#L76) | Exposes the WebRTC getStats metrics. There may be differences among browsers as to which metrics are reported. | All |
 *
 * ## Mitigations
 *
 * ### Automatic mitigations
 *
 * WebRTC will automatically reduce video frame rate, resolution, and bandwidth if it detects that it is unable to send video at the specified rate due to bandwidth or CPU.
 *
 * ### Mitigations to conserve CPU
 *
 * #### Application profiling
 * Use the browser's built-in developer tools to profile your application and determine whether there are any hotspots. When handling real-time events (prefixed with `realtime`) ensure that you are doing as little processing as possible. See the [API Overview section on building a roster](https://aws.github.io/amazon-chime-sdk-js/modules/apioverview.html#5-build-a-roster-of-participants-using-the-real-time-api) for more information. In particular, look out for expensive DOM updates (such as when manipulating the roster or video tile layout).
 *
 * When possible, profile on devices that have similar performance characteristics to the ones you expect to be used by your end users.
 *
 * #### Choose a lower local video quality
 *
 * Sometimes it is better to sacrifice video quality in order to prioritize audio. You can call [chooseVideoInputQuality](https://github.com/aws/amazon-chime-sdk-js/blob/2fd1027ecf23ac67421078293337d1788bbbf6c8/src/audiovideofacade/DefaultAudioVideoFacade.ts#L372)(width, height, frameRate, maxBandwidthKbps) and lower the maximum bandwidth in real-time. You can also adjust the resolution and frame rate if you call the method before starting local video (or stop and then restart the local video). See the section below on values you can use for `chooseVideoInputQuality`.
 *
 * #### Pause remote videos
 *
 * Calling [pauseVideoTile](https://aws.github.io/amazon-chime-sdk-js/interfaces/audiovideofacade.html#pausevideotile)  on remote video tiles will reduce the amount of CPU consumed due to decoding remote attendee video.
 *
 * ### Mitigations to conserve bandwidth
 *
 * In the absence of packet loss, keep in mind that the sender uplink and receiver downlink consume the same bandwidth for each video tile. Mitigations affecting one sender's uplink can benefit all receiver's downlinks. This means that in order to help receiver's, sometimes the best course of action is to lower the bandwidth consumed by the sender.
 *
 * ####  Adjust local video quality
 *
 * You can choose a video quality of up to 1280x720 (720p) at 30 fps and 2500 Kbps using [chooseVideoInputQuality](https://github.com/aws/amazon-chime-sdk-js/blob/2fd1027ecf23ac67421078293337d1788bbbf6c8/src/audiovideofacade/DefaultAudioVideoFacade.ts#L372)(width, height, frameRate, maxBandwidthKbps) API before the meeting session begins. However, in some cases it is not necessary to send the highest quality and you can use a lower values. For example, if the size of the video tile is small then the highest quality may not be worth the additional bandwidth and CPU overhead.
 *
 * The default resolution in the SDK is 540p at 15 fps and 1400 Kbps. Lower resolutions can be set if you anticipate a low bandwidth situation. Browser and codec support for very low resolutions may vary.
 *
 * The value `maxBandwidthKbps` is a recommendation you make to WebRTC to use as the upper limit for upstream sending bandwidth. The Chime SDK default is 1400 Kbps for this value. The following table provides recommendations of minimum and maximum bandwidth value per resolution for typical video-conferencing scenarios. Note that when low values are selected the video can be appear pixelated. Using 15 fps instead of 30 fps will substantially decrease the required bit rate and may be acceptable for low-motion content.
 *
 * | Resolution | Frame Rate Per Sec | Min Kbps | Max Kbps |
 * | ------------ | ------------- | ------------- | ------------- |
 * | 180p | 30 | 100 | 250 |
 * | 360p | 30 | 250 | 800 |
 * | 480p | 30 | 400 | 1500 |
 * | 540p | 30 | 500 | 2000 |
 * | 720p | 30 | 1400 | 2500 |
 *
 * Setting a frame rate below 15 is not recommend and will cause the video to appear jerky and will not significantly improve the bandwidth consumed since key frames will still be sent occasionally. It would be better to adjust the resolution than set a very low frame rate.
 *
 * #### Turning off local video
 *
 * In some situations it may be best to turn off the local video tile to improve audio uplink, CPU consumption, or remote attendee downlink.
 *
 * You can also observe the [connectionDidSuggestStopVideo](https://github.com/aws/amazon-chime-sdk-js/blob/master/src/audiovideoobserver/AudioVideoObserver.ts#L92) event to monitor audio packet loss and use that as a cue to turn off local video using [stopLocalVideoTile](https://github.com/aws/amazon-chime-sdk-js/blob/2fd1027ecf23ac67421078293337d1788bbbf6c8/src/audiovideofacade/DefaultAudioVideoFacade.ts#L82).
 *
 * #### Configure a video uplink policy
 *
 * The SDK by default uses the [NScaleVideoUplinkBandwidthPolicy](https://github.com/aws/amazon-chime-sdk-js/blob/master/src/videouplinkbandwidthpolicy/NScaleVideoUplinkBandwidthPolicy.ts) which monitors number of participants in the meeting and automatically scales down the maxBandwidthKbps as the number of remote video tiles increases. This can be customized by implementing a [VideoUplinkBandwidth Policy](https://github.com/aws/amazon-chime-sdk-js/blob/d658830a1f1d151c12a9fb89e371984bea3f9ebf/src/meetingsession/MeetingSessionConfiguration.ts#L80) and setting it in the [MeetingSessionConfiguration](https://aws.github.io/amazon-chime-sdk-js/classes/meetingsessionconfiguration.html#videouplinkbandwidthpolicy) class.
 *
 * #### Pause remote attendee video
 *
 * When more video is being received than available estimated downlink bandwidth can support, the event [videoNotReceivingEnoughData](https://github.com/aws/amazon-chime-sdk-js/blob/e958a53aa321c02afcb9cce9006fad2a30b94dff/demos/browser/app/meetingV2/meetingV2.ts#L596) can is triggered with a list of attendee IDs and the bandwidth being consumed due to them. You can use this information to selectively pause attendees that are sending the highest bitrate video streams using [pauseVideoTile](https://github.com/aws/amazon-chime-sdk-js/blob/2fd1027ecf23ac67421078293337d1788bbbf6c8/src/audiovideofacade/DefaultAudioVideoFacade.ts#L104). When a video tile is paused, the action only affects your client. It does not pause the video for other attendees.
 *
 * #### Use active speaker detection
 *
 * You can use the [active speaker detector](https://aws.github.io/amazon-chime-sdk-js/modules/apioverview.html#5d-subscribe-to-an-active-speaker-detector-optional) to show only the video of the active speakers and pause other videos.
 *
 * #### Configure a video downlink policy
 *
 * By default the SDK uses the [AllHighestVideoBandwidthPolicy](https://github.com/aws/amazon-chime-sdk-js/blob/master/src/videodownlinkbandwidthpolicy/AllHighestVideoBandwidthPolicy.ts) which subscribes to the highest quality video of all participants. This can be customized by setting the [VideoDownlinkBandwidthPolicy](https://github.com/aws/amazon-chime-sdk-js/blob/d658830a1f1d151c12a9fb89e371984bea3f9ebf/src/meetingsession/MeetingSessionConfiguration.ts#L74) in MeetingSessionConfiguration class.
 *
 * *Browser clients currently only send one stream resolution. You would only need to use this function if you were also using the Amazon Chime SDK for iOS or the Amazon Chime SDK for Android.*
 *
 * [Give feedback on this guide](https://github.com/aws/amazon-chime-sdk-js/issues/new?assignees=&labels=documentation&template=documentation-request.md&title=Quality%20Bandwidth_Connectivity%20feedback)
 */
declare namespace QualityBandwidth_Connectivity { }
