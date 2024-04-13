// UNCOMMENT THE FOLLOWING LINES BEFORE EVENT
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

// FOR TESTING
var number_requests = localStorage.getItem("editor_requests");
localStorage.setItem("editor_requests", number_requests - 0 + 1);

//////////////// SCRIPT ///////////////
var round = {
  start_time: null,
  end_time: null,
  status: "pending",
};
var i = 0;
var j = 0;

//generate random fetch period
let random_period = Math.round(Math.random() * 5000 + 5000);

var interval = setInterval(() => {
  i = i + 1;
  setIntervalHandler(interval);
}, 1000);
setIntervalHandler(interval);

async function setIntervalHandler(interval) {
  var now = new Date();
  if (i % 10 == 0) {
    await sync_round_server(now);
  }

  if (round.status == "pending") {
    $("#remainingTime").text("Round " + round.id + " Starts Soon");
  } else if (round.status == "active") {
    let beforeStart = Math.floor((round.start_time - now) / 1000);
    let beforeEnd = Math.floor((round.end_time - now) / 1000);
    if (beforeStart < 1) {
      $("#overlay-hide").removeClass("block-participant-view");
    } else {
      $("#remainingTime").text(
        "Round " + round.id + " Starts In " + beforeStart + " Seconds"
      );
    }
    if (beforeEnd < 0) {
      $(".ace_text-input").blur();
      $("#overlay-hide").addClass("block-participant-view");
      $("#remainingTime").text(
        "Round " + round.id + " : You've coded your way to victory!"
      );
      $("#title").text("Time is up!");
      // send request

      // logout user
      // DONT CLEAR THE LOCALStorage
      // clearInterval(endInterval);
      await sendRequest(interval);
      console.log("code sent successfully");
      // logout();
    }
  }
}

async function sync_round_server(now) {
  fetchedRound = await fetchCurrentRound();
  console.log("fetched round");

  setRound(fetchedRound);
  if (!fetchedRound || !fetchedRound.status) {
    logout();
  }
  if (
    fetchedRound &&
    fetchedRound.status == "active" &&
    round.end_time &&
    Math.floor((round.end_time - now) / 1000) < -3
  ) {
    console.log("the round ended but still active");
    setTimeout(() => {
      logout();
    }, 3000);
  } else if (fetchedRound.status == "pending") {
    console.log("regular check when round is pending");
    let content = localStorage.getItem("content");
    let initContent = localStorage.getItem("initContent");
    if (content != initContent) {
      window.addEventListener("beforeunload", function (event) {
        event.stopImmediatePropagation();
      });
      setTimeout(() => {
        window.location.href = "./landing.html";
      }, 1000);
    }
  }
}

function setRound(test) {
  round = { ...test };
  if (test && test.start_time && test.end_time) {
    setRoundLocalhost(round);
    round.start_time = new Date(test.start_time);
    round.end_time = new Date(test.end_time);
  }
}

async function sendRequest(interval) {
  const { participant, token } = getParticipantData();
  let code = window.localStorage["content"];
  const file = new File([code], "file.html", {
    type: "text/plain",
  });
  formData = new FormData();
  formData.append("file", file);
  formData.append("identifier", participant.email);
  formData.append("api_token", token);
  $.ajaxSetup({});
  $.ajax({
    url: baseUrl() + "/api/participant/submit",
    data: formData,
    processData: false,
    contentType: false,
    type: "POST",
    success: function (data) {
      logout();
      clearInterval(interval);
    },
    error: function (e) {
      logout();
      clearInterval(interval);
    },
  });
}
