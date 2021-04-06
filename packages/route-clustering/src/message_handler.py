import sys
import signal
import pika
import json


def exit_gracefully(signum, frame):
    sys.exit(0)


signal.signal(signal.SIGINT, exit_gracefully)
signal.signal(signal.SIGTERM, exit_gracefully)


def handle_incoming_request(ch, method, properties, body):
    json_req = json.loads(body)
    print(" [x] Received %r" % json_req)


def start_listening():
    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host='pm-rabbit'))
        channel = connection.channel()

        channel.queue_declare(queue='hello')

        channel.basic_consume(queue='hello',
                              on_message_callback=handle_incoming_request,
                              auto_ack=True)

        print(' [*] Waiting for messages. To exit press CTRL+C')
        channel.start_consuming()
    except SystemExit as ex:
        print("Killing me softly (SystemExit)")
    except Exception as ex:
        print('Exception occured!', exc_info=ex)
    finally:
        print("run closed")


if __name__ == "__main__":
    start_listening()
