// ScrollableList.js
import React from 'react';
import PropTypes from 'prop-types';

const ScrollableList = ({ elements }) => {
  const scrollableStyle = {
    height: '400px', // Adjust height as needed
    overflowY: 'scroll',
    border: '1px solid #647484',
    padding: '10px'
  };

  return (
    <div style={scrollableStyle}>
      {elements.map((element, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          {element}
        </div>
      ))}
    </div>
  );
};

ScrollableList.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.element).isRequired
};

export default ScrollableList;
