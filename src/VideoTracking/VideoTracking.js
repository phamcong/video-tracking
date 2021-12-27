import { useCallback, useEffect, useState } from "react";
import "./VideoTracking.scss";
import VideoTrackingService from "./VideoTracking.service";

// Class ans style settings
// according to type of box: person or car
const BOX_CLASS = {
  OBJECT_CLASS_PERSON: 'person-box',
  OBJECT_CLASS_CAR: 'car-box',
}

const BOX_LABEL = {
  OBJECT_CLASS_PERSON: 'Person',
  OBJECT_CLASS_CAR: 'Car',
}

const BOX_LABEL_CLASS = {
  OBJECT_CLASS_PERSON: 'person-box-label',
  OBJECT_CLASS_CAR: 'car-box-label'
}


function VideoTracking() {
  const [currentDisplayBoxes, setCurrentDisplayBoxes] = useState([]);
  const delta = 100; // a box should be displayed if it's time in [timming - delta, timming + delta];
  const videoTService = new VideoTrackingService();
  const trackingObjects = videoTService.getVideoTrackingData();

  const getCurrentDisplayBoxes = useCallback(
    (timming) => {
      return trackingObjects
        .map((obj) => {
          const appearances = obj.appearances;
          const fBoxes = appearances
            .map((appr, idx) => {
              const shouldDisplayBoxes = appr.boxes
                // a box should be displayed if it's time in [timming - delta, timming + delta];
                .filter((box) => box.time >= timming - delta && box.time <= timming + delta)
                .map((box) => ({
                  ...box,
                  group: idx,
                  deltaTimming: Math.abs(timming - box.time),
                }));

              // Display only box with min deltaTimming
              shouldDisplayBoxes.sort((a, b) => a.deltaTimming >= b.deltaTimming ? 1 : -1);
              return shouldDisplayBoxes.slice(0, 1);
            })
            .reduce((a, b) => [...a, ...b], []);

          // transform boxes with additional prop
          return fBoxes.map((boxObject) => {
            const { topLeft, bottomRight } = boxObject.box;
            return {
              top: topLeft.y,
              left: topLeft.x,
              width: bottomRight.x - topLeft.x,
              height: bottomRight.y - topLeft.y,
              id: obj.id,
              group: boxObject.group,
              objectClass: obj.objectClass,
            };
          });
        })
        .reduce((a, b) => [...a, ...b], []);
    },
    [trackingObjects]
  );

  useEffect(() => {
    var video = document.getElementById("video");
    video.addEventListener(
      "play",
      function () {
        var $this = this; //cache
        (function loop() {
          if (!$this.paused && !$this.ended) {
            // update display boxes with current time
            const timming = $this.currentTime;
            const currDisplayBoxes = getCurrentDisplayBoxes(timming * 1000);
            setCurrentDisplayBoxes(currDisplayBoxes);
            setTimeout(loop, 1000 / 30); // drawing at 30fps
          }
        })();
      },
      0
    );
  }, [trackingObjects, getCurrentDisplayBoxes]);

  const canvasBoxes = currentDisplayBoxes.map((box, idx) => {
    const boxLabelStyle = { 
      top: box.top - 20, 
      left: box.left
    }
    const boxStyle = {
      top: box.top,
      left: box.left,
      width: box.width,
      height: box.height,
    };
    const objectClass = box.objectClass;
    const boxClass = BOX_CLASS[objectClass];
    const boxLabel = BOX_LABEL[objectClass];
    const boxLabelClass = BOX_LABEL_CLASS[objectClass];
    
    return (
      <div>
        <span className={boxLabelClass} style={boxLabelStyle}>{boxLabel}</span>
        <canvas className={boxClass} key={idx} style={boxStyle} id="canvas"></canvas>
      </div>
    );
  })
  return (    
    <div className="video-container">
      <div className="video-wrapper">
        <video controls={true} id="video">
          <source src="videos/porshe.mp4" type="video/mp4" />
        </video>
        {canvasBoxes}
      </div>
    </div>
  );
}

export default VideoTracking;
