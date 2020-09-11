import React from 'react';
import PropTypes from 'prop-types';

interface CustomDividerProps {
  dividerWidth?: string;
}

export const CustomDivider: React.FC<CustomDividerProps> = ({
  dividerWidth,
}) => (
  <hr
    style={{
      borderColor: 'rgba(0, 54, 189, 0.7)',
      width: dividerWidth ? dividerWidth : '100%',
    }}
  />
);

CustomDivider.propTypes = {
  dividerWidth: PropTypes.string,
};
