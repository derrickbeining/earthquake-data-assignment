import React from 'react';

const iconPaths = {
  filter: 'M256 554v-84h512v84h-512zM128 256h768v86h-768v-86zM426 768v-86h172v86h-172z',
  undefined: null,
}

const Icon = props => {
  const {className, height, icon, width} = props;

  return (
    <svg {...props} viewBox="0 0 1024 1024">
      <path d={iconPaths[icon]} />
    </svg>
)
}

export default Icon;
