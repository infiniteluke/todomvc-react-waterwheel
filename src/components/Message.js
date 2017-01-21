import React from 'react';
import classNames from 'classnames';

const Message = ({ text, type, showMessage }) => (
  <div className={classNames({ message: true, [type]: true, showMessage})}>{text}</div>
);

Message.propTypes = {
  text: React.PropTypes.string,
  type: React.PropTypes.string,
  showMessage: React.PropTypes.bool,
};

export default Message;
