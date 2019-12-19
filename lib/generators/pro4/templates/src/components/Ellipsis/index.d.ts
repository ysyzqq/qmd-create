import * as React from "react";
import { AbstractTooltipProps } from 'antd/es/tooltip'
export interface EllipsisProps {
  tooltip?: boolean | AbstractTooltipProps;
  length?: number;
  lines?: number;
}

export default class Ellipsis extends React.Component<
  EllipsisProps,
  any
> {}
