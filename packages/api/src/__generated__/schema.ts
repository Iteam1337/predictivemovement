/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/transports": {
    get: operations["get_transports"];
    post: operations["create_transport"];
  };
  "/itinerary/{transport_id}": {
    get: operations["get_itinerary"];
  };
  "/bookings": {
    post: operations["create_booking"];
  };
}

export interface components {
  schemas: {
    AnyValue: { [key: string]: any };
    Activity: {
      id: string;
      booking_id: string;
      distance: number;
      duration: number;
      type: "start" | "end" | "pickup" | "delivery";
      position: components["schemas"]["Position"];
    };
    Address: {
      city: string;
      street: string;
      name: string;
      position: components["schemas"]["Position"];
    };
    Dimensions: {
      width?: number;
      length?: number;
      height?: number;
    };
    Transport: {
      id?: string;
      busy?: boolean;
      capacity?: {
        volume?: number;
        weight?: number;
      };
      earliest_start?: string;
      latest_end?: string;
      metadata?: { [key: string]: any };
      start_address?: components["schemas"]["Address"];
      end_address?: components["schemas"]["Address"];
    };
    Contact: {
      name?: string;
      phone_number?: string;
      /** Extra information regarding sender or recipient */
      info?: string;
    };
    Size: {
      weight?: number;
      dimensions?: components["schemas"]["Dimensions"];
    };
    Booking: {
      id: string;
      delivery: {
        address?: components["schemas"]["Address"];
      };
      pickup: {
        address?: components["schemas"]["Address"];
      };
      size?: components["schemas"]["Size"];
    };
    Position: {
      lon: number;
      lat: number;
    };
    Plan: { [key: string]: any };
    Itinerary: {
      transport_id: string;
      route: { [key: string]: any };
      activities: components["schemas"]["Activity"][];
    };
    ApiResponse: {
      code?: number;
      type?: string;
      message?: string;
    };
  };
}

export interface operations {
  get_transports: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json; charset=utf-8": components["schemas"]["Transport"][];
        };
      };
    };
  };
  create_transport: {
    responses: {
      /** Created */
      201: {
        content: {
          "application/json; charset=utf-8": components["schemas"]["Transport"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": {
          capacity: {
            volume: number;
            weight: number;
          };
          earliest_start?: string;
          latest_end?: string;
          metadata?: components["schemas"]["AnyValue"];
          start_address: components["schemas"]["Address"];
          end_address: components["schemas"]["Address"];
        };
      };
    };
  };
  get_itinerary: {
    parameters: {
      path: {
        /** ID of the transport to which the itinerary is assigned */
        transport_id: string;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json; charset=utf-8": components["schemas"]["Itinerary"];
        };
      };
    };
  };
  create_booking: {
    responses: {
      /** Created */
      201: {
        content: {
          "application/json; charset=utf-8": components["schemas"]["Booking"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": {
          pickup: {
            address: components["schemas"]["Address"];
            contact?: components["schemas"]["Contact"];
          };
          delivery: {
            address: components["schemas"]["Address"];
            contact?: components["schemas"]["Contact"];
          };
          size: components["schemas"]["Size"];
          metadata?: components["schemas"]["AnyValue"];
          /** An ID, eg. from PostNord, that correlates this booking to a 3rd party system's ID */
          external_id?: string;
        };
      };
    };
  };
}
