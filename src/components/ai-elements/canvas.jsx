import { Background, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Controls } from "./controls";

export const Canvas = ({
  children,
  ...props
}) => (
  <ReactFlow
    deleteKeyCode={["Backspace", "Delete"]}
    fitView
    panOnDrag={false}
    panOnScroll
    selectionOnDrag={true}
    zoomOnDoubleClick={false}
    {...props}>
    <Background bgColor="var(--sidebar)" />
    <Controls />
    {children}
  </ReactFlow>
);
