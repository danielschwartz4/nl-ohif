import { ExtensionManager, MODULE_TYPES } from './extensions';
import { ServicesManager } from './services';
import classes, { CommandsManager, HotkeysManager } from './classes/';

import DICOMWeb from './DICOMWeb';
import DICOMSR from './DICOMSR';
import errorHandler from './errorHandler.js';
import log from './log.js';
import object from './object.js';
import string from './string.js';
import user from './user.js';
import utils from './utils/';
import defaults from './defaults';

import {
  CineService,
  ViewerToolsetService,
  UIDialogService,
  UIModalService,
  UINotificationService,
  UIViewportDialogService,
  //
  DicomMetadataStore,
  DisplaySetService,
  ToolBarService,
  MeasurementService,
  ViewportGridService,
  HangingProtocolService,
  pubSubServiceInterface,
  UserAuthenticationService,
} from './services';

import IWebApiDataSource from './DataSources/IWebApiDataSource';

const hotkeys = {
  ...utils.hotkeys,
  defaults: { hotkeyBindings: defaults.hotkeyBindings },
};

const OHIF = {
  MODULE_TYPES,
  //
  CommandsManager,
  ExtensionManager,
  HotkeysManager,
  ServicesManager,
  //
  defaults,
  utils,
  hotkeys,
  classes,
  string,
  user,
  errorHandler,
  object,
  log,
  DICOMWeb,
  DICOMSR,
  viewer: {},
  //
  CineService,
  ViewerToolsetService,
  UIDialogService,
  UIModalService,
  UINotificationService,
  UIViewportDialogService,
  DisplaySetService,
  MeasurementService,
  ToolBarService, // TODO: TYPO
  ViewportGridService,
  HangingProtocolService,
  UserAuthenticationService,
  IWebApiDataSource,
  DicomMetadataStore,
  pubSubServiceInterface,
};

export {
  MODULE_TYPES,
  //
  CommandsManager,
  ExtensionManager,
  HotkeysManager,
  ServicesManager,
  //
  defaults,
  utils,
  hotkeys,
  classes,
  string,
  user,
  errorHandler,
  object,
  log,
  DICOMWeb,
  DICOMSR,
  //
  CineService,
  ViewerToolsetService,
  UIDialogService,
  UIModalService,
  UINotificationService,
  UIViewportDialogService,
  DisplaySetService,
  MeasurementService,
  ToolBarService,
  ViewportGridService,
  HangingProtocolService,
  UserAuthenticationService,
  IWebApiDataSource,
  DicomMetadataStore,
  pubSubServiceInterface,
};

export { OHIF };

export default OHIF;
