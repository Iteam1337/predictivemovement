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

const getSignatures = async () => {
  return new Promise(async (resolve, reject) => {
    let data = ''
    const dataStream = await minioClient.getObject(
      'signatures',
      '2021-03/pmb-zwy5otdi'
    )
    dataStream.on('data', function (chunk) {
      data += chunk
    })
    dataStream.on('error', function (err) {
      console.log(err)
    })
    dataStream.on('end', function () {
      try {
        data = JSON.parse(data)
      } catch (error) {
        reject(error)
      }
      resolve(data)
    })
  })
}

module.exports = {
  saveSignature,
  getSignatures,
}
