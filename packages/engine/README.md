# BroadwayEngine

** TODO **

- Add real offer car function
- add "busy" property on car when making an offer
- Change so we don't use birds eye view, use OSRM route distance instead.

# Select broadway engine gameplan

- [x] Rename all broadway engine -> engine
- [x] Rename old engine-elixir + engine to -> engine-old, engine-js
- [x] Rename order -> booking
- [x] Rename car -> vehicle
- [ ] Rename cars exchange -> vehicles
- [x] Rename graphhopper -> candidates_request + candidates_response
- [x] Produce multiple [bookings] + [vehicles] into a candidates_request according to this [format](https://docs.graphhopper.com/#tag/Route-Optimization-API)
      (we already do this)
- [ ] Produce multiple bookings from the match_producer
      -> 5 cars + 10 bookings -> candidate_request[5, 10] -> candidate_response[5, 10] -> offer -> accept[3, 5] + remainder[2, 5] -> candidate_request[2, 5] + new
- [ ] If some producer needs to send metadata they should include it in a meta property
- [ ] Offer the vehicles the bookings and gather the response
- [x] Dockerfile + yaml for running in test environment
- [ ] Remove unused code from car (route_score, permutations etc)
- [ ] Profit!
