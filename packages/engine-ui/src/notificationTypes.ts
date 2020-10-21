import * as types from './types'

export enum BookingStatus {
  NEW = 'new',
  ASSIGNED = 'assigned',
  DELIVERED = 'delivered',
  DELIVERY_FAILED = 'delivery_failed',
  PICKED_UP = 'picked_up',
}

export enum TransportStatus {
  NEW = 'new',
}

export enum EntityType {
  TRANSPORT = 'transport',
  BOOKING = 'booking',
}

export enum Severity {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
}

export enum Events {
  TRANSPORT = 'transport',
  BOOKING = 'booking',
}

export type BookingEvent = {
  id: types.Booking['id']
  status: BookingStatus
}

export type TransportEvent = {
  id: types.Transport['id']
  status: TransportStatus
}

export type BookingNotification = {
  severity: Severity
  type: EntityType.BOOKING
  event: BookingEvent
  booking: types.Booking
}

export type TransportNotification = {
  severity: Severity
  type: EntityType.TRANSPORT
  event: TransportEvent
  transport: types.Transport
}

export type Notification = BookingNotification | TransportNotification
