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

//generate random fetch period
let random_period = Math.round(Math.random() * 5000 + 5000);
fetchEveryPeriodUntilFoundRound(random_period);
var endInterval;

const overlayInterval = setInterval(() => {
  if (round.status == "active") {
    let now = new Date();
    let beforeStart = Math.floor((round.start_time - now) / 1000);
    if (beforeStart < 1) {
      $("#overlay-hide").removeClass("block-participant-view");
      startEndInterval();
      clearInterval(overlayInterval);
    } else {
      $("#remainingTime").text(
        "Round " + round.id + " Starts In " + beforeStart + " Seconds"
      );
    }
  } else {
    $("#remainingTime").text("Round " + round.id + " Starts Soon");
  }
}, 1000);

function startEndInterval() {
  endInterval = setInterval(() => {
    endHandler();
  }, 30 * 1000);
  let now = new Date();
  let beforeEnd = round.end_time - now;
  setTimeout(() => {
    endHandler();
  }, beforeEnd + 3000);
  endHandler();
}

function endHandler() {
  // checks if the time is finished or not and sends request
  let now = new Date();
  let beforeEnd = Math.floor((round.end_time - now) / 1000);

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
    const random_time = Math.floor(Math.random() * 1000);
    setTimeout(() => {
      sendRequest();
    }, 1000 + random_time);
    console.log("code sent successfully");
  }
}

function fetchEveryPeriodUntilFoundRound(random_period) {
  const fetchInterval = setInterval(() => {
    getRoundTimes();
  }, random_period);

  getRoundTimes();

  async function getRoundTimes() {
    fetchedRound = await fetchCurrentRound();
    setRound(fetchedRound, fetchInterval);
    let saved_round_localStorage = getRoundLocalhost();
    if (
      fetchedRound &&
      fetchedRound.status == "active" &&
      saved_round_localStorage &&
      fetchedRound.id == saved_round_localStorage.id
    ) {
      // trying to recover code
    } else {
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
}

function setRound(test, testInterval) {
  round = { ...test };
  if (test && test.start_time && test.end_time) {
    setRoundLocalhost(round);
    round.start_time = new Date(test.start_time);
    round.end_time = new Date(test.end_time);
    return clearInterval(testInterval);
  }
}

async function sendRequest() {
  const participant = JSON.parse(localStorage.getItem("participant"));
  var base_url = baseUrl();
  let code = window.localStorage["content"];
  const file = new File([code], "file.html", {
    type: "text/plain",
  });
  formData = new FormData();
  formData.append("file", file);
  $.ajaxSetup({
    headers: {
      "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
    },
  });
  $.ajax({
    url: baseUrl() + "/api/participant/submit",
    data: formData,
    processData: false,
    contentType: false,
    type: "POST",
    success: function (data) {
      window.location.href = "/auth/logout";
    },
    error: function (e) {
      console.log(e);
    },
  });
}
