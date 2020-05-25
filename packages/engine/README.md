# BroadwayEngine

** TODO **

- Add real offer car function
- add "busy" property on car when making an offer
- Change so we don't use birds eye view, use OSRM route distance instead.

# Select broadway engine gameplan

- [x] Rename all broadway engine -> engine
- [x] Rename old engine-elixir + engine to -> engine-old, engine-js
- [x] Rename order -> booking
- [ ] Rename car -> vehicle
- [ ] Rename graphhopper -> candidates_request + candidates_response
- [ ] Produce multiple [bookings] + [vehicles] into a candidates_request according to this [format](https://docs.graphhopper.com/#tag/Route-Optimization-API)
- [ ] Offer the vehicles the bookings and gather the response
- [ ] Dockerfile + yaml for running in test environment
- [ ] Profit!
