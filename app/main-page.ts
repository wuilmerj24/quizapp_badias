import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { MainViewModel } from "./main-view-model";

export function onLoaded(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new MainViewModel();
}
