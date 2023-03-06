import React, { useEffect, useMemo, useState } from "react";
import { TabData, TabGroup } from "../api/apiDataTypes";
import GroupClosed from "./folder-svgrepo-com-closed.svg";
import ItemSvg from "./folder-svgrepo-com-item.svg";
import GroupOpenedSvg from "./folder-svgrepo-com-opened.svg";
import css from "./ElementsTable.module.css";

export type fieldToShow<T> = {
  key: keyof T;
  value: string;
};
export interface ElementsTableProps<T> {
  idField: keyof T;
  fieldsToShow: fieldToShow<T>[];
  groupPath: Array<T>;
  groups: Array<T>;
  items: Array<T>;
  changeGroup: (id: string, startId: string | null) => void;
  startId: string;
  inProgress: boolean;
  onItemSelection: <T>(selectedT: T) => void;
}
export const ElementsTable: React.FC<ElementsTableProps<TabGroup | TabData>> =
  ({
    idField,
    fieldsToShow,
    groupPath,
    groups,
    items,
    changeGroup,
    startId,
    inProgress,
    onItemSelection,
  }) => {
    const [currentColumn, setCurrentColumn] = useState(1);
    const changeCurrentGroup = (id: string, startId: string | null) => {
      const countPreviousSiblings = (el: Node, index?: number): number => {
        if (!index) index = 0;
        if (el.previousSibling) {
          index++;
          return countPreviousSiblings(el.previousSibling, index);
        } else return index;
      };
      const currentActive = document.getElementsByClassName(css.activeCell)[0];
      if (currentActive)
        setCurrentColumn(() => countPreviousSiblings(currentActive) - 1);
      changeGroup(id, startId);
    };
    const cssInProgress = useMemo(() => {
      if (inProgress) return css.inProgress;
      else return "";
    }, [inProgress]);

    useEffect(() => {
      const clickHandler = function (event: Event) {
        // let element = event.target;
        // let table;
        // while (element.parentNode) {
        //     if (element.classList.contains(css.mainTable))
        //         table = element;
        //     element = element.parentNode;
        // }
        // if (!table) {
        //     document.getElementsByClassName(css.activeCell)[0]?.classList.remove(css.activeCell);
        // }
      };
      document.addEventListener("click", clickHandler);
      return () => {
        document.removeEventListener("click", clickHandler);
      };
    }, []);
    useEffect(() => {
      if (document.getElementsByClassName(css.activeCell).length > 0) return;
      if (!startId) {
        const tr = document.getElementsByClassName(css.trTable).item(0);
        const newCurrentElement = tr
          ?.getElementsByClassName(css.tdTable)
          .item(!currentColumn ? 0 : currentColumn);
        if (newCurrentElement) newCurrentElement.classList.add(css.activeCell);
        const collection = document.getElementsByClassName(css.elements);
        const item = collection.item(0);
        if (item) {
          item.scrollTop = 0;
        }
        return;
      }

      for (const node of document.getElementsByClassName(css.trTable)) {
        if (!(node instanceof HTMLElement)) continue;

        const { id } = node.dataset;

        if (startId === id) {
          const newCurrentElement = node
            .getElementsByClassName(css.tdTable)
            .item(!currentColumn ? 0 : currentColumn);
          if (newCurrentElement)
            newCurrentElement.classList.add(css.activeCell);
          break;
        }
      }

      document.getElementsByClassName(css.activeCell)[0]?.scrollIntoView();
    }, [items, groups, startId, currentColumn]);

    useEffect(() => {
      const arrowKeys = (event: KeyboardEvent) => {
        if (!event.key.includes("Arrow")) return;

        const currentActive = document.getElementsByClassName(
          css.activeCell
        )[0];
        if (!currentActive) return;
        if (
          event.ctrlKey === false &&
          ["ArrowDown", "ArrowUp"].includes(event.key)
        ) {
          let newSiblingsParent;
          if (event.key === "ArrowDown" && currentActive.parentNode) {
            newSiblingsParent = currentActive.parentNode.nextSibling;
          } else if (currentActive.parentNode) {
            newSiblingsParent = currentActive.parentNode.previousSibling;
          }

          if (
            !newSiblingsParent ||
            (newSiblingsParent instanceof HTMLElement &&
              !newSiblingsParent.classList.contains(css.trTable))
          ) {
            return;
          }
          if (
            currentActive.parentNode &&
            currentActive.parentNode instanceof HTMLElement &&
            newSiblingsParent instanceof HTMLElement
          ) {
            currentActive.classList.remove(css.activeCell);
            const column = [
              ...currentActive.parentNode.getElementsByClassName(css.tdTable),
            ].indexOf(currentActive);
            const nextNode = [
              ...newSiblingsParent.getElementsByClassName(css.tdTable),
            ][column];
            nextNode.classList.add(css.activeCell);
            nextNode.scrollIntoView({ block: "nearest", inline: "nearest" });
            event.preventDefault();
          }
        }

        if (
          event.ctrlKey === false &&
          ["ArrowLeft", "ArrowRight"].includes(event.key)
        ) {
          let newSibling: HTMLElement | false;
          if (event.key === "ArrowLeft" && currentActive.previousSibling) {
            newSibling = currentActive.previousSibling as HTMLElement;
          } else if (currentActive.nextSibling) {
            newSibling = currentActive.nextSibling as HTMLElement;
          } else {
            newSibling = false;
          }

          if (!newSibling || !newSibling.classList.contains(css.tdTable)) {
            return;
          }
          currentActive.classList.remove(css.activeCell);
          newSibling.classList.add(css.activeCell);
          event.preventDefault();
        }

        if (
          event.ctrlKey === true &&
          ["ArrowUp"].includes(event.key) &&
          groupPath.length > 0
        ) {
          const upId = groupPath[groupPath.length - 2]
            ? groupPath[groupPath.length - 2][idField]
            : "0";
          const startId = groupPath[groupPath.length - 1]
            ? groupPath[groupPath.length - 1][idField]
            : null;
          changeCurrentGroup(upId, startId);
          event.preventDefault();
        }
        if (
          currentActive &&
          currentActive.parentNode instanceof HTMLElement &&
          event.ctrlKey === true &&
          ["ArrowDown"].includes(event.key)
        ) {
          const data = currentActive.parentNode.dataset;

          if (data["d_type"] !== "group" || !data["id"]) return;
          changeCurrentGroup(data["id"], null);
          event.preventDefault();
        }
      };
      const copyValue = (event: KeyboardEvent) => {
        if (event.code !== "KeyC" || !event.ctrlKey) return;
        const currentActive = document.getElementsByClassName(
          css.activeCell
        )[0];

        if (currentActive && currentActive.textContent)
          navigator.clipboard.writeText(currentActive.textContent).then();
      };

      const keyDownHandler = (event: KeyboardEvent) => {
        arrowKeys(event);
        copyValue(event);
      };
      document.addEventListener("keydown", keyDownHandler);
      return () => {
        document.removeEventListener("keydown", keyDownHandler);
      };
      // eslint-disable-next-line
    }, [groups, items, groupPath, idField]);
    const changeActive = (event: KeyboardEvent | MouseEvent) => {
      [...document.getElementsByClassName(css.activeCell)].forEach((el) => {
        el.classList.remove(css.activeCell);
      });
      if (event.target instanceof HTMLElement)
        event.target?.classList.add(css.activeCell);
    };

    useEffect(() => {
      const selectItem = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!event.target || !(event.target instanceof HTMLElement)) return;
        if (!event.target.classList.contains(css.tdTable)) {
          return;
        }

        if (typeof onItemSelection === "function") {
          if (target.parentNode instanceof HTMLElement)
            onItemSelection({ ...target.parentNode.dataset });
        }
      };
      const onKeyDownEnter = (event: KeyboardEvent) => {
        if (event.key !== "Enter") return;
        if (document.getElementsByClassName(css.activeCell).length === 0)
          return;
        const active = document.getElementsByClassName(css.activeCell).item(0);
        if (typeof onItemSelection === "function" && active) {
          if (active.parentNode instanceof HTMLElement)
            onItemSelection({ ...active.parentNode.dataset });
        }
      };
      document.addEventListener("dblclick", selectItem);
      document.addEventListener("keydown", onKeyDownEnter);
      return () => {
        document.removeEventListener("dblclick", selectItem);
        document.removeEventListener("keydown", onKeyDownEnter);
      };
    }, [onItemSelection]);

    return (
      <div className={css.mainTable + " " + cssInProgress}>
        <div className={css.headerGroup}>
          <div
            className={
              "border-l border-t grid text-sm font-bold " + css.gridTemplate
            }
          >
            <div className="border-r border-b"></div>
            {fieldsToShow.map(({ key, value }) => {
              return (
                <div className="border-r border-b" key={key}>
                  {value}
                </div>
              );
            })}
          </div>

          {groupPath.length > 0 &&
            groupPath.map((groupP, index) => {
              return (
                <div
                  className={
                    "border-l  grid text-sm bg-gray-300  " + css.gridTemplate
                  }
                  key={index}
                >
                  <div
                    className="border-r border-b border-white p-1"
                    onDoubleClick={() => {
                      // const upId = groupPath[index - 1] ? groupPath[index - 1][idNameField] : '0';
                      const upId = groupPath[groupPath.length - 2]
                        ? groupPath[groupPath.length - 2][idField]
                        : "0";
                      const startId = groupPath[groupPath.length - 1]
                        ? groupPath[groupPath.length - 1][idField]
                        : null;
                      changeCurrentGroup(upId, startId);
                    }}
                  >
                    <div className="w-5" title="icon-opened-group">
                      <GroupOpenedSvg />
                    </div>
                  </div>
                  {fieldsToShow.map(({ key, value }) => {
                    const str = groupP[key];
                    return (
                      <div
                        className="border-r text-sm  border-b border-white p-1"
                        key={key}
                      >
                        {str}
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
        <div className={css.elements}>
          {groups.length > 0 &&
            groups.map((group, gi) => {
              const item_id = group[idField];

              return (
                <div
                  data-id={item_id}
                  data-d_type={"group"}
                  className={
                    "border-l hover:bg-gray-100 grid text-sm  " +
                    [css.trTable, css.gridTemplate].join(" ")
                  }
                  key={group[idField]}
                >
                  <div
                    className="border-r border-b p-1 "
                    onDoubleClick={() => {
                      changeCurrentGroup(item_id, null);
                    }}
                  >
                    <GroupClosed />
                  </div>
                  {fieldsToShow.map(({ key, value }) => {
                    const str = group[key];
                    return (
                      <div
                        className={
                          "border-r border-b p-1 text-sm  " + css.tdTable
                        }
                        key={key}
                        onClick={(event) => {
                          changeActive(event as unknown as MouseEvent);
                        }}
                      >
                        {str}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          {items.length > 0 &&
            items.map((item, ik) => {
              const item_id = item[idField];

              return (
                <div
                  data-id={item_id}
                  data-d_type={"item"}
                  className={
                    "border-l hover:bg-gray-100 grid text-sm  " +
                    [css.trTable, css.gridTemplate].join(" ")
                  }
                  key={item[idField]}
                >
                  <div title="icon" className="border-r border-b p-1">
                    <ItemSvg />
                  </div>
                  {fieldsToShow.map(({ key, value }) => {
                    return (
                      <div
                        className={
                          "border-r border-b p-1 text-sm  " + css.tdTable
                        }
                        key={value}
                        onClick={(event) => {
                          changeActive(event as unknown as MouseEvent);
                        }}
                      >
                        {item[key]}
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </div>
    );
  };
export const useGetActiveElement = () => {
  return () => {
    const activeElement = document
      .getElementsByClassName(css.activeCell)
      .item(0);
    if (activeElement && activeElement.parentNode instanceof HTMLElement) {
      return { ...activeElement.parentNode.dataset };
    }
  };
};
