$(document).ready(function() {


    // firebase 
    var firebaseConfig = {
        apiKey: "AIzaSyBCxvwKV6FRAcvbkFD52nwIeJ6PgmqvR9c",
        authDomain: "train-times-9d623.firebaseapp.com",
        databaseURL: "https://train-times-9d623.firebaseio.com",
        projectId: "train-times-9d623",
        storageBucket: "train-times-9d623.appspot.com",
        messagingSenderId: "671088095567",
        appId: "1:671088095567:web:2afa3f0a9301fc4a"
    };

    // initialize Firebase
    firebase.initializeApp(firebaseConfig);

    var database = firebase.database();

    // // current time
    // function currentTime() {
    //     var current = moment().format('ET');
    //     $("#currentTime").html(current);
    //     setTimeout(currentTime, 1000);
    // };

    // adding new trains
    $("#submit").on("click", function(event) {
        event.preventDefault()


        // grabs user input
        var trainName = $('#train-name').val().trim();
        var destination = $('#destination').val().trim();
        var firstTrain = $("#first-train").val().trim();
        //moment($('#first-train').val().trim(), "HH:mm").subtract(1, "years").format("X");
        var freq = $('#frequency').val().trim();


        // creates local object for holding train times
        var newTrain = {
            name: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: freq,

        };

        // uploads train data to db
        database.ref().push(newTrain);

        // logs to console
        console.log(newTrain.name);
        console.log(newTrain.destination);
        console.log(newTrain.firstTrain);
        console.log(newTrain.frequency);

        alert('Train added');

        // clears all text boxes
        $('#train-name').val('');
        $('#destination').val('');
        $("#first-train").val('');
        $('#frequency').val('');

        return false;
    })

    // firebase event for adding trains to database and a row in the html when user adds entry
    database.ref().on("child_added", function(childSnapshot) {
        var newTrain = childSnapshot.val().trainName;
        var newLocation = childSnapshot.val().destination;
        var newFirstTrain = childSnapshot.val().firstTrain;
        var newFreq = childSnapshot.val().frequency;



        var startTimeConverted = moment(newFirstTrain, "hh:mm").subtract(1, "years");

        var currentT = moment();

        // difference btwn times
        var diffTime = moment().diff(moment(startTimeConverted), "minutes");

        var timeRemain = diffTime % newFreq;

        // mins until next train
        var minToArrival = newFreq - timeRemain;

        // next train

        var nextTrain = moment().add(minToArrival, "minutes");
        var train = moment(nextTrain).format("HH:mm");

        $('#trains-row').append(
            '<tr><td>' + childSnapshot.val().name +
            '</td><td>' + newLocation +
            '</td><td>' + newFreq +
            '</td><td>' + train +
            '</td><td>' + minToArrival + ' </td></tr>');


    })
})






// var startTimeConverted = moment(snapshot.val().startTime, "HH:mm").subtract(10, "years");
// console.log(firstTimeConverted);

// var currentTime = moment();
// console.log('CURRENT TIME: ' + moment(currentTime).format("hh:mm"));

// $('#current-time').append(currentTime);

// // time difference
// var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
// console.log("DIFFERENCE IN TIME: " + timeDiff);

// // time remaining
// var timeRemain = timeDiff % snapshot.val().frequency;
// console.log(timeRemain);

// // mins until train
// var minToArrival = snapshot.val().frequency - timeRemain;
// console.log("MINUTES TILL TRAIN: " + minToArrival);

// // next train
// var nextTrain = moment().add(minToArrival, "minutes");
// console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


// var key = snapshot.key;

// var newRow = $('<tr>');
// newRow.append($('<td>' + snapshot.val().name + "</td>"));
// newRow.append($("<td>" + snapshot.val().destination + "</td>"));
// newRow.append($("<td class='text-center'>" + snapshot.val().frequency + "</td>"));
// newRow.append($("<td class='text-center'>" + moment(nextTrain).format("LT") + "</td>"));
// newRow.append($("<td class='text-center'>" + minToArrival + "</td>"));
// newRow.append($("<td class='text-center'><button class='arrival btn btn-danger btn-xs' data-key='" + key + "'>X</button></td>"));
// $('#trains-row').append(newRow);

// OLD CODE 
// var name = snapshot.val().name;
//   var destination = snapshot.val().destination;
//   var firstTrain = snapshot.val().firstTrain;
//   var frequency = snapshot.val().frequency;
//   console.log(snapshot.val());

//   var remainder = moment().diff(moment.unix(firstTrain), "minutes") % frequency;
//   var minutes = frequency - remainder;
//   var arrival = moment().add(minutes, "m").format("hh:mm A");

//   $("#schedule > tBody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + arrival + "</td><td>" + minutes + "</td></tr>");