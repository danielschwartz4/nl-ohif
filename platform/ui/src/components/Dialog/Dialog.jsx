import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Footer from './Footer';
import Body from './Body';
import Header from './Header';
import { useEffect } from 'react';

const Dialog = ({
  title,
  text = '',
  onClose,
  noCloseButton,
  actions,
  onShow,
  onSubmit,
  header: HeaderComponent,
  body: BodyComponent,
  footer: FooterComponent,
  value: defaultValue,
}) => {
  const [valueData, setValueData] = useState(defaultValue);

  const theme = 'bg-secondary-light';
  const flex = 'flex flex-col';
  const border = 'border-0 rounded-lg shadow-lg';
  const outline = 'outline-none focus:outline-none';
  const position = 'relative';
  const width = 'w-full';

  useEffect(() => {
    if (onShow) {
      onShow();
    }
  }, [onShow]);

  return (
    <div className={classNames(theme, flex, border, outline, position, width)}>
      <HeaderComponent
        title={title}
        noCloseButton={noCloseButton}
        onClose={onClose}
        value={valueData}
        setValue={setValueData}
      />
      <BodyComponent text={text} value={valueData} setValue={setValueData} />
      <FooterComponent
        actions={actions}
        onSubmit={onSubmit}
        value={valueData}
        setValue={setValueData}
      />
    </div>
  );
};

Dialog.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  onClose: PropTypes.func,
  noCloseButton: PropTypes.bool,
  header: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  body: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  footer: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  onSubmit: PropTypes.func.isRequired,
  value: PropTypes.object,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      value: PropTypes.any,
      type: PropTypes.oneOf(['primary', 'secondary', 'cancel']).isRequired,
    })
  ).isRequired,
};

Dialog.defaultProps = {
  header: Header,
  footer: Footer,
  body: Body,
  value: {},
};

export default Dialog;
