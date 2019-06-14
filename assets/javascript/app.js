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
    $(".add-train").on("click", function(event) {
        event.preventDefault()


        // grabs user input
        var trainName = $('#train-name').val().trim();
        var destination = $('#destination').val().trim();
        var firstTrain = moment($('#first-train').val().trim(), "HH:mm").subtract(1, "years").format("X");
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
    database.ref().on("child_added", function(snapshot) {
        var firstTimeConverted = moment(snapshot.val().startTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        var currentTime = moment();
        console.log('CURRENT TIME: ' + moment(currentTime).format("hh:mm"));

        $('#current-time').append(currentTime);

        // time difference
        var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + timeDiff);

        // time remaining
        var timeRemain = timeDiff % snapshot.val().frequency;
        console.log(timeRemain);

        // mins until train
        var minToArrival = snapshot.val().frequency - timeRemain;
        console.log("MINUTES TILL TRAIN: " + minToArrival);

        // next train
        var nextTrain = moment().add(minToArrival, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


        var key = snapshot.key;

        var newRow = $('<tr>');
        newRow.append($('<td>' + snapshot.val().trainName + "</td>"));
        newRow.append($("<td>" + snapshot.val().destination + "</td>"));
        newRow.append($("<td class='text-center'>" + snapshot.val().frequency + "</td>"));
        newRow.append($("<td class='text-center'>" + moment(nextTrain).format("ET") + "</td>"));
        newRow.append($("<td class='text-center'>" + minToArrival + "</td>"));
        newRow.append($("<td class='text-center'><button class='arrival btn btn-danger btn-xs' data-key='" + key + "'>X</button></td>"));

        // var name = snapshot.val().name;
        //   var destination = snapshot.val().destination;
        //   var firstTrain = snapshot.val().firstTrain;
        //   var frequency = snapshot.val().frequency;
        //   console.log(snapshot.val());

        //   var remainder = moment().diff(moment.unix(firstTrain), "minutes") % frequency;
        //   var minutes = frequency - remainder;
        //   var arrival = moment().add(minutes, "m").format("hh:mm A");

        //   $("#schedule > tBody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + arrival + "</td><td>" + minutes + "</td></tr>");
    })
})