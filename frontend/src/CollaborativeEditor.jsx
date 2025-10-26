import * as Y from "yjs";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { useRoom, useOthers } from "../liveblocks.config";
import { useCallback, useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import React from "react";

// Supported languages with their default compiler options
const LANGUAGE_CONFIGS = {
  javascript: {
    name: "JavaScript",
    defaultCode: "// Write your JavaScript code here\nconsole.log('Hello, World!');",
    compilerOptions: {
      target: "ES2020",
      module: "ESNext",
      lib: ["ES2020", "DOM"],
      allowJs: true,
      checkJs: false,
      jsx: "preserve",
      declaration: false,
      strict: false,
      noEmit: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
    }
  },
  typescript: {
    name: "TypeScript",
    defaultCode: "// Write your TypeScript code here\nconst message: string = 'Hello, World!';\nconsole.log(message);",
    compilerOptions: {
      target: "ES2020",
      module: "ESNext",
      lib: ["ES2020", "DOM"],
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      declaration: true,
      declarationMap: true,
      sourceMap: true,
    }
  },
  python: {
    name: "Python",
    defaultCode: "# Write your Python code here\nprint('Hello, World!')",
    compilerOptions: {
      target: "python3",
      checkTypes: true,
      strict: true,
    }
  },
  java: {
    name: "Java",
    defaultCode: "// Write your Java code here\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}",
    compilerOptions: {
      sourceVersion: "11",
      targetVersion: "11",
      lint: true,
      warnings: true,
    }
  },
  cpp: {
    name: "C++",
    defaultCode: "// Write your C++ code here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello, World!\" << endl;\n    return 0;\n}",
    compilerOptions: {
      cppStandard: "c++17",
      warnings: true,
      optimize: false,
      debug: true,
    }
  },
  csharp: {
    name: "C#",
    defaultCode: "// Write your C# code here\nusing System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine(\"Hello, World!\");\n    }\n}",
    compilerOptions: {
      target: "latest",
      nullable: true,
      warningsAsErrors: false,
      optimize: false,
    }
  },
  html: {
    name: "HTML",
    defaultCode: "<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello World</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>",
    compilerOptions: {
      format: true,
      validate: true,
    }
  },
  css: {
    name: "CSS",
    defaultCode: "/* Write your CSS code here */\nbody {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 20px;\n}",
    compilerOptions: {
      validate: true,
      lint: true,
    }
  },
  json: {
    name: "JSON",
    defaultCode: "{\n  \"name\": \"Hello World\",\n  \"version\": \"1.0.0\"\n}",
    compilerOptions: {
      validate: true,
      allowComments: false,
    }
  }
};

// Compiler options configuration interface
const COMPILER_OPTIONS_UI = {
  javascript: [
    { key: "target", label: "Target", type: "select", options: ["ES3", "ES5", "ES6", "ES2015", "ES2016", "ES2017", "ES2018", "ES2019", "ES2020", "ESNext"] },
    { key: "module", label: "Module", type: "select", options: ["CommonJS", "AMD", "System", "UMD", "ES6", "ES2015", "ESNext", "None"] },
    { key: "strict", label: "Strict Mode", type: "boolean" },
    { key: "allowJs", label: "Allow JS", type: "boolean" },
  ],
  typescript: [
    { key: "target", label: "Target", type: "select", options: ["ES3", "ES5", "ES6", "ES2015", "ES2016", "ES2017", "ES2018", "ES2019", "ES2020", "ESNext"] },
    { key: "strict", label: "Strict Mode", type: "boolean" },
    { key: "noEmit", label: "No Emit", type: "boolean" },
    { key: "sourceMap", label: "Source Map", type: "boolean" },
  ],
  python: [
    { key: "target", label: "Python Version", type: "select", options: ["python2", "python3"] },
    { key: "strict", label: "Strict Mode", type: "boolean" },
    { key: "checkTypes", label: "Type Checking", type: "boolean" },
  ],
  java: [
    { key: "sourceVersion", label: "Source Version", type: "select", options: ["8", "11", "17", "21"] },
    { key: "targetVersion", label: "Target Version", type: "select", options: ["8", "11", "17", "21"] },
    { key: "warnings", label: "Show Warnings", type: "boolean" },
  ],
  cpp: [
    { key: "cppStandard", label: "C++ Standard", type: "select", options: ["c++98", "c++11", "c++14", "c++17", "c++20"] },
    { key: "warnings", label: "Show Warnings", type: "boolean" },
    { key: "optimize", label: "Optimize", type: "boolean" },
  ],
  csharp: [
    { key: "target", label: "Target Framework", type: "select", options: ["netstandard2.0", "netcoreapp3.1", "net5.0", "net6.0", "latest"] },
    { key: "nullable", label: "Nullable Reference", type: "boolean" },
    { key: "warningsAsErrors", label: "Warnings as Errors", type: "boolean" },
  ]
};

export function CollaborativeEditor() {
  const [editorRef, setEditorRef] = useState();
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [compilerOptions, setCompilerOptions] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  const room = useRoom();
  const others = useOthers();
  const [yProvider, setYProvider] = useState(null);

  // Initialize compiler options based on selected language
  useEffect(() => {
    const config = LANGUAGE_CONFIGS[selectedLanguage];
    if (config) {
      setCompilerOptions(config.compilerOptions);
    }
  }, [selectedLanguage]);

  // Initialize Yjs provider
  useEffect(() => {
    if (room) {
      try {
        const provider = getYjsProviderForRoom(room);
        setYProvider(provider);
      } catch (error) {
        console.error("Failed to initialize Yjs provider:", error);
      }
    }
  }, [room]);

  // Set up Yjs binding
  useEffect(() => {
    if (!editorRef || !yProvider) return;

    try {
      const yDoc = yProvider.getYDoc();
      const yText = yDoc.getText(`monaco-${selectedLanguage}`);
      
      const binding = new MonacoBinding(
        yText,
        editorRef.getModel(),
        new Set([editorRef]),
        yProvider.awareness
      );

      return () => {
        binding?.destroy();
      };
    } catch (error) {
      console.error("Failed to set up Yjs binding:", error);
    }
  }, [editorRef, yProvider, selectedLanguage]);

  const editorRefCurrent = React.useRef(null);

  const handleOnMount = useCallback((editor) => {
    editorRefCurrent.current = editor;
    setEditorRef(editor);
  }, []);

  window.getCollaborativeEditorCode = (problemId) => {
    if (!editorRefCurrent.current) return "";
    return editorRefCurrent.current.getValue();
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleCompilerOptionChange = (key, value) => {
    setCompilerOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetCompilerOptions = () => {
    const config = LANGUAGE_CONFIGS[selectedLanguage];
    if (config) {
      setCompilerOptions(config.compilerOptions);
    }
  };

  // Check if room is properly connected
  const isLoaded = room && yProvider;

  if (!isLoaded) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <h1 className="text-2xl font-bold mt-4">Initializing collaborative editor...</h1>
            <p className="py-4">Connecting to room</p>
          </div>
        </div>
      </div>
    );
  }

  const currentLanguageConfig = LANGUAGE_CONFIGS[selectedLanguage];
  const compilerOptionsUI = COMPILER_OPTIONS_UI[selectedLanguage] || [];

  return (
    <div className="card bg-base-100 h-full flex flex-col">
      {/* Header with language selector and settings */}
      <div className="card-body p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <select 
              value={selectedLanguage} 
              onChange={handleLanguageChange}
              className="select select-bordered select-sm"
            >
              {Object.entries(LANGUAGE_CONFIGS).map(([key, config]) => (
                <option key={key} value={key}>{config.name}</option>
              ))}
            </select>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="btn btn-sm btn-primary"
            >
              {showSettings ? "Hide Settings" : "Compiler Options"}
            </button>
          </div>
          
          <div className="badge badge-outline">
            Connected users: {others.length + 1}
          </div>
        </div>

        {/* Compiler Options Panel */}
        {showSettings && (
          <div className="collapse collapse-arrow bg-base-200 mb-4">
            <input type="checkbox" defaultChecked />
            <div className="collapse-title text-lg font-medium">
              Compiler Options for {currentLanguageConfig.name}
            </div>
            <div className="collapse-content">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Settings</h3>
                <button
                  onClick={resetCompilerOptions}
                  className="btn btn-sm btn-ghost"
                >
                  Reset to Defaults
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {compilerOptionsUI.map((option) => (
                  <div key={option.key} className="form-control">
                    <label className="label">
                      <span className="label-text">{option.label}</span>
                    </label>
                    {option.type === "boolean" ? (
                      <input
                        type="checkbox"
                        checked={!!compilerOptions[option.key]}
                        onChange={(e) => handleCompilerOptionChange(option.key, e.target.checked)}
                        className="toggle toggle-primary"
                      />
                    ) : option.type === "select" ? (
                      <select
                        value={compilerOptions[option.key] || ""}
                        onChange={(e) => handleCompilerOptionChange(option.key, e.target.value)}
                        className="select select-bordered select-sm"
                      >
                        {option.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={compilerOptions[option.key] || ""}
                        onChange={(e) => handleCompilerOptionChange(option.key, e.target.value)}
                        className="input input-bordered input-sm"
                      />
                    )}
                  </div>
                ))}
              </div>
              
              {/* Display current compiler options as JSON for debugging */}
              <details className="mt-4">
                <summary className="cursor-pointer text-sm opacity-70">Debug: Current Compiler Options</summary>
                <pre className="text-xs bg-base-300 p-2 mt-2 rounded overflow-auto">
                  {JSON.stringify(compilerOptions, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 min-h-0">
          <Editor
            onMount={handleOnMount}
            height="100%"
            width="100%"
            theme="vs-dark"
            language={selectedLanguage}
            value={currentLanguageConfig.defaultCode}
            options={{
              tabSize: 2,
              minimap: { enabled: true },
              fontSize: 14,
              wordWrap: "on",
              automaticLayout: true,
              scrollBeyondLastLine: false,
              formatOnType: true,
              formatOnPaste: true,
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              ...compilerOptions
            }}
          />
        </div>

        {/* Status Bar */}
        <div className="flex justify-between items-center mt-2 text-sm opacity-70">
          <span>Language: {currentLanguageConfig.name}</span>
          <span>Line endings: LF • UTF-8 • {room.id}</span>
        </div>
      </div>
    </div>
  );
}
