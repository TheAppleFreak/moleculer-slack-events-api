# moleculer-slack-events-api

# NOTE: This package is no longer maintained and may break as Slack updates their platform.

This is a very simple Moleculer service to work with the Slack events API. It implements the bare minimum of functionality present within the [Node Slack Events API package](https://github.com/slackapi/node-slack-events-api/), except instead of using its own server and event emitter it uses the [Moleculer API gateway](https://github.com/moleculer/moleculer-web). 

## How to use

If you're using this in a project, import the module into your file and include it as a mixin in your own service. 

* **Don't forget the settings** - There are two settings that you have to ensure are set: `port` and `verificationToken`. While the port defaults to `8080` if not set, you'll have to supply the verification token yourself.
* **Route handlers not included** - This service doesn't include any predefined route handlers, as everyone has different requirements when it comes to their own routing situations. As such, you will need to set up your own route handler. Make sure that your route points to the `receiveEvent` service. The sample configuration below should be a good starting point. 

```javascript
const { ServiceBroker } = require("moleculer");
const SlackEventsService = require("moleculer-slack-events-api");

const broker = new ServiceBroker();
broker.createService({
    name: "yourServiceNameHere",
    mixins: [SlackEventsService],
    settings: {
        port: 8080,
        verificationToken: "yourVerificationTokenHere",
        routes: [{
            aliases: {
                "POST /slack/events": "yourServiceNameHere.receiveEvent"
            },
            bodyParsers: {
                json: true,
                urlencoded: {extended: true}
            },
            mappingPolicy: "restrict"
        }]
    }
});
```

## How to develop

This service uses TypeScript under the hood. A few things to note about this: 

* To compile, just run `tsc` from the command line. Nothing serious.
* Because of how peer dependencies work, you likely won't have an installation of Moleculer when you just run `npm install`/`yarn` by default. This will mean that there will be a lot of typing errors that aren't real. 
* As of this writing, running `tsc` will result in an error being printed to console. This is a bug in an upstream package and doesn't affect compilation at all.