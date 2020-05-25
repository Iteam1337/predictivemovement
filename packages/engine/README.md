# BroadwayEngine

** TODO **

- Add real offer car function
- add "busy" property on car when making an offer
- Change so we don't use birds eye view, use OSRM route distance instead.

# Select broadway engine gameplan

- Rename all broadway engine -> engine
- Rename order -> booking
- Rename car - vehicle
- Rename graphhopper -> candidates_request + candidates_response
- Produce multiple [bookings] + [vehicles] into a candidates_request
- Offer the vehicles the bookings and gather the response
- Dockerfile + yaml for running in test environment
- Profit!
