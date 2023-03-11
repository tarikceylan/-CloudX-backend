# -CloudX- Backend Repository

CloudX: AWS Practitioner for JS #4 Course - Backend Repository

## **Task 5**

### **Task 5. 1**

- [x] **`import-service`**
  - [x] Create `import-service` with its own `serverless.yml` file
  - [x] Create and configure S3 Bucket with a folder called `uploaded`

### **Task 5. 2**

- [x] **Lambda & Configuration**
  - [x] Create a lambda function called `importProductsFile` in `import-service` that is triggered with HTTP `GET` method to `/import` endpoint
  - [x] Implement logic that accepts a query string as file name and returns a Signed URL
  - [x] Update `serverless.yml` with policies to allow lambda to interact with S3
  - [x] Integrate `importProductsFile` with FE

### **Task 5. 3**

- [x] **`importFileParser Lambda`**
  - [x] Create `importFileParser` function
  - [x] Configure `serverless.yml`
  - [x] Configure the event to be fired when `uploaded` folder changes
  - [x] Parse data using readable stream `csv-parser` and log in CloudWatch
