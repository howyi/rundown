/** biome-ignore-all lint/suspicious/noExplicitAny: TODO */
/** biome-ignore-all lint/style/noNonNullAssertion: TODO */
import crypto from "node:crypto";
import querystring from "node:querystring";
import type {
	App,
	Installation,
	Receiver,
	ReceiverDispatchErrorHandlerArgs,
	ReceiverEvent,
	ReceiverProcessEventErrorHandlerArgs,
	ReceiverUnhandledRequestHandlerArgs,
} from "@slack/bolt";
import { verifyRedirectOpts } from "@slack/bolt/dist/receivers/verify-redirect-opts";
import { ConsoleLogger, type Logger, LogLevel } from "@slack/logger";
import {
	type CallbackOptions,
	type InstallPathOptions,
	InstallProvider,
	type InstallProviderOptions,
	type InstallURLOptions,
	type OAuthV2Response,
} from "@slack/oauth";
import { WebClient } from "@slack/web-api";
import { fromNodeHeaders } from "better-auth/node";
import { type NextRequest, NextResponse } from "next/server";
import tsscmp from "tsscmp";
import { auth } from "@/lib/auth";

// TODO: we throw away the key names for endpoints, so maybe we should use this interface. is it better for migrations?
// if that's the reason, let's document that with a comment.
export interface NextRouteHandlerReceiverOptions {
	signingSecret: string;
	logger?: Logger;
	logLevel?: LogLevel;
	endpoint?: string;
	signatureVerification?: boolean;
	processBeforeResponse?: boolean;
	clientId?: string;
	clientSecret?: string;
	stateSecret?: InstallProviderOptions["stateSecret"];
	redirectUri?: string;
	oauthRedirectPath?: string;
	installPath?: string;
	eventPath?: string;
	loginRedirectUri?: string;
	installationStore?: InstallProviderOptions["installationStore"];
	scopes?: InstallURLOptions["scopes"];
	installerOptions?: InstallerOptions;
	dispatchErrorHandler?: (
		args: ReceiverDispatchErrorHandlerArgs,
	) => Promise<void>;
	processEventErrorHandler?: (
		args: ReceiverProcessEventErrorHandlerArgs,
	) => Promise<boolean>;
	unhandledRequestHandler?: (args: ReceiverUnhandledRequestHandlerArgs) => void;
	unhandledRequestTimeoutMillis?: number;
}

// Additional Installer Options
interface InstallerOptions {
	stateStore?: InstallProviderOptions["stateStore"]; // default ClearStateStore
	stateVerification?: InstallProviderOptions["stateVerification"]; // defaults true
	legacyStateVerification?: InstallProviderOptions["legacyStateVerification"];
	stateCookieName?: InstallProviderOptions["stateCookieName"];
	stateCookieExpirationSeconds?: InstallProviderOptions["stateCookieExpirationSeconds"];
	authVersion?: InstallProviderOptions["authVersion"]; // default 'v2'
	metadata?: InstallURLOptions["metadata"];
	installPath?: string;
	directInstall?: InstallProviderOptions["directInstall"]; // see https://api.slack.com/start/distributing/directory#direct_install
	renderHtmlForInstallPath?: InstallProviderOptions["renderHtmlForInstallPath"];
	redirectUriPath?: string;
	installPathOptions?: InstallPathOptions;
	callbackOptions?: CallbackOptions;
	userScopes?: InstallURLOptions["userScopes"];
	clientOptions?: InstallProviderOptions["clientOptions"];
	authorizationUrl?: InstallProviderOptions["authorizationUrl"];
}

export type RouteHandler<T extends RouteHandlerContext> = (
	req: NextRequest,
	context: T,
) => Promise<NextResponse>;
export type RouteHandlerContext = {
	params: Promise<{ [key in string]: string[] }>;
};
type SlackRouteHandlerContext = { params: Promise<{ slug: string[] }> };

/*
 * Receiver implementation for Next.js Route Handlers
 */
export default class NextRouteHandlerReceiver implements Receiver {
	private signingSecret: string;

	private app?: App;

	private logger: Logger;

	public installer: InstallProvider | undefined = undefined;

	public installerOptions?: InstallerOptions;

	public installUrlOptions?: any;

	public scopes?: InstallURLOptions["scopes"];

	public loginRedirectUri?: string;

	public oauthRedirectPath?: string;

	public installPath?: string;

	public eventPath?: string;

	public constructor({
		signingSecret,
		logger = undefined,
		logLevel = LogLevel.INFO,
		clientId = undefined,
		clientSecret = undefined,
		stateSecret = undefined,
		redirectUri = undefined,
		loginRedirectUri = undefined,
		oauthRedirectPath = "/oauth_redirect",
		installPath = "/install",
		eventPath = "/events",
		installationStore = undefined,
		installerOptions = {},
		scopes = undefined,
	}: NextRouteHandlerReceiverOptions) {
		this.signingSecret = signingSecret;
		this.logger =
			logger ??
			(() => {
				const defaultLogger = new ConsoleLogger();
				defaultLogger.setLevel(logLevel);
				return defaultLogger;
			})();
		this.scopes = scopes;
		this.installerOptions = installerOptions;
		this.loginRedirectUri = loginRedirectUri;
		this.oauthRedirectPath = oauthRedirectPath;
		this.installPath = installPath;
		this.eventPath = eventPath;

		verifyRedirectOpts({
			redirectUri,
			redirectUriPath: installerOptions.redirectUriPath,
		});

		if (
			clientId !== undefined &&
			clientSecret !== undefined &&
			(installerOptions?.stateVerification === false || // state store not needed
				stateSecret !== undefined ||
				installerOptions.stateStore !== undefined) // user provided state store
		) {
			this.installer = new InstallProvider({
				clientId,
				clientSecret,
				stateSecret,
				installationStore,
				logLevel,
				logger, // pass logger that was passed in constructor, not one created locally
				directInstall: installerOptions.directInstall,
				stateStore: installerOptions.stateStore,
				stateVerification: installerOptions.stateVerification,
				legacyStateVerification: installerOptions.legacyStateVerification,
				stateCookieName: installerOptions.stateCookieName,
				stateCookieExpirationSeconds:
					installerOptions.stateCookieExpirationSeconds,
				renderHtmlForInstallPath: installerOptions.renderHtmlForInstallPath,
				authVersion: installerOptions.authVersion ?? "v2",
				clientOptions: installerOptions.clientOptions,
				authorizationUrl: installerOptions.authorizationUrl,
			});
		}
		// create install url options
		this.installUrlOptions = {
			metadata: installerOptions.metadata,
			scopes: scopes ?? [],
			userScopes: installerOptions.userScopes,
			redirectUri,
		};
	}

	public init(app: App): void {
		this.app = app;
	}

	public start(): Promise<RouteHandler<SlackRouteHandlerContext>> {
		return new Promise((resolve, reject) => {
			try {
				const handler = this.toHandler();
				resolve(handler);
			} catch (error) {
				reject(error);
			}
		});
	}

	// eslint-disable-next-line class-methods-use-this
	public stop(..._args: any[]): Promise<void> {
		return new Promise((resolve, _reject) => {
			resolve();
		});
	}

	public toHandler(): RouteHandler<SlackRouteHandlerContext> {
		return async (req, context) => {
			const params = await context.params;
			const path = `/${params.slug.join("/")}`;
			const method = req.method;
			const query = Object.fromEntries(req.nextUrl.searchParams);
			const rawBody = await req.text();

			if (
				this.installer &&
				method === "GET" &&
				path === this.oauthRedirectPath
			) {
				const web = new WebClient();
				const v2Resp = (await web.oauth.v2.access({
					code: query.code!,
					client_id: process.env.SLACK_CLIENT_ID!,
					client_secret: process.env.SLACK_CLIENT_SECRET!,
					redirect_uri: this.installUrlOptions.redirectUri,
				})) as OAuthV2Response;
				const v2Installation: Installation<"v2", boolean> = {
					team: v2Resp.team === null ? undefined : v2Resp.team!,
					enterprise: v2Resp.enterprise == null ? undefined : v2Resp.enterprise,
					user: {
						token: v2Resp.authed_user.access_token,
						scopes: v2Resp.authed_user.scope?.split(","),
						id: v2Resp.authed_user.id,
					},
					tokenType: v2Resp.token_type,
					isEnterpriseInstall: v2Resp.is_enterprise_install,
					appId: v2Resp.app_id,

					// synthesized properties
					authVersion: "v2",
				};
				const currentUTC = Math.floor(Date.now() / 1000); // utc, seconds

				// Installation has Bot Token
				if (
					v2Resp.access_token !== undefined &&
					v2Resp.scope !== undefined &&
					v2Resp.bot_user_id !== undefined
				) {
					const testClient = new WebClient(
						v2Resp.access_token,
						this.installerOptions?.clientOptions,
					);
					const authResult = await testClient.auth.test();
					v2Installation.bot = {
						scopes: v2Resp.scope.split(","),
						token: v2Resp.access_token,
						userId: v2Resp.bot_user_id,
						id: authResult.bot_id as string,
					};

					if (v2Resp.is_enterprise_install) {
						v2Installation.enterpriseUrl = authResult.url;
					}

					// Token Rotation is Enabled
					if (
						v2Resp.refresh_token !== undefined &&
						v2Resp.expires_in !== undefined
					) {
						v2Installation.bot.refreshToken = v2Resp.refresh_token;
						v2Installation.bot.expiresAt = currentUTC + v2Resp.expires_in; // utc, seconds
					}
				}

				// Installation has User Token
				if (
					v2Resp.authed_user !== undefined &&
					v2Resp.authed_user.access_token !== undefined
				) {
					if (
						v2Resp.is_enterprise_install &&
						v2Installation.enterpriseUrl === undefined
					) {
						const testClient = new WebClient(
							v2Resp.authed_user.access_token,
							this.installerOptions?.clientOptions,
						);
						const authResult = await testClient.auth.test();
						v2Installation.enterpriseUrl = authResult.url;
					}

					// Token Rotation is Enabled
					if (
						v2Resp.authed_user.refresh_token !== undefined &&
						v2Resp.authed_user.expires_in !== undefined
					) {
						v2Installation.user.refreshToken = v2Resp.authed_user.refresh_token;
						v2Installation.user.expiresAt =
							currentUTC + v2Resp.authed_user.expires_in; // utc, seconds
					}
				}

				if (v2Resp.incoming_webhook !== undefined) {
					v2Installation.incomingWebhook = {
						url: v2Resp.incoming_webhook.url,
						channel: v2Resp.incoming_webhook.channel,
						channelId: v2Resp.incoming_webhook.channel_id,
						configurationUrl: v2Resp.incoming_webhook.configuration_url,
					};
				}

				if (this.installerOptions) {
					// better-auth integration
					const headersObj: Record<string, string> = {};
					req.headers.forEach((value, key) => {
						headersObj[key] = value;
					});
					const session = await auth.api.getSession({
						headers: fromNodeHeaders(headersObj),
					});
					console.log("Session:", session);
					// Pass the metadata in state parameter if exists.
					// Developers can use the value for additional/custom data associated with the installation.

					if (!session || !session.user.id) {
						throw new Error("User not authenticated");
					}
					if (session.session.activeOrganizationId) {
						v2Installation.metadata = `o_${session.session.activeOrganizationId}`;
					} else {
						v2Installation.metadata = session?.user?.id;
					}
				}
				await this.installer.installationStore.storeInstallation(
					v2Installation,
					this.logger,
				);
				return NextResponse.redirect(this.loginRedirectUri!);
			}

			if (this.installer && method === "GET" && path === this.installPath) {
				const url = await this.installer.generateInstallUrl({
					userScopes: this.installerOptions?.userScopes,
					scopes: this.scopes ?? [],
					redirectUri: this.installUrlOptions.redirectUri,
				});
				console.log("Generated install URL:", url);
				return NextResponse.redirect(url);
			}

			if (path === this.eventPath) {
				const body = this.parseRequestBody(
					rawBody,
					req.headers.get("content-type")!,
					this.logger,
				);

				console.log(path, method, query, body);

				// ssl_check (for Slash Commands)
				if (method === "POST" && body && body.ssl_check) {
					return NextResponse.json({}, { status: 200 });
				}

				// request signature verification
				const signature = req.headers.get("X-Slack-Signature")!;
				const ts = Number(req.headers.get("X-Slack-Request-Timestamp"));
				if (
					!this.isValidRequestSignature(
						this.signingSecret,
						rawBody,
						signature,
						ts,
					)
				) {
					this.logger.info(
						`Invalid request signature detected (X-Slack-Signature: ${signature}, X-Slack-Request-Timestamp: ${ts})`,
					);
					return NextResponse.json({}, { status: 401 });
				}

				// url_verification (Events API)
				if (
					typeof body !== "undefined" &&
					body != null &&
					typeof body.type !== "undefined" &&
					body.type != null &&
					body.type === "url_verification"
				) {
					return NextResponse.json({ challenge: body.challenge });
				}

				// Structure the ReceiverEvent
				let storedResponse: any;
				const event: ReceiverEvent = {
					body,
					ack: async (response) => {
						if (typeof response === "undefined" || response == null) {
							storedResponse = "";
						} else {
							storedResponse = response;
						}
					},
					retryNum: req.headers.get("X-Slack-Retry-Num") as unknown as
						| number
						| undefined,
					retryReason: req.headers.get("X-Slack-Retry-Reason")!,
				};

				try {
					// this.logger.warn(event)
					// this.logger.warn(this.app)
					await this.app?.processEvent(event);
					console.log("storedResponse", storedResponse);
					if (storedResponse !== undefined) {
						if (typeof storedResponse === "string") {
							return new NextResponse(storedResponse, { status: 200 });
						}
						return NextResponse.json(storedResponse, { status: 200 });
					}
					return new NextResponse("", { status: 200 });
				} catch (err) {
					this.logger.error(
						"An unhandled error occurred while Bolt processed an event",
					);
					this.logger.debug(
						`Error details: ${err}, storedResponse: ${storedResponse}`,
					);
					return NextResponse.json(
						{ body: "Internal server error" },
						{ status: 500 },
					);
				}
			}
			this.logger.info(`No request handler matched the request: ${path}`);
			return NextResponse.json({}, { status: 404 });
		};
	}

	// eslint-disable-next-line class-methods-use-this
	private parseRequestBody(
		stringBody: string,
		contentType: string | undefined,
		logger: Logger,
	): any {
		if (stringBody === "" || stringBody === undefined) {
			return {};
		}
		if (contentType === "application/x-www-form-urlencoded") {
			const parsedBody = querystring.parse(stringBody);
			if (typeof parsedBody.payload === "string") {
				return JSON.parse(parsedBody.payload);
			}
			return parsedBody;
		}
		if (contentType === "application/json") {
			return JSON.parse(stringBody);
		}

		logger.warn(`Unexpected content-type detected: ${contentType}`);
		try {
			// Parse this body anyway
			return JSON.parse(stringBody);
		} catch (e) {
			logger.error(
				`Failed to parse body as JSON data for content-type: ${contentType}`,
			);
			throw e;
		}
	}

	// eslint-disable-next-line class-methods-use-this
	private isValidRequestSignature(
		signingSecret: string,
		body: string,
		signature: string,
		requestTimestamp: number,
	): boolean {
		if (!signature || !requestTimestamp) {
			return false;
		}

		// Divide current date to match Slack ts format
		// Subtract 5 minutes from current time
		const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;
		if (requestTimestamp < fiveMinutesAgo) {
			return false;
		}

		const hmac = crypto.createHmac("sha256", signingSecret);
		const [version, hash] = signature.split("=");
		hmac.update(`${version}:${requestTimestamp}:${body}`);
		if (!tsscmp(hash, hmac.digest("hex"))) {
			return false;
		}

		return true;
	}
}
