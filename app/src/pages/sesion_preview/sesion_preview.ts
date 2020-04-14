import { SesionPreviewViewModel} from './sesion_preview_view_model';
import * as app from "tns-core-modules/application";

export function onLoaded(args){
  const page = args.object;
  page.bindingContext = new SesionPreviewViewModel();
}

export function continuar(args){
  var navigationOptions = {
    moduleName: './src/pages/side_menu/side_menu',
    navigationTransition: {
      duration: 2000,
      curve: "linear",
      name: "flipRight"
    },
    transition: {
      name: "fade"
    },
    animated: true,
  }
  app._resetRootView(navigationOptions);  
}