import json
import pika


def test_request_receiving():
    # given
    with open('data/request/10_route_request.json') as req_file:
        req = json.load(req_file)

    # when
    send_message(req)

    # then


def send_message(message):
    json_msg = json.dumps(message)

    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='pm-rabbit'))
    channel = connection.channel()

    channel.queue_declare(queue='hello')

    channel.basic_publish(exchange='',
                          routing_key='hello',
                          body=json_msg)
    print(" [x] Sent request")
    connection.close()


if __name__ == "__main__":
    test_request_receiving()
