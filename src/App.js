import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [listName, setListName] = useState(new Set());
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState("");

  const handleChange = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      setData(JSON.parse(e.target.result));
    };
  };
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };

  const handlePick = (name) => {
    const newList = new Set(listName);
    if (listName.has(name)) {
      newList.delete(name);
      setListName(new Set(newList));
    } else {
      newList.add(name);
      setListName(new Set(newList));
    }
  };
  console.log(listName);

  return (
    <div className="App">
      <input
        type="file"
        onChange={onSelectFile}
        accept="image/png, image/jpeg"
      />
      <input type="file" onChange={handleChange} accept=".json" />
      <div
        style={{
          margin: 20,
          width: "fit-content",
          height: "fit-content",
          position: "relative",
        }}
      >
        {data &&
          Object.keys(data.frames).map((name) => (
            <div
              onClick={() => handlePick(name)}
              style={{
                position: "absolute",
                left: data.frames[name].frame.x,
                top: data.frames[name].frame.y,
                width: data.frames[name].frame.w,
                height: data.frames[name].frame.h,
                border: `1px solid ${listName.has(name) ? "green" : "black"}`,
                opacity: `${listName.has(name) ? 0.5 : 1}`,
                background: `${listName.has(name) ? "blue" : "transparent"}`,
              }}
            ></div>
          ))}
        {selectedFile && <img src={preview} className="relative" />}
      </div>
      <div>
        <div>{`[${Array.from(listName).map((item) =>
          JSON.stringify({ name: item, time: 100 })
        )}]`}</div>
      </div>
    </div>
  );
}

export default App;
