const clock = document.getElementById("clock");

// Generate 60 markers
for (let i = 0; i < 60; i++) {
  const mark = document.createElement("div");
  mark.classList.add("mark");

  // Every 5th = hour marker
  if (i % 5 === 0) {
    mark.classList.add("hour-mark");
  }

  mark.style.transform = `rotate(${i * 6}deg)`;

  clock.appendChild(mark);
}

let selectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const secondHand = document.querySelector('.second');
const minuteHand = document.querySelector('.minute');
const hourHand = document.querySelector('.hour');

// Track accumulated rotations
let currentHourDeg = 0;
let currentMinuteDeg = 0;


// CLOCK MECHANICS
function updateClock() {

  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: selectedTimeZone,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false
  });

  const parts = formatter.formatToParts(now);

  const hours = parseInt(
    parts.find(p => p.type === "hour").value
  ) % 12;

  const minutes = parseInt(
    parts.find(p => p.type === "minute").value
  );

  const seconds = parseInt(
    parts.find(p => p.type === "second").value
  );

  // Smooth seconds sweep
  const smoothSeconds =
      seconds + now.getMilliseconds() / 1000;

  const secDeg = smoothSeconds * 6;

  let minDeg =
      minutes * 6 + smoothSeconds * 0.1;

  let hourDeg =
      hours * 30 + minutes * 0.5;


  // Prevent backward jump of hands
  while(minDeg < currentMinuteDeg){
      minDeg += 360;
  }

  while(hourDeg < currentHourDeg){
      hourDeg += 360;
  }

  currentMinuteDeg = minDeg;
  currentHourDeg = hourDeg;


  secondHand.style.transform =
      `rotate(${secDeg}deg)`;

  minuteHand.style.transform =
      `rotate(${currentMinuteDeg}deg)`;

  hourHand.style.transform =
      `rotate(${currentHourDeg}deg)`;

  requestAnimationFrame(updateClock);
}

updateClock();



// TIME ZONE LIST
const select = document.getElementById("countrySelect");

const countries = Intl.supportedValuesOf("timeZone");

countries.sort();

countries.forEach(zone => {
  const option = document.createElement("option");
  option.value = zone;
  option.textContent = zone;
  select.appendChild(option);
});
select.value = selectedTimeZone;


// TIME ZONE SELECTION
select.addEventListener("change", (e) => {

  selectedTimeZone = e.target.value;

  // temporary smooth glide when switching zones
  minuteHand.style.transition =
      "transform 1.2s ease-in-out";

  hourHand.style.transition =
      "transform 1.8s ease-in-out";

  // remove transition after glide so live sweep stays smooth
  setTimeout(() => {
      minuteHand.style.transition = "";
      hourHand.style.transition = "";
  },1800);

});
