import * as types from './types'

export enum Severity {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
}

export enum BookingStatuses {
  NEW = 'new',
  ASSIGNED = 'assigned',
  DELIVERED = 'delivered',
  DELIVERY_FAILED = 'delivery_failed',
  PICKED_UP = 'picked_up',
}

export enum TransportStatuses {
  NEW = 'new',
}

export enum EntityTypes {
  TRANSPORT = 'transport',
  BOOKING = 'booking',
}

export enum Events {
  TRANSPORT = 'transport',
  BOOKING = 'booking',
}

export type BookingEvent = {
  type: Events.BOOKING
  id: types.Booking['id']
  event: BookingStatuses
  booking: types.Booking
}

export type TransportEvent = {
  type: Events.TRANSPORT
  id: types.Transport['id']
  event: TransportStatuses
  transport: types.Transport
}

export type BookingNotification = {
  severity: Severity
  entityType: EntityTypes.BOOKING
  event: BookingEvent
  booking: types.Booking
}

export type TransportNotification = {
  severity: Severity
  type: EntityTypes.TRANSPORT
  event: TransportEvent
  transport: types.Transport
}

export type Notification = BookingNotification | TransportNotification
