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

  /* 
    Right now we have problem with minio if 
    the bucket has less than 2 objects. 
    As a quick fix we populate the bucket with two placeholders to avoid the error. 
    The error has been acknowledged by minio and we are just waiting 
    for the new release, then we can take away this.
    https://github.com/minio/minio-js/issues/886 
  */

  minioClient.putObject(
    bucketName,
    `${moment().format('YYYY-MM')}/placeholder`,
    'placeholder'
  )
  minioClient.putObject(
    bucketName,
    `${moment().format('YYYY-MM')}/placeholderTwo`,
    'placeholderTwo'
  )
}

init()

async function fileExists(bucketName, fileName) {
  try {
    await minioClient.statObject(bucketName, fileName)
    return true
  } catch (e) {
    if (e.name === 'S3Error' && e.message === 'Not Found') {
      return false
    }
    throw e
  }
}

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
  const fileName = `${folder}/${bookingId}`

  // quick fix to not overwrite in storage
  // we still send an event for the receipt though
  if (await fileExists(bucketName, fileName)) {
    return {}
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
  return _(listStream).flatMap(({ name }) => {
    // a fix until Minio releases the new fixes
    if (name.includes('placeholder')) return []
    return _(getObject(bucket, name))
  })
}

module.exports = {
  saveSignature,
  getSignatures,
}
