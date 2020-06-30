# `driver-interface`

## Usage

Create .env file in root with following content:

```
BOT_TOKEN=<your telegram bot token>
```

Open `t.me/predictive_movement_bot` from telegram app on you phone. This will add the telegram bot `pm_driver_bot` to your telegram.

### Driver

The API behind the bot takes a location payload from the client (you), you enable this by live sharing your location to the bot. To do this you press the paperclip icon next to the message input and select `live location`.

Locations will be sent to the "cars"-exchange on RabbitMQ.

Start bot backend with

When a driver has accepted a booking/plan you can use `/lista` to get the planned route for the driver. This data is saved in the telegram cache.

```
npm run dev
```
