import { fromObject } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
let listView;
let closeCallback;

export function onShownModally(args){
  const context = args.context;
  closeCallback = args.closeCallback;
  const page: Page = <Page>args.object;
  listView = page.getViewById("listView");
  page.bindingContext = fromObject(context);
}

export function cancelar(args){
  closeCallback({code_error:null});
}

export function onItemSelected(args) {
  const selectedItems = listView.getSelectedItems();
  let selectedTitles = "Selected items: ";
  for (let i = 0; i < selectedItems.length; i++) {
    selectedTitles += selectedItems[i].itemName;
    console.log(JSON.stringify(selectedItems[i]));
    closeCallback({ code_error: 0, data: selectedItems[i]});
    if (i < selectedItems.length - 1) {
      selectedTitles += ", ";
    }
  }
}

export function onItemDeselected(args) {
  const selectedItems = listView.getSelectedItems();
  let selectedTitles = "Selected items: ";
  for (let i = 0; i < selectedItems.length; i++) {
    selectedTitles += selectedItems[i].itemName;

    if (i < selectedItems.length - 1) {
      selectedTitles += ", ";
    }
  }

}