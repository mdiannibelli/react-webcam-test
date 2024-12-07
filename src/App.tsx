import WebcamComponent from "./components/WebcamComponent";

function App() {
  const webcamConfig = {
    audio: false,
    videoConstraints: {
      width: 920,
      height: 620,
      facingMode: "user"
    }
  };

  return (
    <>
      <header className="flex justify-center my-12">
        <h1 className="text-white text-4xl font-semibold">React Webcam</h1>
      </header>
      <main className="flex justify-center max-w-[1024px] mx-auto">
        <WebcamComponent webcamConfig={webcamConfig} />
      </main>
    </>
  );
}

export default App;
