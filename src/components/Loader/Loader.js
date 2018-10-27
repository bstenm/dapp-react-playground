import './Loader.css';
import React from 'react';

export const Loader = () => (
  <div className="Loader ">
        <div className="lds-blocks">
      <div className="lds-blocks-1" />
      <div className="lds-blocks-2" />
      <div className="lds-blocks-3" />
      <div className="lds-blocks-4" />
            </div>
      </div>
);

export default Loader;
