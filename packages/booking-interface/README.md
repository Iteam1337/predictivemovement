# `booking-interface`

A telegram bot to add bookings.

Start by exporting port 9200

```
kubectl port-forward elasticsearch-0 9200:9200 --namespace pelias
```

## Run locally

Create .env file in root with following content:

```
BOT_TOKEN=<your telegram bot token>
```

And then run

```
npm install
npm run dev
```

### Booking

Start the booking wizard by typing the command `/start`. This will take you through the booking, step by step.
