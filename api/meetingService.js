'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid');

AWS.config.update({region: 'eu-west-2'});
const chime = new AWS.Chime({ region: 'us-east-1' });
chime.endpoint = new AWS.Endpoint('https://service.chime.aws.amazon.com/console');

module.exports.createRoom = async (event, context, callback) => {

    const meetingResponse = await chime.createMeeting({        
        ClientRequestToken: uuid.v4(),
        MediaRegion: 'eu-west-2' // Specify the region in which to create the meeting.
      }).promise();

      const attendeeResponse = await chime.createAttendee({
        MeetingId: meetingResponse.Meeting.MeetingId,
        ExternalUserId: uuid.v4() // Link the attendee to an identity managed by your application.
      }).promise();
    
    const response = {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        meeting: meetingResponse,
        attendee: attendeeResponse
      }),
    };
  
    callback(null, response);
  };

module.exports.listRooms = async (event, context, callback) => {

    const rsx = await chime.listMeetings().promise();

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        meetings: rsx.Meetings
      }),
    };
  
    callback(null, response);
  };

module.exports.joinRoom = async (event, context, callback) => {

    const rsx = await chime.listMeetings().promise();

    const attendeeResponse = await chime.createAttendee({
        MeetingId: rsx.Meetings[0].MeetingId,
        ExternalUserId: uuid.v4() // Link the attendee to an identity managed by your application.
      }).promise();

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        meeting: rsx.Meetings[0],
        attendee: attendeeResponse
      }),
    };
  
    callback(null, response);
  };

