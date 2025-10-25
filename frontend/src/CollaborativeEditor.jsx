import * as Y from "yjs";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { useRoom } from "../liveblocks.config"; // Now using the proper hook
import { useCallback, useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { MonacoBinding } from "y-monaco";
import React from "react";
import { Awareness } from "y-protocols/awareness";

// Collaborative text editor with simple rich text, live cursors, and live avatars
export function CollaborativeEditor() {
  const [editorRef, setEditorRef] = useState();
  const room = useRoom(); // This now uses the proper hook from Liveblocks
  const [yProvider, setYProvider] = useState(null);

  // Initialize Yjs provider after room is available
  useEffect(() => {
    if (room) {
      const provider = getYjsProviderForRoom(room);
      setYProvider(provider);
    }
  }, [room]);

  // Set up Liveblocks Yjs provider and attach Monaco editor
  useEffect(() => {
    let binding;

    if (editorRef && yProvider) {
      const yDoc = yProvider.getYDoc();
      const yText = yDoc.getText("monaco");

      // Attach Yjs to Monaco
      binding = new MonacoBinding(
        yText,
        editorRef.getModel(),
        new Set([editorRef]),
        yProvider.awareness
      );
    }

    return () => {
      binding?.destroy();
    };
  }, [editorRef, yProvider]);

  const handleOnMount = useCallback((e) => {
    setEditorRef(e);
  }, []);

  // Show loading until room and provider are ready
  if (!room || !yProvider) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div>Loading editor...</div>
      </div>
    );
  }

  return (
    <Editor
      onMount={handleOnMount}
      height="100vh"
      width="100%"
      theme="vs-dark"
      defaultLanguage="python"
      defaultValue="// Start coding collaboratively!"
      options={{
        tabSize: 2,
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: "on",
      }}
    />
  );
}