import * as fs from "fs";
import * as path from "path";
import { InversifyInjector } from "@paperbits/common/injection";
import { IPublisher } from "@paperbits/common/publishing";
import { PublishingNodeModule } from "./publishing";
import { CoreModule } from "@paperbits/core/core.module";
import { StyleModule } from "@paperbits/styles/styles.module";
import { ProseMirrorModule } from "@paperbits/prosemirror/prosemirror.module";
import { StaticSettingsProvider } from "./components/staticSettingsProvider";
import { FileSystemBlobStorage } from "./components/filesystemBlobStorage";
import { ApimPublishModule } from "./apim.publish.module";

/* Reading settings from configuration file */
const configFile = path.resolve(__dirname, "./config.json");
const configuration = JSON.parse(fs.readFileSync(configFile, "utf8").toString());
const settingsProvider = new StaticSettingsProvider(configuration);

/* Storage where the website get published */
const outputBlobStorage = new FileSystemBlobStorage("./dist/website");

/* Initializing dependency injection container */
const injector = new InversifyInjector();
injector.bindModule(new CoreModule());
injector.bindModule(new StyleModule());
injector.bindModule(new ProseMirrorModule());
injector.bindModule(new ApimPublishModule());
injector.bindInstance("settingsProvider", settingsProvider);
injector.bindInstance("outputBlobStorage", outputBlobStorage);
injector.bindModule(new PublishingNodeModule());
injector.resolve("autostart");

/* Allowing self-signed certificates for HTTP requests */
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

/* Bulding dependency injection container */
const publisher = injector.resolve<IPublisher>("sitePublisher");

/* Running actual publishing */
publisher.publish()
    .then(() => {
        console.log("DONE.");
        process.exit();
    })
    .catch((error) => {
        console.log(error);
        process.exit();
    });