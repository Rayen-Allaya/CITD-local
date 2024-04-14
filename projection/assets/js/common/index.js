function baseUrl() {
  let ipAddress = localStorage.getItem("ipAddress");
  if (ipAddress) {
    return "http://" + ipAddress;
  }
  window.location.href = "./init.html";
}

async function fetchCurrentRound() {
  var base_url = baseUrl();
  let now = new Date();
  Number.prototype.padLeft = function (base, chr) {
    var len = String(base || 10).length - String(this).length + 1;
    return len > 0 ? new Array(len).join(chr || "0") + this : this;
  };
  let nowString =
    [
      now.getDate().padLeft(),
      (now.getMonth() + 1).padLeft(),
      now.getFullYear(),
    ].join("/") +
    "_" +
    [
      now.getHours().padLeft(),
      now.getMinutes().padLeft(),
      now.getSeconds().padLeft(),
    ].join(":");
  var res = await fetch(
    base_url + "/api/rounds/current?client_now=" + nowString
  );
  var round = await res.json();
  return round;
}

function shiftTime(timeStringToShift, clientNow, serverNow) {
  let time_diff = clientNow - serverNow;
  console.log(time_diff);
  // timeToShift = timeToShift + time_diff;

  let timeToShift = new Date(timeStringToShift);
  timeToShift.setMilliseconds(timeToShift.getMilliseconds() + time_diff);

  timeToShift =
    timeToShift.toLocaleDateString() + " " + timeToShift.toLocaleTimeString();
  return timeToShift;
}

async function setRoundLocalhost(round) {
  localStorage.setItem("round", JSON.stringify(round));
}

function getRoundLocalhost() {
  let rounda = localStorage.getItem("round");
  rounda = JSON.parse(rounda);
  return rounda;
}

function setParticipantLocalhost(participant) {
  localStorage.setItem("participant", JSON.stringify(participant));
}

function getParticipantLocalhost(participant) {
  let participant_localstorage = localStorage.getItem("participant");
  participant_localstorage = JSON.parse(participant_localstorage);
  return participant_localstorage;
}
