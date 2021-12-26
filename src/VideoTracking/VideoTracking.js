import { useEffect, useState } from "react";
import "./VideoTracking.scss";
import VideoTrackingService from "./VideoTracking.service";

const initPersonBox = {
  "box": {
    "bottomRight": {
      "x": 0,
      "y": 0
    },
    "topLeft": {
      "x": 0,
      "y": 0
    }
  },
  "time": 0
}

function VideoTracking() {
  const [canvasWidth, setCanvasWidth] = useState(548);
  const [canvasHeight, setCanvasHeight] = useState(535);
  const [canvasTop, setCanvasTop] = useState(0);
  const [canvasLeft, setCanvasLeft] = useState(0);
  const [currentPersonBox, setCurrentPersonBox] = useState(initPersonBox);

  const videoTService = new VideoTrackingService();
  const trackingResult = videoTService.getVideoTrackingData();
  const personBoxes = trackingResult.personBoxes;

  useEffect(() => {
    var video = document.getElementById("video");
    video.addEventListener(
      "play",
      function () {
        var $this = this; //cache
        (function loop() {
          if (!$this.paused && !$this.ended) {
            const timming = $this.currentTime;
            const foundPersonBox = getTrackingBox(personBoxes, timming * 1000);         
            console.log(foundPersonBox);   
            foundPersonBox && setCurrentPersonBox(foundPersonBox);
            setTimeout(loop, 1000 / 30); // drawing at 30fps
          }
        })();
      },
      0
    );
  }, [personBoxes]);

  useEffect(() => {
    const box = currentPersonBox.box;
    const { bottomRight, topLeft } = box;
    setCanvasTop(topLeft.x);
    setCanvasLeft(topLeft.y);
    setCanvasWidth(bottomRight.x - topLeft.x);
    setCanvasHeight(bottomRight.y - topLeft.y);
  }, [currentPersonBox]);

  const getTrackingBox = (trackingBoxes, timming) => {
    const foundBox = trackingBoxes.find((item, index) => {
      if (index >= trackingBoxes.length - 1) return item.time <= timming;
      return item.time <= timming && trackingBoxes[index + 1].time >= timming
    })

    return foundBox;
  }

  return (
    <div className="video-container">
      <div className="video-wrapper">
        <video controls={true} id="video">
          <source src="videos/porshe.mp4" type="video/mp4" />
        </video>
        <canvas
          style={{
            border: "1px solid red",
            top: canvasTop,
            left: canvasLeft,
            width: canvasWidth + "px",
            height: canvasHeight + "px",
          }}
          id="canvas"
        ></canvas>
      </div>
    </div>
  );
}

export default VideoTracking;
