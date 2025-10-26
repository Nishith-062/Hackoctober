import React, { useState } from "react";
import axios from "axios";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  TrackRefContext,
  useTracks,
  VideoTrack,
  TrackLoop,
  Chat,
  ControlBar,
  DisconnectButton,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useParams } from "react-router-dom";
import { CollaborativeEditor } from "../../../CollaborativeEditor";
import { Clock, User, Video } from "lucide-react";

// Dummy questions
// Dummy questions
const questionSet = [
  {
    id: "prob-4",
    title: "Two Sum",
    description: "Return indices of two numbers that sum to target.",
    difficulty: "Medium",
    initialCode: {
      javascript:
        "function twoSum(nums, target) {\n    // Write your code here\n    for(let i=0;i<nums.length;i++){\n        for(let j=i+1;j<nums.length;j++){\n            if(nums[i]+nums[j]===target) return [i,j];\n        }\n    }\n    return [];\n}",
      python3:
        "def two_sum(nums, target):\n    # Write your code here\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i]+nums[j]==target: return [i,j]\n    return [];",
    },
    testCases: [
      { input: [[2, 7, 11, 15], 9], output: [0, 1], is_hidden: false },
      { input: [[3, 2, 4], 6], output: [1, 2], is_hidden: true },
      { input: [[1, 1, 2], 2], output: [0, 1], is_hidden: true },
    ],
    hints: ["Use nested loops", "Check all pairs"],
  },
  {
    id: "prob-5",
    title: "Remove Duplicates",
    description: "Remove duplicates from a sorted array.",
    difficulty: "Medium",
    initialCode: {
      javascript:
        "function removeDuplicates(nums) {\n    // Write your code here\n    return [...new Set(nums)];\n}",
      python3:
        "def remove_duplicates(nums):\n    # Write your code here\n    return list(dict.fromkeys(nums))",
    },
    testCases: [
      { input: [[1, 1, 2]], output: [1, 2], is_hidden: false },
      { input: [[2, 2, 2, 3]], output: [2, 3], is_hidden: true },
      { input: [[0, 0, 0, 0]], output: [0], is_hidden: true },
    ],
    hints: ["Use set or hashmap"],
  },
  {
    id: "prob-6",
    title: "Rotate Array",
    description: "Rotate array to the right by k steps.",
    difficulty: "Medium",
    initialCode: {
      javascript:
        "function rotate(nums,k) {\n    // Write your code here\n    k %= nums.length;\n    return nums.slice(-k).concat(nums.slice(0,-k));\n}",
      python3:
        "def rotate(nums,k):\n    # Write your code here\n    k %= len(nums)\n    return nums[-k:] + nums[:-k]",
    },
    testCases: [
      {
        input: [[1, 2, 3, 4, 5, 6, 7], 3],
        output: [5, 6, 7, 1, 2, 3, 4],
        is_hidden: false,
      },
      {
        input: [[-1, -100, 3, 99], 2],
        output: [3, 99, -1, -100],
        is_hidden: true,
      },
      { input: [[1, 2, 3], 4], output: [3, 1, 2], is_hidden: true },
    ],
    hints: ["Use slicing or reverse segments"],
  },
];


// Video track component
function TracksView() {
  const tracks = useTracks([{ source: Track.Source.Camera }], {
    onlySubscribed: true,
  });
  return (
    <div className="w-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 aspect-video flex items-center justify-center shadow-lg border border-slate-700">
      {tracks.length > 0 ? (
        <TrackLoop tracks={tracks}>
          <TrackRefContext.Consumer>
            {(trackRefs) => trackRefs && <VideoTrack trackRef={trackRefs} />}
          </TrackRefContext.Consumer>
        </TrackLoop>
      ) : (
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-slate-700/50 p-6 mb-3 backdrop-blur-sm">
            <Video className="w-10 h-10 text-slate-400" />
          </div>
          <p className="text-slate-400 text-sm font-medium">Waiting for video...</p>
        </div>
      )}
    </div>
  );
}

const CandidateRoom = () => {
  const { token } = useParams();
  const [activeTab, setActiveTab] = useState(questionSet[0].id);
  const [runResult, setRunResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRunCode = async (problemId) => {
    setLoading(true);
    setRunResult(null);

    const code = window.getCollaborativeEditorCode?.(problemId) || "";
    const language = "python3"; 
    const problemSetId = "set-2";

    try {
      const res = await axios.post(`http://localhost:3000/run/${problemId}`, {
        code,
        language,
        problemSetId,
      });
      setRunResult(res.data);
    } catch (err) {
      setRunResult({
        error: err.response?.data?.error || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const activeQuestion = questionSet.find((q) => q.id === activeTab);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <LiveKitRoom
        token={token}
        serverUrl="wss://hackoctober-y7aeqri9.livekit.cloud"
        connect
        audio
        video
      >
        <RoomAudioRenderer />

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 flex items-center justify-between px-8 z-10 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-100">Candidate Name</p>
              <p className="text-xs text-slate-400">Software Engineer</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-slate-800/50 px-5 py-2.5 rounded-xl border border-slate-700/50">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="font-mono text-2xl font-semibold text-slate-100 tracking-wider">
                45:00
              </span>
            </div>
            <DisconnectButton className="px-5 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all duration-200 font-medium">
              Exit
            </DisconnectButton>
          </div>
        </div>

        <div className="flex flex-grow mt-20 overflow-hidden">
          {/* Left Tabbed Questions Panel */}
          <div className="w-96 bg-slate-900/50 backdrop-blur-sm border-r border-slate-700/50 flex-shrink-0 flex flex-col">
            <div className="tabs flex flex-col p-4 border-b border-slate-700/50">
              {questionSet.map((q) => (
                <button
                  key={q.id}
                  className={`tab tab-lifted text-left ${activeTab === q.id ? "tab-active" : ""}`}
                  onClick={() => setActiveTab(q.id)}
                >
                  {q.title}
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto flex-grow">
              {activeQuestion && (
                <div>
                  <p className="text-slate-300 leading-relaxed text-sm mb-4">{activeQuestion.description}</p>

                  <div className="pt-2 mb-4">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 block">
                      Constraints
                    </span>
                    <ul className="space-y-2 text-sm text-slate-400">
                      {activeQuestion.constraints?.map((c, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-400 mt-0.5">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleRunCode(activeQuestion.id)}
                    disabled={loading}
                    className="mb-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {loading ? "Running..." : "Run Code"}
                  </button>

                  {runResult && runResult.results && (
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 block">
                        Result {runResult.allPassed ? "(All Passed ✅)" : "(Some Failed ❌)"}
                      </span>

                      <div className="space-y-3">
                        {runResult.results.map((r) => (
                          <div key={r.test_case_id} className="p-2 rounded border border-slate-700/40">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-mono text-xs text-slate-300">Test Case #{r.test_case_id}</span>
                              <span className={r.passed ? "text-green-400 text-sm font-semibold" : "text-red-500 text-sm font-semibold"}>
                                {r.passed ? "Passed" : "Failed"}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 mb-1"><strong>Input:</strong> {r.input}</div>
                            <div className="text-xs text-slate-400 mb-1"><strong>Expected:</strong> {r.expected_output}</div>
                            <div className="text-xs text-slate-400"><strong>Actual:</strong> {r.actual_output}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {runResult && runResult.error && (
                    <div className="bg-red-900/50 text-red-300 rounded p-3 mt-2">
                      <strong>Error:</strong> {runResult.error}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Collaborative Editor */}
          <div className="flex-grow bg-slate-950">
            <CollaborativeEditor
              currentProblemId={activeTab}
              initialCode={activeQuestion?.initialCode || { javascript: "", python3: "" }}
            />
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col w-96 flex-shrink-0 bg-slate-900/50 backdrop-blur-sm border-l border-slate-700/50">
            <div className="p-5 border-b border-slate-700/50">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Participant</h3>
              <TracksView />
            </div>
            <div className="flex-grow p-5 overflow-y-auto">
              <Chat />
            </div>
          </div>
        </div>
      </LiveKitRoom>
    </div>
  );
};

export default CandidateRoom;
