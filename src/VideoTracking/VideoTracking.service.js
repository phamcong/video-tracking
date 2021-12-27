import { porcheObjectDData } from "./data/porche-object-detections"

export default class VideoTrackingService {
  getVideoTrackingData() {
    const porcheDData = porcheObjectDData
    const objects = porcheDData?.data?.analysis?.objects || []
    return objects
  }
}
