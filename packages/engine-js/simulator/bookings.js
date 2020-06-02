const _ = require("highland");
const { randomize } = require("./address");

let id = 1;

function randomizeBooking() {
  return Promise.all([randomize(), randomize()]).then(
    ([departure, destination]) => ({
      id: id++,
      bookingDate: new Date(),
      departure,
      destination
    })
  );
}

module.exports = _(function(push, next) {
  randomizeBooking().then(booking => {
    console.log("booking", JSON.stringify(booking, null, 2));
    return push(null, booking);
  });
  // .then(_ => setTimeout(next, 5000))
});
