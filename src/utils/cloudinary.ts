const cloudinary = require('cloudinary').v2

/**
 * Delete cloudinary uploaded file
 * @param publicId file public id
 */
const deleteUpload = (publicId: string): Promise<string | null> => {
  return cloudinary.uploader
    .destroy(publicId)
    .then((res: any) => {
      return res.result === 'ok' ? publicId : null
    })
    .catch(() => {
      return null
    })
}

/**
 * Helper function to upload file (graphql 'Upload' scalar) to Cloudinary
 * @param file Upload scalar
 */
const uploadFile = async (file: any) => {
  // The Upload scalar return a promise
  const { createReadStream } = await file
  const fileStream = createReadStream()

  // Return the Cloudinary object when it's all good
  return new Promise((resolve, reject) => {
    const cloudStream = cloudinary.uploader.upload_stream(
      (err: any, fileUploaded: any) => {
        if (err) {
          reject(err)
        }

        resolve(fileUploaded)
      }
    )

    fileStream.pipe(cloudStream)
  })
}

export { deleteUpload, uploadFile }
