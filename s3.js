require('dotenv').config();
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

const bucketName = AWS_BUCKET_NAME= "awsimagebucket1"
const region = AWS_BUCKET_REGION="us-east-2"
const accessKeyId= AWS_ACCESS_KEY="AKIA6BHXPKUZUOF7QTEE"
const secretAccessKey = AWS_SECRET_KEY="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"

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

function uploadFile(file,userKey){
    const fileStream = fs.createReadStream(file.path)
    const uploadParams = {
        Bucket:bucketName,
        Body:fileStream,
        Key:userKey 
        // Key:file.filename 
    }
    return s3.upload(uploadParams).promise();
}
function deleteFile(Name){
    const deleteParams = {
        Bucket:bucketName,
        Key:Name
    }
    return s3.deleteObject(deleteParams).promise()
}
function getFileStream(userKey){
    const downloadParams={
        Key:userKey,
        Bucket:bucketName
    }
    return s3.getObject(downloadParams).createReadStream()
}
async function getKey(userKey){
    const params={
        Key:userKey,
        Bucket:bucketName
    }
    try {
        await s3.headObject(params).promise();
        return true
        // Do stuff with signedUrl
      } catch (error) {
        return false
      }
    return false

}
exports.deleteFile = deleteFile;
exports.uploadFile = uploadFile;
exports.getFileStream = getFileStream;
exports.getKey = getKey;