import { porcheObjectDData } from "./data/porche-object-detections";

export default class VideoTrackingService {
  getVideoTrackingData() {
    const porcheDData = porcheObjectDData;
    const objects = porcheDData?.data?.analysis?.objects || [];
    const personBoxes = objects
      .filter((item) => item.objectClass === "OBJECT_CLASS_PERSON")
      .map((item) => item.appearances)
      .reduce((a, b) => [...a, ...b], [])
      .map(item => item.boxes)
      .reduce((a, b) => [...a, ...b], []);
    const carBoxes = objects
      .filter((item) => item.objectClass === "OBJECT_CLASS_CAR")
      .map((item) => item.appearances)
      .reduce((a, b) => [...a, ...b], [])
      .map(item => item.boxes)
      .reduce((a, b) => [...a, ...b], []);
    return {
      personBoxes,
      carBoxes,
    };
  }
}
