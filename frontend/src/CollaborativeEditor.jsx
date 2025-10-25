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

  const handleOnMount = useCallback((editor) => {
    setEditorRef(editor);
  }, []);

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
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-lg">Initializing collaborative editor...</div>
          <div className="text-sm text-gray-400 mt-2">Connecting to room</div>
        </div>
      </div>
    );
  }

  const currentLanguageConfig = LANGUAGE_CONFIGS[selectedLanguage];
  const compilerOptionsUI = COMPILER_OPTIONS_UI[selectedLanguage] || [];

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header with language selector and settings */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <select 
            value={selectedLanguage} 
            onChange={handleLanguageChange}
            className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(LANGUAGE_CONFIGS).map(([key, config]) => (
              <option key={key} value={key}>{config.name}</option>
            ))}
          </select>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
          >
            {showSettings ? "Hide Settings" : "Compiler Options"}
          </button>
        </div>
        
        <div className="text-sm text-gray-300">
          Connected users: {others.length + 1}
        </div>
      </div>

      {/* Compiler Options Panel */}
      {showSettings && (
        <div className="bg-gray-800 text-white p-4 border-b border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Compiler Options for {currentLanguageConfig.name}</h3>
            <button
              onClick={resetCompilerOptions}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {compilerOptionsUI.map((option) => (
              <div key={option.key} className="flex flex-col">
                <label className="text-sm text-gray-300 mb-1">{option.label}</label>
                {option.type === "boolean" ? (
                  <input
                    type="checkbox"
                    checked={!!compilerOptions[option.key]}
                    onChange={(e) => handleCompilerOptionChange(option.key, e.target.checked)}
                    className="w-4 h-4"
                  />
                ) : option.type === "select" ? (
                  <select
                    value={compilerOptions[option.key] || ""}
                    onChange={(e) => handleCompilerOptionChange(option.key, e.target.value)}
                    className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                    className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Display current compiler options as JSON for debugging */}
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-gray-400">Debug: Current Compiler Options</summary>
            <pre className="text-xs bg-gray-900 p-2 mt-2 rounded overflow-auto">
              {JSON.stringify(compilerOptions, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1">
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
      <div className="bg-gray-800 text-white px-4 py-2 text-sm border-t border-gray-700 flex justify-between">
        <span>Language: {currentLanguageConfig.name}</span>
        <span>Line endings: LF • UTF-8 • {room.id}</span>
      </div>
    </div>
  );
}