import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";

interface Props {
  webcamConfig: {
    audio: boolean;
    videoConstraints: {
      width: number,
      height: number,
      facingMode: string
    }
  }
}

const WebcamComponent = ({ webcamConfig }: Props) => {
  const webcamRef = useRef<Webcam>(null);

  /* Screenshot */
  const [screenshot, setScreenshot] = useState<string | null | undefined>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setScreenshot(imageSrc);
  }, [webcamRef]);

  /* Video */
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  console.log(recordedChunks);

  const handleDataAvailable = useCallback(({ data }: { data: Blob }) => {
    if (data.size > 0) {
      setRecordedChunks(prevState => prevState.concat(data));
    }
  }, [setRecordedChunks]);

  const handleStartCapturing = useCallback(() => {
    setCapturing(true);
    if (webcamRef.current && webcamRef.current.stream) {
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: "video/webm"
      });

      mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
      mediaRecorderRef.current.start();
    }
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);


  const handleStopCapturing = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);

  const handleDownload = useCallback(() => {
    const blob = new Blob(recordedChunks, {
      type: 'video/webm'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.download = "new_video.webm";
    a.click();
    window.URL.revokeObjectURL(url);
    setRecordedChunks([]);
  }, [recordedChunks]);

  return (
    <>
      <div>
        <Webcam
          ref={webcamRef}
          audio={webcamConfig.audio}
          videoConstraints={webcamConfig.videoConstraints}
          screenshotFormat={"image/webp"}
        />
        <div className="my-2 flex gap-x-4">
          {(!capturing && recordedChunks.length <= 0) && <button onClick={capture} className="bg-cyan-600 text-white rounded-md px-3 py-1 max-w-fit mt-2">Capture screenshot</button>}
          {
            recordedChunks.length <= 0 && (capturing ?
              <button onClick={handleStopCapturing} className="bg-red-600 text-white rounded-md px-3 py-1 max-w-fit mt-2">Stop recording</button>
              : <button onClick={handleStartCapturing} className="bg-green-600 text-white rounded-md px-3 py-1 max-w-fit mt-2">Start recording</button>)
          }
          {recordedChunks.length > 0 && (
            <div className="flex gap-x-2">
              <button onClick={handleDownload} className="bg-green-600 text-white rounded-md px-3 py-1">Download video</button>
              <button onClick={() => setRecordedChunks([])} className="bg-red-600 text-white rounded-md px-3 py-1">Delete video</button>
            </div>
          )}
        </div>
      </div>
      <div>
        {
          screenshot && <div className="m-4">
            <span>Screenshot saved:</span>
            <img className="w-[620px] object-cover h-[320px]" src={screenshot} />
            <div className="flex gap-x-6 mt-2 justify-center">
              <a className="bg-green-600 px-3 py-2 rounded-md" href={screenshot} download={"screenshot"}>Download</a>
              <button className=" bg-red-600 px-3 py-2 rounded-md" onClick={() => setScreenshot(null)}>Delete</button>
            </div>
          </div>
        }
      </div>
    </>
  );
};

export default WebcamComponent;