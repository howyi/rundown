import SimpleDocument from "@/components/shared/simple-document";

const termsContent = `
**Last Updated**: August 11, 2025

This Privacy Policy explains how the "rundown" service ("the Service") handles user personal information and other data.

## 1. Information We Collect

The Service may collect the following information:

* Email address and password entered during user registration
* URLs of RSS feeds registered by the user
* Settings for summarization and notifications (language, summary length, custom instructions, etc.)
* Discord Webhook URL (if provided)
* Service usage data (access logs, error logs, etc.)

## 2. Purpose of Use

Collected information will be used for the following purposes:

* Monitoring RSS feeds and generating summaries
* Sending notifications via Discord or other means
* Operating, maintaining, and improving the Service
* Preventing misuse and ensuring security

## 3. Provision to Third Parties

Collected information will not be provided to third parties except in the following cases:

* With the user's consent
* When required by law
* When necessary for business operations and provided to contractors

## 4. Use of External Services

The Service uses the following external services:

* OpenAI API (for summarization)
* Discord Webhook (for notifications)
  Use of these external services is subject to their respective privacy policies.

## 5. Security Measures

Collected information is protected through appropriate security measures.

## 6. Revisions

This policy may be updated as necessary.`;
export default async function Home() {
	return <SimpleDocument title="Privacy Policy" content={termsContent} />;
}
