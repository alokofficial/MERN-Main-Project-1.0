import React from 'react';
import ReactDOM from 'react-dom';

import './SideDrawer.css';

const SideDrawer = props => {
  const content = (
    <aside className="side-drawer">
      {props.children}
      <button className="side-drawer__close-btn" onClick={props.onClose}>
        &times;
      </button>
    </aside>
  );

  // return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
  if(props.show) {
    return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
  } else {
    return null;
  }
};

export default SideDrawer;