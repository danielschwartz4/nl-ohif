import React from 'react';
import PropTypes from 'prop-types';

import { Input, InputLabelWrapper } from '../';

const InputText = ({
  id,
  label,
  isSortable,
  sortDirection,
  onLabelClick,
  value,
  onChange,
  className,
  isTextArea,
}) => {
  return (
    <InputLabelWrapper
      label={label}
      isSortable={isSortable}
      sortDirection={sortDirection}
      onLabelClick={onLabelClick}
    >
      <Input
        id={id}
        className={'border-primary-main mt-2 bg-black ' + className}
        type="text"
        containerClassName="mr-2"
        value={value}
        onChange={event => {
          onChange(event.target.value);
        }}
        isTextArea
      />
    </InputLabelWrapper>
  );
};

InputText.defaultProps = {
  value: '',
  isSortable: false,
  onLabelClick: () => {},
  sortDirection: 'none',
  isTextArea: false,
};

InputText.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  isSortable: PropTypes.bool,
  sortDirection: PropTypes.oneOf(['ascending', 'descending', 'none']),
  onLabelClick: PropTypes.func,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  isTextArea: PropTypes.bool,
};

export default InputText;
