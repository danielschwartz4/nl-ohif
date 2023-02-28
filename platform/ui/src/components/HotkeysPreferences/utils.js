import { hotkeysValidators } from './hotkeysValidators';

/**
 * Split hotkeys definitions and create hotkey related tuples
 *
 * @param {array} hotkeyDefinitions
 * @returns {array} array of tuples consisted of command name and hotkey definition
 */
const splitHotkeyDefinitionsAndCreateTuples = hotkeyDefinitions => {
  const splitedHotkeys = [];
  const arrayHotkeys = Object.entries(hotkeyDefinitions);

  if (arrayHotkeys.length) {
    const halfwayThrough = Math.ceil(arrayHotkeys.length / 2);
    splitedHotkeys.push(arrayHotkeys.slice(0, halfwayThrough));
    splitedHotkeys.push(
      arrayHotkeys.slice(halfwayThrough, arrayHotkeys.length)
    );
  }

  return splitedHotkeys;
};

/**
 * Remove validation errors as necessary
 *
 * @param {Object} currentErrors
 * @param {array} pressedKeys new keys
 * @param {string} id id
 * @param {array} arguments.hotkeys current hotkeys
 * @returns {Object} {error} validation error
 */
const removeErrors = (currentErrors, pressedKeys, id, hotkeys) => {
  const pressedLabel = hotkeys[id].label;
  let newLabel;
  if (Object.keys(currentErrors.currentErrors).length) {
    // First delete the error once we correctly update the hotkey
    Object.keys(currentErrors.currentErrors).every(key => {
      const currentError = currentErrors.currentErrors[key];
      if (currentError['error']) {
        const errorLabel = currentError['label'];
        const errorKeys = currentError['keys'].join('+');
        if (
          errorLabel === pressedLabel &&
          pressedKeys.join('+') !== errorKeys
        ) {
          newLabel = hotkeys[key].label;
          currentError['error'] = undefined;
          currentError['keys'] = undefined;
          currentError['label'] = undefined;
          return false;
        }
      }
      return true;
    });
    // Then we relabel old errors so that all duplicate keys have the same error
    Object.keys(currentErrors.currentErrors).forEach(key => {
      const currentError = currentErrors.currentErrors[key];
      const error = currentError['error'];
      // !! Check if error label and error keys
      if (error) {
        const errorLabel = currentError['label'];
        const errorKeys = currentError['keys'].join('+');

        if (
          errorLabel === pressedLabel &&
          pressedKeys.join('+') !== errorKeys
        ) {
          currentError['error'] = currentError['error'].replace(
            `"${errorLabel}"`,
            `"${newLabel}"`
          );
          currentError['keys'] = pressedKeys;
          currentError['label'] = newLabel;
        }
      }
    });
  }

  return { currentErrors: currentErrors };
};

/**
 * Validate a hotkey change
 *
 * @param {Object} arguments
 * @param {string} arguments.commandName command name or id
 * @param {array} arguments.pressedKeys new keys
 * @param {array} arguments.hotkeys current hotkeys
 * @param {Object} currentErrors
 * @returns {Object} {error} validation error
 */
const validate = ({ commandName, pressedKeys, hotkeys, currentErrors }) => {
  const updatedErrors = removeErrors(
    currentErrors,
    pressedKeys,
    commandName,
    hotkeys
  );
  for (const validator of hotkeysValidators) {
    const validation = validator({
      commandName,
      pressedKeys,
      hotkeys,
    });
    if (validation && validation.error) {
      return { ...validation, ...updatedErrors };
    }
  }
  return { error: undefined, ...updatedErrors };
};

/**
 * Extract relevant toolName and key data from a validation error
 *
 * @param {Object} error {error}
 * @returns {array} [toolName, key] toolName and key from error
 */
const extractInfoFromError = error => {
  const regex = /"([^"]+)"[^"]+"([^"]+)"/;
  const match = error.match(regex);
  if (match !== null) {
    const toolName = match[1];
    const key = match[2];
    return [toolName, key];
  } else {
    return null;
  }
};

export {
  validate,
  splitHotkeyDefinitionsAndCreateTuples,
  extractInfoFromError,
};
