import './CandidateInfoList.css';
import React from 'react';
import PropTypes from 'prop-types';

export const Component = ({ list  }) => (
      <div className="CandidateInfoList" >
            <ul>
                  {list.map((item, i) => (
                        <li key={i}>{item.title}</li>
                  ))}
            </ul>
      </div>
);

Component.propTypes = {};

export default Component;

