import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import scheduleinterviewRoute from "./routes/interview.route.js";
import candidateRoutes from "./routes/candidate.route.js";
import cors from "cors";
import axios from "axios";
import problemSets from "./problemSets.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT;
app.use(clerkMiddleware());

app.use("/api/auth", authRoutes);
app.use("/api/interviewer", scheduleinterviewRoute);
app.use("/api/candidate", candidateRoutes);

const languageMap = {
  javascript: 63,
  python3: 71,
  cpp: 54,
  c: 50,
  java: 62,
};

app.get("/problems", async (req, res) => {
  res.json(problemSets);
});

app.post("/run/:problemId", async (req, res) => {
  try {
    const { code, language, problemSetId } = req.body;
    console.log(req.body);

    const { problemId } = req.params;

    console.log("📨 Running code in language:", language);

    if (!code || !language || !problemSetId) {
      return res
        .status(400)
        .json({ error: "Code, language, and problemSetId are required" });
    }

    const problemSet = problemSets.find((set) => set.id === problemSetId);
    if (!problemSet)
      return res.status(404).json({ error: "Problem set not found" });

    const problem = problemSet.problems.find((p) => p.id === problemId);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    const results = await runTestCases(problem, code, language);

    res.json({
      results: results,
      allPassed: results.every((r) => r.passed),
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function runTestCases(problem, userCode, language) {
  const results = [];

  for (let i = 0; i < problem.testCases.length; i++) {
    const testCase = problem.testCases[i];
    try {
      const fullCode = generateCodeForLanguage(
        userCode,
        language,
        problem,
        testCase
      );

      const output = await executeCode(fullCode, languageMap[language]);
      const passed = compareOutput(output, testCase.output, problem.title);

      results.push({
        test_case_id: i + 1,
        passed,
        input: JSON.stringify(testCase.input),
        expected_output: JSON.stringify(testCase.output),
        actual_output: output,
        is_hidden: testCase.is_hidden,
      });
    } catch (error) {
      console.error(`❌ Error in test case ${i + 1}:`, error.message);
      results.push({
        test_case_id: i + 1,
        passed: false,
        input: JSON.stringify(testCase.input),
        expected_output: JSON.stringify(testCase.output),
        actual_output: "Error: " + error.message,
        is_hidden: testCase.is_hidden,
      });
    }
  }

  return results;
}

function generateCodeForLanguage(userCode, language, problem, testCase) {
  const functionName = getFunctionName(userCode, language, problem.title);
  const inputs = Array.isArray(testCase.input)
    ? testCase.input
    : [testCase.input];

  switch (language) {
    case "javascript":
      return `${userCode}\n\n// Test case\nconsole.log(JSON.stringify(${functionName}(${inputs
        .map((i) => JSON.stringify(i))
        .join(", ")})));`;

    case "python3":
      let pythonCode = userCode;
      if (!pythonCode.includes("def ")) {
        // Remove the incorrect backticks and use proper string concatenation
        pythonCode = `def ${functionName}(${getPythonParams(
          inputs.length
        )}):\n    ${getPythonReturn(problem.title)}`;
      }
      return `${pythonCode}\n\n# Test case\nresult = ${functionName}(${inputs
        .map((i) => JSON.stringify(i))
        .join(", ")})\nprint(str(result))`;

    case "cpp":
      return generateCppCode(userCode, problem, testCase, functionName, inputs);

    case "c":
      return generateCCode(userCode, problem, testCase, functionName, inputs);

    case "java":
      return generateJavaCode(
        userCode,
        problem,
        testCase,
        functionName,
        inputs
      );

    default:
      return userCode;
  }
}

// --- LITERAL FORMATTERS ---
function formatCppLiteral(value) {
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "boolean") return value ? "true" : "false";
  return value; // number or other
}

function formatCLiteral(value) {
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "boolean") return value ? "1" : "0";
  return value;
}

function formatJavaLiteral(value) {
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "boolean") return value ? "true" : "false";
  return value;
}

function formatPythonLiteral(value) {
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "boolean") return value ? "True" : "False";
  return value;
}

// --- C++ CODE GENERATOR ---
function generateCppCode(userCode, problem, testCase, functionName, inputs) {
  let cppCode = userCode;

  const includes = new Set(["#include <iostream>"]);
  if (problem.title === "Reverse String") {
    includes.add("#include <string>");
    includes.add("#include <algorithm>");
  } else if (problem.title === "Two Sum") {
    includes.add("#include <vector>");
  }

  if (!cppCode.includes("#include <iostream>")) {
    cppCode =
      Array.from(includes).join("\n") + "\nusing namespace std;\n\n" + cppCode;
  } else if (
    !cppCode.includes("using namespace std;") &&
    !cppCode.includes("std::")
  ) {
    cppCode = cppCode.replace(/#include.*\n/, "$&\nusing namespace std;\n");
  }

  let mainCode = "\n\nint main() {";

  if (problem.title === "Two Sum") {
    const arr = inputs[0].map(formatCppLiteral).join(", ");
    mainCode += `\n    vector<int> nums = {${arr}};\n`;
    mainCode += `    int target = ${inputs[1]};\n`;
    mainCode += `    vector<int> result = ${functionName}(nums, target);\n`;
    mainCode += `    cout << "[" << result[0] << ", " << result[1] << "]" << endl;`;
  } else if (problem.title === "Reverse String") {
    mainCode += `\n    string s = ${formatCppLiteral(inputs[0])};\n`;
    mainCode += `    string result = ${functionName}(s);\n`;
    mainCode += `    cout << result << endl;`;
  } else {
    mainCode += `\n    int a = ${inputs[0]}, b = ${inputs[1]};\n`;
    mainCode += `    int result = ${functionName}(a, b);\n`;
    mainCode += `    cout << result << endl;`;
  }

  mainCode += "\n    return 0;\n}";

  return cppCode + mainCode;
}

// --- C CODE GENERATOR ---
function generateCCode(userCode, problem, testCase, functionName, inputs) {
  let cCode = userCode;

  if (!cCode.includes("#include <stdio.h>"))
    cCode = `#include <stdio.h>\n${cCode}`;
  if (
    problem.title === "Reverse String" &&
    !cCode.includes("#include <string.h>")
  )
    cCode = `#include <string.h>\n${cCode}`;
  if (problem.title === "Two Sum" && !cCode.includes("#include <stdlib.h>"))
    cCode = `#include <stdlib.h>\n${cCode}`;

  let mainCode = "\n\nint main() {";

  if (problem.title === "Two Sum") {
    const arr = inputs[0].join(", ");
    mainCode += `\n    int nums[] = {${arr}};\n`;
    mainCode += `    int numsSize = ${inputs[0].length};\n`;
    mainCode += `    int target = ${inputs[1]};\n`;
    mainCode += `    int returnSize;\n`;
    mainCode += `    int* result = ${functionName}(nums, numsSize, target, &returnSize);\n`;
    mainCode += `    printf("[%d, %d]\\n", result[0], result[1]);\n`;
    mainCode += `    free(result);`;
  } else if (problem.title === "Reverse String") {
    mainCode += `\n    char s[] = ${formatCLiteral(inputs[0])};\n`;
    mainCode += `    ${functionName}(s);\n`;
    mainCode += `    printf("%s\\n", s);`;
  } else {
    mainCode += `\n    int a = ${inputs[0]}, b = ${inputs[1]};\n`;
    mainCode += `    int result = ${functionName}(a, b);\n`;
    mainCode += `    printf("%d\\n", result);`;
  }

  mainCode += "\n    return 0;\n}";

  return cCode + mainCode;
}

// --- JAVA CODE GENERATOR ---
function generateJavaCode(userCode, problem, testCase, functionName, inputs) {
  let javaCode = userCode;

  if (!javaCode.includes("public class Main")) {
    let mainMethod = "\n    public static void main(String[] args) {\n";

    if (problem.title === "Two Sum") {
      const arr = inputs[0].map(formatJavaLiteral).join(", ");
      mainMethod += `        int[] nums = {${arr}};\n`;
      mainMethod += `        int target = ${inputs[1]};\n`;
      mainMethod += `        int[] result = ${functionName}(nums, target);\n`;
      mainMethod += `        System.out.println("[" + result[0] + ", " + result[1] + "]");\n`;
    } else if (problem.title === "Reverse String") {
      mainMethod += `        String s = ${formatJavaLiteral(inputs[0])};\n`;
      mainMethod += `        String result = ${functionName}(s);\n`;
      mainMethod += `        System.out.println(result);\n`;
    } else {
      mainMethod += `        int a = ${inputs[0]}, b = ${inputs[1]};\n`;
      mainMethod += `        int result = ${functionName}(a, b);\n`;
      mainMethod += `        System.out.println(result);\n`;
    }

    mainMethod += `    }\n}`;
    javaCode = `public class Main {\n${javaCode}${mainMethod}`;
  }

  return javaCode;
}

// --- FUNCTION NAME DETECTION ---
function getFunctionName(code, language, problemTitle) {
  switch (language) {
    case "javascript":
      const jsMatch = code.match(/function\s+(\w+)/);
      return jsMatch ? jsMatch[1] : getDefaultFunctionName(problemTitle);
    case "python3":
      const pyMatch = code.match(/def\s+(\w+)/);
      return pyMatch ? pyMatch[1] : getDefaultFunctionName(problemTitle);
    case "cpp":
      const cppMatch = code.match(/(?:int|string|vector<int>|void)\s+(\w+)/);
      return cppMatch ? cppMatch[1] : getDefaultFunctionName(problemTitle);
    case "c":
      const cMatch = code.match(/(?:int|char\*|void)\s+(\w+)/);
      return cMatch ? cMatch[1] : getDefaultFunctionName(problemTitle);
    case "java":
      const javaMatch = code.match(/static\s+\w+\s+(\w+)/);
      return javaMatch ? javaMatch[1] : getDefaultFunctionName(problemTitle);
    default:
      return getDefaultFunctionName(problemTitle);
  }
}

function getDefaultFunctionName(problemTitle) {
  switch (problemTitle) {
    case "Add Two Numbers":
      return "add";
    case "Reverse String":
      return "reverseString";
    case "Two Sum":
      return "twoSum";
    default:
      return "solution";
  }
}

// --- PYTHON HELPERS ---

function getPythonReturn(problemTitle) {
  switch (problemTitle) {
    case "Add Two Numbers":
      return "return a + b";
    case "Reverse String":
      return "return s[::-1]";
    case "Two Sum":
      return "return [0, 1]"; // This should be dynamic based on actual logic
    default:
      return "return None";
  }
}

function getPythonParams(paramCount) {
  const params = ["a", "b", "c", "d", "e"];
  return params.slice(0, paramCount).join(", ");
}

// --- OUTPUT COMPARISON ---
function compareOutput(actual, expected, problemTitle) {
  try {
    let cleanActual = actual.trim();

    // Remove surrounding quotes if present
    if (cleanActual.startsWith('"') && cleanActual.endsWith('"')) {
      cleanActual = cleanActual.slice(1, -1);
    }

    // Handle array outputs
    if (cleanActual.startsWith("[") && cleanActual.endsWith("]")) {
      try {
        const parsedActual = JSON.parse(cleanActual);
        const parsedExpected = Array.isArray(expected)
          ? expected
          : JSON.parse(expected);
        return JSON.stringify(parsedActual) === JSON.stringify(parsedExpected);
      } catch (e) {
        return cleanActual === JSON.stringify(expected);
      }
    }

    // Handle number comparisons
    if (!isNaN(cleanActual) && !isNaN(expected)) {
      return Number(cleanActual) === Number(expected);
    }

    // Handle boolean comparisons
    if (
      cleanActual.toLowerCase() === "true" ||
      cleanActual.toLowerCase() === "false"
    ) {
      return (
        Boolean(cleanActual.toLowerCase() === "true") === Boolean(expected)
      );
    }

    return cleanActual === String(expected);
  } catch (e) {
    return actual.trim() === String(expected);
  }
}

// --- EXECUTE CODE ---
async function executeCode(sourceCode, languageId) {
  try {
    const base64Code = Buffer.from(sourceCode).toString("base64");
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true",
      {
        source_code: base64Code,
        language_id: languageId,
        stdin: "",
        redirect_stderr_to_stdout: true,
      },
      {
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key":
            "b94da70092msha5e94c8ff739cbcp12d50cjsnab8e6c006350",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        timeout: 15000,
      }
    );

    let output = "";
    if (response.data.stdout) {
      output = Buffer.from(response.data.stdout, "base64").toString("utf-8");
    } else if (response.data.stderr) {
      output = Buffer.from(response.data.stderr, "base64").toString("utf-8");
    } else if (response.data.compile_output) {
      output = Buffer.from(response.data.compile_output, "base64").toString(
        "utf-8"
      );
    } else if (response.data.message) {
      output = response.data.message;
    } else {
      output = "No output received";
    }

    // Check for execution errors
    if (response.data.status && response.data.status.id > 3) {
      throw new Error(
        output ||
          `Execution failed with status ${response.data.status.description}`
      );
    }

    return output.trim();
  } catch (error) {
    console.error("Judge0 API Error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error || error.message || "Code execution failed"
    );
  }
}

app.listen(PORT, () => {
  console.log(`running on http://localhost:3000`);
  connectDB();
});
