import React, { useState } from "react";
import { Story } from "@storybook/react";
import { NativeTypes } from "react-dnd-html5-backend";
import { DndProvider, MultiBackend, getBackendOptions, Tree } from "~/index";
import styles from "./TextDrop.module.css";
import type { FileProperties } from "~/stories/types";
import type { TreeProps, NodeModel, DropOptions } from "~/types";

export const Template: Story<TreeProps<FileProperties>> = (args) => {
  const [tree, setTree] = useState<NodeModel<FileProperties>[]>(args.tree);
  const [lastId, setLastId] = useState(105);

  const handleDrop = (
    newTree: NodeModel<FileProperties>[],
    options: DropOptions<FileProperties>
  ) => {
    const { dropTargetId, monitor } = options;
    const dragSource = monitor.getItem();
    const itemType = monitor.getItemType();
    let mergedTree = [...newTree];

    if (itemType === NativeTypes.TEXT) {
      const text = dragSource.text as string;

      mergedTree = [
        ...newTree,
        {
          id: lastId,
          parent: dropTargetId,
          text,
          data: {
            fileSize: "1KB",
            fileType: "text",
          },
        },
      ];
    } else if (itemType === NativeTypes.HTML) {
      const html = dragSource.html as string;
      const tempEl = document.createElement("div");
      tempEl.innerHTML = html;
      const text = tempEl.textContent as string;

      mergedTree = [
        ...newTree,
        {
          id: lastId,
          parent: dropTargetId,
          text,
          data: {
            fileSize: "1KB",
            fileType: "text",
          },
        },
      ];
    }

    setTree(mergedTree);
    setLastId(lastId + 1);
    args.onDrop(mergedTree, options);
  };

  return (
    <div className={styles.rootGrid}>
      <div className={styles.fileChooser}>
        <p>ダミーテキストダミーテキストダミーテキストダミーテキスト</p>
      </div>
      <DndProvider
        backend={MultiBackend}
        options={getBackendOptions()}
        debugMode={true}
      >
        <Tree {...args} tree={tree} onDrop={handleDrop} />
      </DndProvider>
    </div>
  );
};
