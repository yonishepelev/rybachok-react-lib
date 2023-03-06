export interface TabData {}
export interface TabItem extends TabData {
  item_id: string;
  item_name: string;
}
export interface TabGroup extends TabData {
  store_id: string;
  store_name: string;
}
