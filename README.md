# **TO-DO LIST API**

**A simple task list manager api using typescript, dynamodb and serverless framework**
<br>
<br>

## Requirements

[Node.js](https://nodejs.org/en) (Tested with version 18.14)
<br>
[AWS CLI](https://aws.amazon.com/cli/)
<br>
An **AWS IAM** user and their credentials with all required permissions
<br>
A Github Account
<br>
<br>

## CI/CD

The project has two workflows, **CI** and **CD**. CI will run on every pull request for the development branch, checking Lint and Unit tests. The CD will run and deploy all changes to be deployed on the respective branch, **develop** for the development environment and **main** for the production environment. AWS credentials **(AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY)** need to be set in the repository secrets for correct operation.
<br>
<br>

## Set up cloud environment

With your AWS credentials (AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY) setted up.
<br>
1: Install dependencies:

```console
npm install
```

2: Run tests:

```console
npm run test
```

3: Deploy using serverless framework:

```console
serverless deploy --stage <stage name> --verbose
```

4: After finishing, you can destroy all resources created with:

```console
serverless remove --stage <stage name>
```
