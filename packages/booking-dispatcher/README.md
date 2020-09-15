# `booking-dispatcher`

Start the lib along with the rest of the application. This feature is for presenting and working with real data for package deliverys in Ljusdal from last year.
We read data from the exel file and then send the bookings to the application.
This will use the data from the exel file and present the real data from last year in Ljusdal.

## Usage

```
const bookingDispatcher = require('booking-dispatcher');
```

Create .env file in root with following content:

```
file=<your exel file>
```

Start with

```
npm run dev
```
