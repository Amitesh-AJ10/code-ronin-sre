// check_credentials.js
require('dotenv').config(); // Load environment variables from .env

const { BedrockClient, ListFoundationModelsCommand } = require('@aws-sdk/client-bedrock');

async function checkBedrockCredentials() {
    console.log("Attempting to connect to AWS Bedrock...");

    const awsRegion = process.env.AWS_REGION;
    const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!awsRegion || !awsAccessKeyId || !awsSecretAccessKey) {
        console.error("ERROR: Missing AWS credentials in .env file.");
        console.error("Please ensure AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY are set.");
        return;
    }

    const client = new BedrockClient({
        region: awsRegion,
        credentials: {
            accessKeyId: awsAccessKeyId,
            secretAccessKey: awsSecretAccessKey,
        },
    });

    try {
        const command = new ListFoundationModelsCommand({});
        const response = await client.send(command);

        console.log("\n✅ SUCCESS: Successfully connected to AWS Bedrock!");
        console.log(`Found ${response.modelSummaries.length} foundation models.`);
        console.log("Your credentials appear to be working correctly for Bedrock service access.");

    } catch (error) {
        console.error("\n❌ ERROR: Failed to connect to AWS Bedrock.");
        console.error("Please check the following:");
        console.error(`- AWS_REGION: "${awsRegion}" (Is this correct?)`);
        console.error("- AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY (Are they correct and active?)");
        console.error("- IAM Permissions: Does your IAM user/role have 'bedrock:ListFoundationModels' permission?");
        console.error("Full error details:", error);
    }
}

checkBedrockCredentials();