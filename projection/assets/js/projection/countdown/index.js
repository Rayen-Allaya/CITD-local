/****gloabal variables *****/
let beforeCount = 3;

var state = $("#state");
var time = $("#time");
let html = $("html");
let overlay = $("#overlay");

/****functions****/
function timeEqual(now, time) {
    return time - 500 <= now && now <= time + 500;
}

function timeEqualHandler(text) {
    overlay.removeClass("hide");
    overlay.addClass("show");
    html.addClass("hover");
    state.text("");
    time.text(text);
    setTimeout(() => {
        html.removeClass("hover");
        overlay.addClass("hide");
        overlay.removeClass("show");
    }, 500);
}

function secondsRemaining(now, round, numberOfSeconds) {
    let secondsBeforeStart =
        round.start_time > now &&
        round.start_time - now <= numberOfSeconds * 1000 + 500;
    let secondsBeforeEnd =
        round.end_time > now &&
        round.end_time - now <= numberOfSeconds * 1000 + 500;
    return secondsBeforeEnd || secondsBeforeStart;
}

function tenSecondsRemainingHandler() {
    overlay.removeClass("hide");
    overlay.addClass("show-light");
    html.addClass("hover-light");
    setTimeout(() => {
        html.removeClass("hover-light");
        overlay.addClass("hide");
        overlay.removeClass("show-light");
    }, 500);
}

function threeSecondsRemainingHandler() {
    overlay.removeClass("hide");
    overlay.addClass("show");
    html.addClass("hover");
    // state.text("");
    // time.text(text);
    setTimeout(() => {
        html.removeClass("hover");
        overlay.addClass("hide");
        overlay.removeClass("show");
    }, 500);
}

function renderTime(now, start_time, end_time, round_number) {
    let duration = 0;
    if (now < start_time) {
        duration = start_time - now;
        state.text("Before Round " + round_number);
    } else if (now < end_time) {
        duration = end_time - now;
        state.text("");
    }
    let { m, s } = durationToMinSec(duration);
    time.text(m + " : " + s);
}

function durationToMinSec(duration, unit = "ms") {
    if (unit == "ms") {
        duration = Math.floor(duration / 1000);
    }
    let m = Math.floor(duration / 60);
    let s = duration % 60;
    m = m < 10 ? "0" + m.toString() : m.toString();
    s = s < 10 ? "0" + s.toString() : s.toString();
    return { m, s };
}

// function countDown() {
//     let second = false;
//     let x = setInterval(() => {
//         second = !second;

//         ///// the last seconds of the countdown
//         if (duration > 4 && duration <= 11) {
//             if (second) {
//                 lastSound.play();
//                 overlay.removeClass("hide");
//                 overlay.addClass("show-light");
//                 html.addClass("hover-light");
//             } else {
//                 html.removeClass("hover-light");
//                 overlay.addClass("hide");
//                 overlay.removeClass("show-light");
//             }
//         } else if (duration <= 4) {
//             overlay.removeClass("show-light");
//             html.removeClass("hover-light");
//             if (second) {
//                 overlay.removeClass("hide");
//                 overlay.addClass("show");
//                 html.addClass("hover");
//             } else {
//                 html.removeClass("hover");
//                 overlay.addClass("hide");
//                 overlay.removeClass("show");
//             }
//         }

//         ////// the countdown and the 3 2 1 start

//         if (beforeCount > 0) {
//             // print the 3 2 1 countdown
//             if (second) {
//                 firstSound.play();
//                 overlay.removeClass("hide");
//                 overlay.addClass("show");
//                 html.addClass("hover");
//                 clock.text(beforeCount.toString());
//                 beforeCount--;
//             } else {
//                 html.removeClass("hover");
//                 overlay.addClass("hide");
//                 overlay.removeClass("show");
//             }
//         } else if (beforeCount === 0) {
//             // print the start statement with the effect
//             if (second) {
//                 clock.text("START !");
//                 overlay.removeClass("hide");
//                 overlay.addClass("show");
//                 html.addClass("hover");
//                 beforeCount--;
//             } else {
//                 html.removeClass("hover");
//                 overlay.addClass("hide");
//                 overlay.removeClass("show");
//             }
//         } else {
//             //remove the effect
//             if (beforeCount >= -2) {
//                 html.removeClass("hover");
//                 overlay.addClass("hide");
//                 overlay.removeClass("show");
//                 beforeCount--;
//             }

//             ///////////// the countdown
//             if (second) {
//                 duration--;
//                 if (duration === 0) {
//                     clearInterval(x);
//                 }
//                 m = Math.floor(duration / 60);
//                 s = duration % 60;
//                 m = m < 10 ? "0" + m.toString() : m.toString();
//                 s = s < 10 ? "0" + s.toString() : s.toString();
//                 if (duration !== 0) {
//                     clock.text(m + " : " + s);
//                 } else {
//                     clock.text("STOP !");
//                 }
//             }
//         }
//     }, tempo / 2);
// }

// $.ajaxSetup({
//     headers: {
//         'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
//     }
// });
// $.ajax({
//     url: apiURL,
//     type: 'POST',
//     success: function() {
//         w
//     }
// });
