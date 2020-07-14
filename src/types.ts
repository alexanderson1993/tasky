import { CSSProperties } from "react";

export interface PanStateI {
  x: number;
  y: number;
  scale: number;
}

export type ElementId = string;

export type Elements = Array<Node | Edge>;

export type Transform = [number, number, number];

export enum Position {
  Left = "left",
  Top = "top",
  Right = "right",
  Bottom = "bottom",
}

export interface XYPosition {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Rect extends Dimensions, XYPosition {}

export interface Box extends XYPosition {
  x2: number;
  y2: number;
}

export interface Node {
  id: ElementId;
  position: XYPosition;
  type?: string;
  __rf?: any;
  data?: any;
  style?: CSSProperties;
  className?: string;
  targetPosition?: Position;
  sourcePosition?: Position;
}

export interface Edge {
  id: ElementId;
  type?: string;
  source: ElementId;
  target: ElementId;
  label?: string;
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
  style?: CSSProperties;
  animated?: boolean;
}

export enum BackgroundVariant {
  Lines = "lines",
  Dots = "dots",
}

export type HandleType = "source" | "target";

export type NodeTypesType = { [key: string]: React.ReactNode };

export type EdgeTypesType = NodeTypesType;

export interface SelectionRect extends Rect {
  startX: number;
  startY: number;
  draw: boolean;
}

export interface EdgeProps {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  label?: string;
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
  style?: CSSProperties;
}

export interface EdgeBezierProps extends EdgeProps {
  sourcePosition: Position;
  targetPosition: Position;
}

export interface NodeProps {
  id: ElementId;
  type: string;
  data: any;
  selected: boolean;
  targetPosition?: Position;
  sourcePosition?: Position;
}

export interface NodeComponentProps {
  id: ElementId;
  type: string;
  data: any;
  selected?: boolean;
  transform?: Transform;
  xPos?: number;
  yPos?: number;
  targetPosition?: Position;
  sourcePosition?: Position;
  onClick?: (node: Node) => void;
  onNodeDragStart?: (node: Node) => void;
  onNodeDragStop?: (node: Node) => void;
  style?: CSSProperties;
}

export interface WrapNodeProps {
  id: ElementId;
  type: string;
  data: any;
  selected: boolean;
  transform: Transform;
  xPos: number;
  yPos: number;
  isInteractive: boolean;
  selectNodesOnDrag: boolean;
  onClick?: (node: Node) => void;
  onNodeDragStart?: (node: Node) => void;
  onNodeDragStop?: (node: Node) => void;
  style?: CSSProperties;
  className?: string;
  sourcePosition?: Position;
  targetPosition?: Position;
}

export type FitViewParams = {
  padding: number;
};
export type FitViewFunc = (fitViewOptions?: FitViewParams) => void;
export type ProjectFunc = (position: XYPosition) => XYPosition;

type OnLoadParams = {
  zoomIn: () => void;
  zoomOut: () => void;
  fitView: FitViewFunc;
  project: ProjectFunc;
  getElements: () => Elements;
};

export type OnLoadFunc = (params: OnLoadParams) => void;

export interface Connection {
  source: ElementId | null;
  target: ElementId | null;
}

export enum ConnectionLineType {
  Bezier = "bezier",
  Straight = "straight",
}

export type OnConnectFunc = (connection: Connection) => void;

export type SetConnectionId = {
  connectionNodeId: ElementId | null;
  connectionHandleType: HandleType | null;
};

export interface HandleElement extends XYPosition, Dimensions {
  id?: ElementId | null;
  position: Position;
}

export interface HandleProps {
  type: HandleType;
  position: Position;
  onConnect?: OnConnectFunc;
  isValidConnection?: (connection: Connection) => boolean;
  id?: string;
  style?: CSSProperties;
  className?: string;
}

export interface EdgeCompProps {
  id: ElementId;
  source: ElementId;
  target: ElementId;
  type: any;
  label?: string;
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
  onClick?: (edge: Edge) => void;
  animated?: boolean;
  selected?: boolean;
}

export interface EdgeTextProps {
  x: number;
  y: number;
  label?: string;
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
}

export type NodePosUpdate = {
  id: ElementId;
  pos: XYPosition;
};
