import React, { MouseEvent } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ElementsTable, ElementsTableProps } from "./ElementsTable";
import { TabGroup } from "../api/apiDataTypes";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Rybachok/ElementsTable",
  component: ElementsTable,
} as ComponentMeta<typeof ElementsTable>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ElementsTable> = (args) => (
  <ElementsTable {...args} />
);
export const TabItemsTable = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
const args: ElementsTableProps<TabGroup> = {
  changeGroup: (id, startId) => {
    console.log("Нажали сменить категорию", id, startId);
  },
  fieldsToShow: [
    {
      key: "store_id",
      value: "Код",
    },
    {
      key: "store_name",
      value: "Наименование",
    },
  ],
  groupPath: [
    {
      store_id: "2321",
      store_name: "parent1",
    },
  ],
  groups: [
    { store_id: "00023", store_name: "Группа 1" },
    { store_id: "00024", store_name: "Группа 2" },
  ],
  idField: "store_id",
  inProgress: false,
  items: [
    { store_id: "322", store_name: "sdfsdf" },
    { store_id: "32341", store_name: "ddsfsdf" },
  ],
  onItemSelection: (item) => {
    console.log(item);
  },
  startId: "0",
};
//@ts-ignore
TabItemsTable.args = args;
