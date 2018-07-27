"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const moleculer_1 = require("moleculer");
const ApiService = tslib_1.__importStar(require("moleculer-web"));
const util_1 = require("./util");
const errorCodes = {
    NO_BODY_PARSER: 'MOLECULERSLACKEVENTS_NO_BODY_PARSER',
    TOKEN_VERIFICATION_FAILURE: 'MOLECULERSLACKEVENTS_TOKEN_VERIFICATION_FAILURE',
};
const responseStatuses = {
    OK: 200,
    FAILURE: 500,
    REDIRECT: 302
};
class SlackEventsService extends moleculer_1.Service {
    constructor(broker) {
        super(broker);
        this.parseServiceSchema({
            name: "slack-events",
            version: 1,
            mixins: [ApiService],
            actions: {
                receiveEvent: {
                    name: "receiveEvent",
                    handler: this.receiveEvent
                }
            },
            settings: {
                port: 8080,
                verificationToken: ""
            }
        });
    }
    async receiveEvent(ctx) {
        // Set response headers
        ctx.meta.$responseHeaders = {
            "X-Slack-Powered-By": util_1.packageIdentifier()
        };
        // URL verification challenge
        if (ctx.params.type === "url_verification") {
            this.logger.debug("Handling URL verification");
            if (ctx.params.token !== this.settings.verificationToken) {
                this.logger.debug("URL verification failure");
                const error = new moleculer_1.Errors.MoleculerError("Slack event challenge failed");
                error.name = errorCodes.TOKEN_VERIFICATION_FAILURE;
                error.data = ctx.params;
                ctx.meta.$statusCode = responseStatuses.FAILURE;
                throw error;
            }
            this.logger.debug("URL verification success");
            return ctx.params.challenge;
        }
        // Request token verification
        if (!ctx.params.token || ctx.params.token !== this.settings.verificationToken) {
            this.logger.debug("Request token verification failure");
            const error = new moleculer_1.Errors.MoleculerError("Slack event verification failed");
            error.name = errorCodes.TOKEN_VERIFICATION_FAILURE;
            error.data = ctx.params;
            ctx.meta.$statusCode = responseStatuses.FAILURE;
            throw error;
        }
        this.logger.debug("Request token verification success");
        this.broker.emit(`${this.name}.${ctx.params.event.type}`, ctx.params);
    }
}
module.exports = SlackEventsService;
