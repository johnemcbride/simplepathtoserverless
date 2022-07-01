const s3 = require("@aws-sdk/client-s3");
const sts = require("@aws-sdk/client-sts");



const client = new s3.S3Client({
    region: "eu-west-2",
    endpoint: 'http://127.0.0.1:4566',
    "forcePathStyle": true
});


// const proxy = require("node-global-proxy").default;
// proxy.setConfig({
//     http: "http://localhost:8080",
//     https: "https://localhost:8080",
// });
// proxy.start();


describe('Simple Tests For LocalStack S3 API!', () => {
    test('Initially there are no buckets', async () => {


        // async/await.
        try {
            const data = await client.send(new s3.ListBucketsCommand({}));
            expect(data.Buckets.length).toBe(0)
        } catch (error) {

            throw new Error(error);
        }
    });
    test('Create a bucket', async () => {

        try {
            const data = await client.send(new s3.CreateBucketCommand({ Bucket: 'test' }));
            expect(data['$metadata'].httpStatusCode).toBe(200)

        } catch (error) {
            throw new Error(error);
        }
    });
    test('Check bucket now exists', async () => {
        try {
            const data = await client.send(new s3.ListBucketsCommand({}));
            expect(data.Buckets.length).toBe(1)
            expect(data.Buckets[0].Name).toBe('test')
        } catch (error) {

            throw new Error(error);
        }
    })
    test('Upload a file', async () => {
        try {
            const data = await client.send(new s3.PutObjectCommand(
                {
                    'Bucket': 'test',
                    'Key': 'testfile',
                    'Body': ''
                }));
            expect(data['$metadata'].httpStatusCode).toBe(200)
        } catch (error) {

            throw new Error(error);
        }
    })

    test('Do a bucket listing and confirm contains testfile', async () => {
        try {
            const data = await client.send(new s3.ListObjectsCommand(
                {
                    'Bucket': 'test'
                }));
            expect(data['Contents'].length).toBe(1)
            expect(data['Contents'][0].Key).toBe('testfile')
        } catch (error) {

            throw new Error(error);
        }
    })

    test('Try to delete bucket - should fail as not empty', async () => {
        try {
            const data = await client.send(new s3.DeleteBucketCommand(
                {
                    'Bucket': 'test'
                }));

        } catch (error) {

            expect(error['$metadata'].httpStatusCode).toBe(409)
            expect(error['Code']).toBe('BucketNotEmpty')

        }
    })

    test('Empty bucket', async () => {
        try {
            const data = await client.send(new s3.DeleteObjectCommand(
                {
                    'Bucket': 'test',
                    'Key': 'testfile'
                }));

            expect(data['$metadata'].httpStatusCode).toBe(204)

        }
        catch (error) {

            throw new Error();

        }
    })



    test('Do a bucket listing and confirm empty', async () => {
        try {
            const data = await client.send(new s3.ListObjectsCommand(
                {
                    'Bucket': 'test'
                }));
            expect(data['Contents']).toBeFalsy()
        } catch (error) {

            throw new Error(error);
        }
    })
    test('Delete bucket', async () => {
        try {
            const data = await client.send(new s3.DeleteBucketCommand(
                {
                    'Bucket': 'test'
                }));

            expect(data['$metadata'].httpStatusCode).toBe(204)

        }
        catch (error) {

            throw new Error(error)

        }
    })

    test('Confirm  there are no buckets', async () => {

        try {
            const data = await client.send(new s3.ListBucketsCommand({}));
            expect(data.Buckets.length).toBe(0)
        } catch (error) {

            throw new Error(error);
        }
    });

})

