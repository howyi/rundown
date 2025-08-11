import SimpleDocument from "@/components/shared/simple-document";

const termsContent = `
**Last Updated**: August 11, 2025

These Terms set forth the conditions for using the "rundown" service ("the Service"). Users agree to these Terms before using the Service.

## 1. Service Description

The Service periodically crawls RSS feeds registered by the user, summarizes new or updated articles using AI, and sends notifications according to the user's settings.

## 2. Registration

* An account with an email address and password is required to use the Service.
* Users must provide accurate and up-to-date information.

## 3. Prohibited Activities

Users must not:

* Violate laws or public order
* Infringe upon the rights of others
* Interfere with the operation of the Service
* Cause excessive server load via unauthorized access or excessive requests

## 4. Disclaimer

* The Service provider is not responsible for any damages caused by the use of the Service.
* The Service may change, suspend, or terminate functions without notice.

## 5. Intellectual Property Rights

All copyrights and other intellectual property rights related to the Service belong to the provider or rightful owners.

## 6. Governing Law and Jurisdiction

These Terms are governed by Japanese law. Any disputes related to the Service shall be subject to the exclusive jurisdiction of the court having jurisdiction over the provider's location in the first instance.

`;
export default async function Home() {
	return <SimpleDocument title="Terms of Service" content={termsContent} />;
}
