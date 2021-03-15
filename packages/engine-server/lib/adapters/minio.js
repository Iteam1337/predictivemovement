const endPoint = process.env.MINIO_HOST || 'localhost'
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

async function init() {
  const bucketName = 'signatures'
  if (!(await minioClient.bucketExists(bucketName))) {
    await minioClient.makeBucket(bucketName)
  }
}

init()

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

function getObject(bucket, name) {
  return new Promise(async (resolve, reject) => {
    const stream = await minioClient.getObject(bucket, name)
    let chunks = ''
    stream.on('data', (data) => {
      chunks += data.toString()
    })
    stream.on('end', () => {
      resolve(JSON.parse(chunks))
    })
    stream.on('error', reject)
  })
}

function getSignatures() {
  const bucket = 'signatures'
  const listStream = minioClient.listObjects(bucket, '', true)
  return _(listStream).flatMap(({ name }) => _(getObject(bucket, name)))
}

module.exports = {
  saveSignature,
  getSignatures,
}
