export default class DataMessage {
    /**
     * Monotonically increasing server injest time
     */
    readonly timestampMs: number;
    /**
     * Topic this message was sent on
     */
    readonly topic: string;
    /**
     * Data payload
     */
    readonly data: Uint8Array;
    /**
     * Sender attendee
     */
    readonly senderAttendeeId: string;
    /**
     * Sender attendee external user Id
     */
    readonly senderExternalUserId: string;
    /**
     * true if server throttled or rejected message
     * false if server has posted the message to its recipients
     */
    readonly throttled: boolean;
    constructor(timestampMs: number, topic: string, data: Uint8Array, senderAttendeeId: string, senderExternalUserId: string, throttled?: boolean | null);
    /**
     * Helper conversion methods to convert Uint8Array data to string
     */
    text(): string;
    /**
     * Helper conversion methods to convert Uint8Array data to JSON
     */
    json(): any;
}
