import { useState } from "react";

export default function App(): React.ReactNode {
  const [files, setFiles] = useState<string[]>([]);
  const [directoryPath, setDirectoryPath] = useState<string>("");

  async function handleClick() {
    const result = await window.electronAPI.openDirectory();
    if (!result.canceled && result.files && result.directoryPath) {
      setFiles(result.files);
      setDirectoryPath(result.directoryPath);
    }
  }
  return (
    <>
      <div>this is React App</div>
      <button onClick={handleClick}>open dir</button>
      <p>{directoryPath}</p>
      <ul>
        {files.map((f) => (
          <span>{f}</span>
        ))}
      </ul>
    </>
  );
}
