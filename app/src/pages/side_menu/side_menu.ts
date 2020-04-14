import { SideMenuModel} from './side_menu_view_model';
import * as app from "tns-core-modules/application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Frame, View, EventData } from "tns-core-modules/ui/frame";
import { GridLayout } from 'tns-core-modules/ui';

let drawerComponent=null; 

export function onLoaded(args) {
  const page = args.object;
  page.bindingContext = new SideMenuModel();
  drawerComponent = args.object;
  drawerComponent.bindingContext = new SideMenuModel();
  //drawerComponent.showDrawer();
}

export function onNavigationItemTap(args: EventData): void {
  const component = <GridLayout>args.object;
  const componentRoute = component.get("route");
  const componentTitle = component.get("title");
  const bindingContext = <SideMenuModel>component.bindingContext;

  bindingContext.selectedPage = componentTitle;
  Frame.topmost().navigate({
    moduleName: componentRoute,
    animated: true,
    backstackVisible: false,
    transition: {
      name: "fade",
    }
  });

  drawerComponent.closeDrawer();
}