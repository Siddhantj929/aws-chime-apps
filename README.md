# Chime SDK Base application - Webfixerr

## How to setup

The following steps show you how to create an AWS Cloud9 environment, download the Amazon Chime SDK, and build the sample application.

1. Create a Git repository for this code.
2. Log into your AWS account with an IAM role that has the AdministratorAccess policy.
3. Use the us-east-1 (N. Virginia) region of your AWS account. You can use any AWS region that is supported by AWS Cloud9.
4. Go to the AWS Cloud9 Dashboard.
5. Press Create environment.
6. Enter “chime-meeting-sdk” for the Name and press Next step.
7. Leave the default Environment settings and press Next step.
8. On the Review page, press Create environment.
9. Wait for the environment to start.
10. In the bash terminal, enter the following commands (substituting unique names for <my-bucket> and <my-stack-name>):

```console
git clone <git-repo-url>
cd amazon-chime-sdk-js/demos/serverless/
node ./deploy.js -r us-east-1 -b <my-bucket> -s <my-stack-name> -a meeting
```

The script deploys the meeting demo application and provides an API endpoint URL. Open the URL in a new window to see the application.

## Details

You will see the crux of this application inside `demos/serverless/src/handler.js` which handles all the requests.

Another big component of the application is inside `demos/browser/app/meetingV2/meetingV2.ts` which uses the pre-built Chime components and import them from the base `/build/` folder.

**Note:** Please do not edit the code in the base `/src/` folder. This code has been implemented after extensive testing and is important for the basic functionality setup. Any changes in the application should start from `demos/serverless/src/handler.js`.
