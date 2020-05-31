// Copyright 2019-2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
require('dotenv').config();

const AWS = require('aws-sdk');
const compression = require('compression');
const fs = require('fs');
const http = require('http');
const url = require('url');
const uuid = require('uuid/v4');

// AWS User Credentials
const access_key = process.env.AWS_ACCESS_KEY_ID,
  secret_key = process.env.AWS_SECRET_ACCESS_KEY;

// Database drive and models
const mongoose = require('mongoose');
const meetingModel = require('./models/meeting');
const attendeeModel = require('./models/attendee');

// Store created meetings in a map so attendees can join by meeting title
const meetingTable = {};

// Use local host for application server
const host = '127.0.0.1:8080';

// Load the contents of the web application to be used as the index page
const indexPage = fs.readFileSync(`dist/${process.env.npm_config_app || 'meetingV2'}.html`);

// Create ans AWS SDK Chime object. Region 'us-east-1' is currently required.
// Use the MediaRegion property below in CreateMeeting to select the region
// the meeting is hosted in.
const chime = new AWS.Chime({
  region: 'us-east-1',
  accessKeyId: access_key,
  secretAccessKey: secret_key,
});

// Set the AWS SDK Chime endpoint. The global endpoint is https://service.chime.aws.amazon.com.
chime.endpoint = new AWS.Endpoint(process.env.ENDPOINT || 'https://service.chime.aws.amazon.com');

// Connect to DB and Start an HTTP server to serve the index page and handle meeting actions
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0-cqxyc.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`,
  err => {
    if (err) {
      console.log(err);
    } else {
      http
        .createServer({}, async (request, response) => {
          log(`${request.method} ${request.url} BEGIN`);
          try {
            let meeting;
            // Enable HTTP compression
            compression({})(request, response, () => {});
            const requestUrl = url.parse(request.url, true);
            if (request.method === 'GET' && requestUrl.pathname === '/') {
              // Return the contents of the index page
              respond(response, 200, 'text/html', indexPage);
            } else if (
              process.env.DEBUG &&
              request.method === 'POST' &&
              requestUrl.pathname === '/join'
            ) {
              // For internal debugging - ignore this.
              respond(
                response,
                201,
                'application/json',
                JSON.stringify(require('./debug.js').debug(requestUrl.query), null, 2)
              );
            } else if (request.method === 'POST' && requestUrl.pathname === '/join') {
              if (!requestUrl.query.title || !requestUrl.query.name || !requestUrl.query.region) {
                throw new Error('Need parameters: title, name, region');
              }

              meeting = await meetingModel.findOne({
                title: requestUrl.query.title.substring(0, 64),
              });

              console.log('meeting-new', meeting);
              // Look up the meeting by its title. If it does not exist, create the meeting.
              if (!meeting || meeting === undefined) {
                const meetingData = await chime
                  .createMeeting({
                    // Use a UUID for the client request token to ensure that any request retries
                    // do not create multiple meetings.
                    ClientRequestToken: uuid(),
                    // Specify the media region (where the meeting is hosted).
                    // In this case, we use the region selected by the user.
                    MediaRegion: requestUrl.query.region,
                    // Any meeting ID you wish to associate with the meeting.
                    // For simplicity here, we use the meeting title.
                    ExternalMeetingId: requestUrl.query.title.substring(0, 64),
                  })
                  .promise();

                meeting = await new meetingModel({
                  title: requestUrl.query.title.substring(0, 64),
                  ...meetingData,
                }).save();
              }

              console.log('meeting-new-2', meeting.Meeting);
              const meetingId = meeting.Meeting.MeetingId;

              const attendeeData = await chime
                .createAttendee({
                  // The meeting ID of the created meeting to add the attendee to
                  MeetingId: meetingId,

                  // Any user ID you wish to associate with the attendeee.
                  // For simplicity here, we use a random id for uniqueness
                  // combined with the name the user provided, which can later
                  // be used to help build the roster.
                  ExternalUserId: `${uuid().substring(0, 8)}#${requestUrl.query.name}`.substring(
                    0,
                    64
                  ),
                })
                .promise();

              // Create new attendee for the meeting
              const attendee = await new attendeeModel(attendeeData).save();

              // Return the meeting and attendee responses. The client will use these
              // to join the meeting.
              respond(
                response,
                201,
                'application/json',
                JSON.stringify(
                  {
                    JoinInfo: {
                      Meeting: meeting,
                      Attendee: attendee,
                    },
                  },
                  null,
                  2
                )
              );
            } else if (request.method === 'POST' && requestUrl.pathname === '/end') {
              // End the meeting. All attendee connections will hang up.
              await chime
                .deleteMeeting({
                  MeetingId: await meetingModel.findOne({
                    title: requestUrl.query.title.substring(0, 64),
                  }).Meeting.MeetingId,
                })
                .promise();
              respond(response, 200, 'application/json', JSON.stringify({}));
            } else {
              respond(response, 404, 'text/html', '404 Not Found');
            }
          } catch (err) {
            respond(
              response,
              400,
              'application/json',
              JSON.stringify({ error: err.message }, null, 2)
            );
          }
          log(`${request.method} ${request.url} END`);
        })
        .listen(host.split(':')[1], host.split(':')[0], () => {
          log(`server running at http://${host}/`);
        });

      function log(message) {
        console.log(`${new Date().toISOString()} ${message}`);
      }
    }
  }
);

function respond(response, statusCode, contentType, body) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', contentType);
  response.end(body);
  if (contentType === 'application/json') {
    log(body);
  }
}
