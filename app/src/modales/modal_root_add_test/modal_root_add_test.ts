import { Observable, EventData, fromObject } from "tns-core-modules/data/observable";
import { Frame, View } from "tns-core-modules/ui/frame";
import * as app from "tns-core-modules/application";

export function onPageLoaded(args) {
  const currentFrame = Frame.getFrameById("modal_root_add_test");
  const page = args.object;
  const context = args.context;
  page.bindingContext = fromObject(context);
  currentFrame.bindingContext = fromObject(context);
}