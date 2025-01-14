import dcmjs from 'dcmjs';

import pubSubServiceInterface from '../_shared/pubSubServiceInterface';
import createStudyMetadata from './createStudyMetadata';
import EVENTS from './EVENTS';

const _model = {
  studies: [],
  //   studies: [{
  //     seriesLists: [
  //         {
  //         // Series in study from dicom web server 1 (or different backend 1)
  //             series: [{
  //                 instances: [{
  //                     ...instanceMetadata // Naturalized DICOM.
  //                 }],
  //                 ...seriesMetadata
  //             }],
  //             clientName
  //         },
  //         {
  //         // Series in study from dicom web server 2 (or different backend 2)
  //         },
  //     ],
  //     ...studyMetadata,
  // }]
};

function _getStudyInstanceUIDs() {
  return _model.studies.map(aStudy => aStudy.StudyInstanceUID);
}

function _getStudy(StudyInstanceUID) {
  return _model.studies.find(
    aStudy => aStudy.StudyInstanceUID === StudyInstanceUID
  );
}

function _getSeries(StudyInstanceUID, SeriesInstanceUID) {
  const study = _getStudy(StudyInstanceUID);

  if (!study) {
    return;
  }

  return study.series.find(
    aSeries => aSeries.SeriesInstanceUID === SeriesInstanceUID
  );
}

function _getInstance(StudyInstanceUID, SeriesInstanceUID, SOPInstanceUID) {
  const series = _getSeries(StudyInstanceUID, SeriesInstanceUID);

  if (!series) {
    return;
  }

  return series.instances.find(
    instance => instance.SOPInstanceUID === SOPInstanceUID
  );
}

function _getInstanceFromImageId(imageId) {
  for (let study of _model.studies) {
    for (let series of study.series) {
      for (let instance of series.instances) {
        if (instance.imageId === imageId) {
          return instance;
        }
      }
    }
  }
}

const BaseImplementation = {
  EVENTS,
  listeners: {},
  addInstance(dicomJSONDatasetOrP10ArrayBuffer) {
    let dicomJSONDataset;

    // If Arraybuffer, parse to DICOMJSON before naturalizing.
    if (dicomJSONDatasetOrP10ArrayBuffer instanceof ArrayBuffer) {
      const dicomData = dcmjs.data.DicomMessage.readFile(
        dicomJSONDatasetOrP10ArrayBuffer
      );

      dicomJSONDataset = dicomData.dict;
    } else {
      dicomJSONDataset = dicomJSONDatasetOrP10ArrayBuffer;
    }

    let naturalizedDataset;

    if (dicomJSONDataset['SeriesInstanceUID'] === undefined) {
      naturalizedDataset = dcmjs.data.DicomMetaDictionary.naturalizeDataset(
        dicomJSONDataset
      );
    } else {
      naturalizedDataset = dicomJSONDataset;
    }

    const { StudyInstanceUID } = naturalizedDataset;

    let study = _model.studies.find(
      study => study.StudyInstanceUID === StudyInstanceUID
    );

    if (!study) {
      _model.studies.push(createStudyMetadata(StudyInstanceUID));
      study = _model.studies[_model.studies.length - 1];
    }

    study.addInstanceToSeries(naturalizedDataset);
  },
  addInstances(instances, madeInClient = false) {
    const { StudyInstanceUID, SeriesInstanceUID } = instances[0];

    let study = _model.studies.find(
      study => study.StudyInstanceUID === StudyInstanceUID
    );

    if (!study) {
      _model.studies.push(createStudyMetadata(StudyInstanceUID));

      study = _model.studies[_model.studies.length - 1];
    }

    study.addInstancesToSeries(instances);

    // Broadcast an event even if we used cached data.
    // This is because the mode needs to listen to instances that are added to build up its active displaySets.
    // It will see there are cached displaySets and end early if this Series has already been fired in this
    // Mode session for some reason.
    this._broadcastEvent(EVENTS.INSTANCES_ADDED, {
      StudyInstanceUID,
      SeriesInstanceUID,
      madeInClient,
    });
  },
  addSeriesMetadata(seriesSummaryMetadata, madeInClient = false) {
    const { StudyInstanceUID } = seriesSummaryMetadata[0];
    let study = _getStudy(StudyInstanceUID);
    if (!study) {
      study = createStudyMetadata(StudyInstanceUID);
      _model.studies.push(study);
    }

    seriesSummaryMetadata.forEach(series => {
      const { SeriesInstanceUID } = series;

      study.setSeriesMetadata(SeriesInstanceUID, series);
    });

    this._broadcastEvent(EVENTS.SERIES_ADDED, {
      StudyInstanceUID,
      madeInClient,
    });
  },
  addStudy(study) {
    const { StudyInstanceUID } = study;

    let existingStudy = _model.studies.find(
      study => study.StudyInstanceUID === StudyInstanceUID
    );

    if (!existingStudy) {
      const newStudy = createStudyMetadata(StudyInstanceUID);

      newStudy.PatientID = study.PatientID;
      newStudy.PatientName = study.PatientName;
      newStudy.StudyDate = study.StudyDate;
      newStudy.ModalitiesInStudy = study.ModalitiesInStudy;
      newStudy.StudyDescription = study.StudyDescription;
      newStudy.AccessionNumber = study.AccessionNumber;
      newStudy.NumInstances = study.NumInstances; // todo: Correct naming?

      _model.studies.push(newStudy);
    }
  },
  studyLoaded(study) {
    this._broadcastEvent(EVENTS.STUDY_LOADED, study);
  },
  getStudyInstanceUIDs: _getStudyInstanceUIDs,
  getStudy: _getStudy,
  getSeries: _getSeries,
  getInstance: _getInstance,
  getInstanceFromImageId: _getInstanceFromImageId,
};

const DicomMetadataStore = Object.assign(
  {},
  BaseImplementation,
  pubSubServiceInterface
);

export { DicomMetadataStore };
export default DicomMetadataStore;
