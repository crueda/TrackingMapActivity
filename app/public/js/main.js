$(function() {
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize variables
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page

  // Prompt for setting a username
  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $usernameInput.focus();

  var socket = io();

  function addParticipantsMessage (data) {
    var message = '';
    if (data.numUsers === 1) {
      message += "there's 1 participant";
    } else {
      message += "there are " + data.numUsers + " participants";
    }
    log(message);
  }

  // Sets the client's username
  function setUsername () {
    username = cleanInput($usernameInput.val().trim());

    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();

      // Tell the server your username
      socket.emit('add user', username);
    }
  }

  // Sends a chat message
  function sendMessage () {
    var message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $inputMessage.val('');
      addChatMessage({
        username: username,
        message: message
      });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
  }

  // Log a message
  function log (message, options) {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }

 



 // init tracking data
  function initTrackingData (data) {
    var lat = data.data.location.coordinates[1];
    var lon = data.data.location.coordinates[0];
    var deviceId = data.data.device_id;
    var vehicleLicense = data.data.vehicle_license;
    var posDate = data.data.pos_date;
    var geocoding = data.data.geocoding;
    var trackingId = data.data.tracking_id;
    var speed = data.data.speed;
    var heading = data.data.heading;
    addAnimationFeature(lat, lon);
    addTrackingPointInit(deviceId, vehicleLicense, trackingId, posDate, geocoding, lat, lon, speed, heading);
  }

  // New tracking data
  function newTrackingData (data) {
    var lat = data.data.location.coordinates[1];
    var lon = data.data.location.coordinates[0];
    var deviceId = data.data.device_id;
    var vehicleLicense = data.data.vehicle_license;
    var posDate = data.data.pos_date;
    var geocoding = data.data.geocoding;
    var trackingId = data.data.tracking_id;
    var speed = data.data.speed;
    var heading = data.data.heading;
    addAnimationFeature(lat, lon);
    addLineTracking(vehicleLicense, trackingIdDict[vehicleLicense], latDict[trackingIdDict[vehicleLicense]], lonDict[trackingIdDict[vehicleLicense]], trackingId, lat, lon);
    addTrackingPointEffect(deviceId, vehicleLicense, trackingId, posDate, geocoding, lat, lon, speed, heading);

  }







 


  // Click events

  // Focus input when clicking anywhere on login page
  $loginPage.click(function () {
    $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(function () {
    $inputMessage.focus();
  });

  // Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    connected = true;
    // Display the welcome message
    var message = "Welcome to Socket.IO Chat – ";
    log(message, {
      prepend: true
    });
    addParticipantsMessage(data);
  });




  // Whenever the server emits 'new tracking data', update the map
  socket.on('init tracking data', function (data) {
    //alert("en evento");
    //console.log("en evento");
    initTrackingData(data);
  });

  // Whenever the server emits 'new tracking data', update the map
  socket.on('new tracking data', function (data) {
    //alert("en evento");
    //console.log("en evento");
    newTrackingData(data);
  });

});
