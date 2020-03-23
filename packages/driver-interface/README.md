# `driver-interface`

## Usage

Open `t.me/pm_driver_bot` from telegram app on you phone. This will add the telegram bot `pm_driver` to your telegram.

The API behind the bot takes a location payload from the client (you), you enable this by live sharing your location to the bot. To do this you press the paperclip icon next to the message input and select `live location`.

Locations will be sent to the "cars"-exchange on RabbitMQ.

Start bot backend with

```
npm run dev
```
