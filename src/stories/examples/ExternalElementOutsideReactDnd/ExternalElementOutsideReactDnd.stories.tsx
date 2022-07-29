import React from "react";
import { Meta } from "@storybook/react";
import { expect } from "@storybook/jest";
import { within, fireEvent } from "@storybook/testing-library";
import { NativeTypes } from "react-dnd-html5-backend";
import { Tree } from "~/index";
import { pageFactory } from "~/stories/pageFactory";
import * as argTypes from "~/stories/argTypes";
import { CustomDragPreview } from "~/stories/examples/components/CustomDragPreview";
import { TreeProps, DragLayerMonitorProps } from "~/types";
import { FileProperties } from "~/stories/types";
import { getPointerCoords, wait } from "~/stories/examples/helpers";
import { CustomNode } from "~/stories/examples/components/CustomNode";
import { interactionsDisabled } from "~/stories/examples/interactionsDisabled";
import sampleData from "~/stories/assets/sample-default.json";
import { Template } from "./Template";
import styles from "./ExternalElementOutsideReactDnd.module.css";

export default {
  component: Tree,
  title: "Examples/Tree/External element (outside react-dnd)",
  argTypes,
} as Meta<TreeProps<FileProperties>>;

export const ExternalElementOutsideReactDnd = Template.bind({});

ExternalElementOutsideReactDnd.args = {
  rootId: 0,
  tree: sampleData,
  classes: {
    root: styles.treeRoot,
    draggingSource: styles.draggingSource,
    dropTarget: styles.dropTarget,
  },
  extraAcceptTypes: [NativeTypes.TEXT],
  render: function render(node, options) {
    return <CustomNode node={node} {...options} />;
  },
  dragPreviewRender: (monitorProps: DragLayerMonitorProps<FileProperties>) => (
    <CustomDragPreview monitorProps={monitorProps} />
  ),
};

ExternalElementOutsideReactDnd.storyName =
  "External element (outside react-dnd)";

ExternalElementOutsideReactDnd.parameters = {
  docs: {
    page: pageFactory({
      jsId: "custom-drag-preview-js-s53fmx",
      tsId: "custom-drag-preview-ts-ibvb07",
    }),
  },
};

if (!interactionsDisabled) {
  ExternalElementOutsideReactDnd.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // drag over into tree root from element outside react-dnd;
    // Cannot pass dataTransfer to the drop event,
    // so testing the drop is not possible.
    {
      const dragSource = canvas.getByTestId("external-node-101");
      const dropTarget = canvas.getByRole("list");
      const coords = getPointerCoords(dropTarget, { x: 10, y: 10 });
      const dataTransfer = new DataTransfer();
      const options = {
        dataTransfer,
        ...coords,
      };

      fireEvent.dragStart(dragSource, options);
      fireEvent.dragEnter(dropTarget, coords);
      fireEvent.dragOver(dropTarget, coords);
      await wait();
      expect(dropTarget).toHaveStyle("background-color: #e8f0fe");
    }
  };
}
