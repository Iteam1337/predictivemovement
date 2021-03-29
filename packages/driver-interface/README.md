# `driver-interface`

## Usage
Create a Telegram bot by clicking https://t.me/botfather and opening it in Telegram. It will guide you through the creation.

Create .env file in root with following content:

```
BOT_TOKEN=<your telegram bot token>

# OPTIONAL

REDIS_URL=<your redis url>
REDIS_KEY_NAMESPACE=<redis key prefix>
```

Open `t.me/your_bot_name` from telegram app on you phone. This will add your bot to Telegram.

### Driver

The API behind the bot takes a location payload from the client (you), you enable this by live sharing your location to the bot. To do this you press the paperclip icon next to the message input and select `live location`.

Locations will be sent to the "cars"-exchange on RabbitMQ.

Start bot backend with

When a driver has accepted a booking/plan you can use `/lista` to get the planned route for the driver. This data is saved in the telegram cache.

```
npm run dev
```
