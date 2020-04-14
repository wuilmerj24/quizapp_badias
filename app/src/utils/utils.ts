import { LoadingIndicator, Mode, OptionsCommon } from '@nstudio/nativescript-loading-indicator';
const indicator = new LoadingIndicator();
import { SnackBar, SnackBarOptions } from "@nstudio/nativescript-snackbar";
const snackbar = new SnackBar();
var uid_user=null;

export class Utils{
  constructor() {
  }

  setUid(uid) {
    uid_user = uid;
  }

  getUid() {
    return uid_user;
  }

  showLoadingSimple(msj, dtl, color, bgcolor, view) {
    const options = {
      message: msj,
      details: dtl,
      progress: 0.65,
      margin: 0,
      dimBackground: true,
      color: color,
      backgroundColor: bgcolor,
      userInteractionEnabled: false,
      hideBezel: true,
      mode: Mode.Indeterminate,
      android: {
        //view: view,
        cancelable: true,
      },
      ios: {
        //view: view,
        square: false,
      }
    };
    indicator.show(options);
    return indicator;
  }

  showSnackSimple(msj, colortxt, bgcolor) {
    snackbar.simple(msj, colortxt, bgcolor, 3, false).then((args) => {
    });
    return snackbar;
  }

  showSnakcView(msj,colortxt,bgcolor,view){
    const options: SnackBarOptions = {
      actionText:"",
      actionTextColor: bgcolor,
      snackText: msj,
      textColor: colortxt,
      hideDelay: 3500,
      backgroundColor: bgcolor,
      maxLines: 3, // Optional, Android Only
      isRTL: false,
      view: view,// Optional, Android Only, default to topmost().currentPage
    };

    snackbar.action(options).then((args) => {
      if (args.command === "Action") {
        
      } else {
      }
    });
  }

  filterArray(value){
    return value!=null;
  }
}