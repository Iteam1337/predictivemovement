export interface SignParcelValues {
  type: string
  bookingId: string
  transportId: string
  receipt: {
    base64Signature: string
  }
  signedBy: string
  createdAt: Date
}
