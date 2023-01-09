/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import { Tooltip } from 'antd';
import React from 'react';

function CustomCell(props: any) {
  if (Array.isArray(props?.children)) {
    let title = props?.children[1];
    if (typeof title?.props?.children === 'string') title = title?.props?.children;
    if (typeof title === 'string')
      return (
        <Tooltip title={title} mouseLeaveDelay={0} mouseEnterDelay={0.5}>
          <td {...props} />
        </Tooltip>
      );
  }
  return <td {...props} />;
}

export default CustomCell;
