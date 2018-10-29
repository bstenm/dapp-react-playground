import './ErrorBoundary.css';
import React from 'react';
import { unexpectedError } from '../../config/messages';

const ErrorBoundary = () => (
      <div className="ErrorBoundary">
            <h2>{unexpectedError}</h2>
      </div>
);

export default ErrorBoundary;
