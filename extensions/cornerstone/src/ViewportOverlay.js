import React from 'react';
import PropTypes from 'prop-types';
import cornerstone from 'cornerstone-core';
import classnames from 'classnames';

const OverlayRow = ({ title, value }) => (
  <div className="flex flex-row">
    <span className="mr-1">
      {title}
      {value ? ':' : ''}
    </span>
    {value && <span className="ml-1 font-light">{value}</span>}
  </div>
);

const ViewportOverlay = ({
  imageId,
  scale,
  windowWidth,
  windowCenter,
  imageIndex,
  stackSize,
  activeTools,
}) => {
  const topLeft = 'top-viewport left-viewport';
  const topRight = 'top-viewport right-viewport-scrollbar';
  const bottomRight = 'bottom-viewport right-viewport-scrollbar';
  const bottomLeft = 'bottom-viewport left-viewport';
  const overlay = 'absolute pointer-events-none';

  const isZoomActive = activeTools.includes('Zoom');
  const isWwwcActive = activeTools.includes('Wwwc');

  if (!imageId) {
    return null;
  }

  // TODO: this component should be presentational only. Right now it has a weird dependency on Cornerstone
  const instance = cornerstone.metaData.get('instance', imageId) || {};
  const {
    InstitutionName,
    AccessionNumber,
    StudyDescription,
    InstanceNumber,
    SliceLocation,
    SliceThickness,
  } = instance;

  return (
    <div className="text-primary-light">
      <div
        data-cy={'viewport-overlay-top-left'}
        className={classnames(overlay, topLeft)}
      ></div>
      <div
        data-cy={'viewport-overlay-top-right'}
        className={classnames(overlay, topRight)}
      >
        <OverlayRow title={InstitutionName} />
        <OverlayRow title={StudyDescription} />
        <OverlayRow title={AccessionNumber} />
      </div>
      <div
        data-cy={'viewport-overlay-bottom-right'}
        className={classnames(overlay, bottomRight)}
      >
        {stackSize > 1 && (
          <div className="flex flex-row">
            <span className="mr-1">I:</span>
            <span className="font-light">
              {`${InstanceNumber} (${imageIndex}/${stackSize})`}
            </span>
          </div>
        )}
        {isWwwcActive && (
          <div className="flex flex-row">
            <span className="mr-1">W:</span>
            <span className="ml-1 mr-2 font-light">
              {windowWidth.toFixed(0)}
            </span>
            <span className="mr-1">L:</span>
            <span className="ml-1 font-light">{windowCenter.toFixed(0)}</span>
          </div>
        )}
        {SliceThickness && (
          <OverlayRow
            title="Thickness"
            value={`${SliceThickness.toFixed(2)}mm`}
          />
        )}
        {SliceLocation && (
          <OverlayRow
            title="Location"
            value={`${SliceLocation.toFixed(2)}mm`}
          />
        )}
        {isZoomActive && (
          <div className="flex flex-row">
            <span className="mr-1">Zoom:</span>
            <span className="font-light">{scale.toFixed(2)}x</span>
          </div>
        )}
      </div>
      <div
        data-cy={'viewport-overlay-bottom-left'}
        className={classnames(overlay, bottomLeft)}
      ></div>
    </div>
  );
};

ViewportOverlay.propTypes = {
  scale: PropTypes.number.isRequired,
  windowWidth: PropTypes.number.isRequired,
  windowCenter: PropTypes.number.isRequired,
  imageId: PropTypes.string.isRequired,
  imageIndex: PropTypes.number.isRequired,
  stackSize: PropTypes.number.isRequired,
  activeTools: PropTypes.arrayOf(PropTypes.string),
};

ViewportOverlay.defaultProps = {
  activeTools: [],
};

export default ViewportOverlay;
