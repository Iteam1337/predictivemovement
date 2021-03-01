const endPoint = process.env.MINIO_URL || 'localhost'
const port = parseInt(process.env.MINIO_PORT, 10) || 9000
const accessKey = process.env.MINIO_USER || 'minioadmin'
const secretKey = process.env.MINIO_PASSWORD || 'minioadmin'
const useSSL = port === 443
const Minio = require('minio')
const moment = require('moment')
const _ = require('highland')

const minioClient = new Minio.Client({
  endPoint,
  port,
  useSSL,
  accessKey,
  secretKey,
})

async function saveSignature({
  createdAt,
  signedBy,
  bookingId,
  transportId,
  receipt,
  type,
}) {
  const bucketName = 'signatures'
  const folder = moment().format('YYYY-MM')
  if (!(await minioClient.bucketExists(bucketName))) {
    await minioClient.makeBucket(bucketName)
  }

  const signature = JSON.stringify(
    {
      createdAt,
      signedBy,
      bookingId,
      transportId,
      receipt,
      type,
    },
    null,
    2
  )

  return minioClient.putObject(
    bucketName,
    `${folder}/${bookingId}`,
    signature,
    { 'Content-Type': 'application/json' }
  )
}

const getSignature = async () => {
  let data = ''
  let test = ''
  const dataStream = await minioClient.getObject(
    'signatures',
    '2021-03/pmb-owfhyzm3'
  )

  return _(dataStream)
    .each((data) => JSON.parse(data).receipt)
    .errors(console.error)

  // return dataStream.then((data) => JSON.parse(data).receipt)
}

module.exports = {
  saveSignature,
  getSignature,
}
