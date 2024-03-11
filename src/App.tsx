import { useState } from "react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";

import { ContentfulUpload } from "./ContentfulUpload";

import "@uppy/core/dist/style.min.css";
import "@uppy/drag-drop/dist/style.min.css";

function App() {
  const [uppy] = useState(() => new Uppy().use(ContentfulUpload));
  return <Dashboard uppy={uppy} />;
}

export default App;
