const problemSets = [
  {
    id: 'set-1',
    title: "Beginner Problems",
    duration: 60,
    difficulty: "Easy",
    problems: [
      {
        id: 'prob-1',
        title: "Add Two Numbers",
        description: "Write a function that returns the sum of two numbers.",
        difficulty: "Easy",
        initialCode: {
          javascript: "function add(a, b) {\n    // Write your code here\n    return a + b;\n}",
          python3: "def add(a, b):\n    # Write your code here\n    return a + b",
          cpp: "#include <iostream>\nusing namespace std;\n\nint add(int a, int b) {\n    // Write your code here\n    return a + b;\n}",
          c: "#include <stdio.h>\n\nint add(int a, int b) {\n    // Write your code here\n    return a + b;\n}",
          java: "public class Main {\n    public static int add(int a, int b) {\n        // Write your code here\n        return a + b;\n    }\n}"
        },
        testCases: [
          { input: [2, 3], output: 5, is_hidden: false },
          { input: [5, 10], output: 15, is_hidden: true },
          { input: [0, 0], output: 0, is_hidden: true }
        ],
        hints: ["Simple addition", "Return the sum"]
      },
      {
        id: 'prob-2',
        title: "Reverse String",
        description: "Reverse the given string.",
        difficulty: "Easy",
        initialCode: {
          javascript: "function reverseString(s) {\n    // Write your code here\n    return s.split('').reverse().join('');\n}",
          python3: "def reverse_string(s):\n    # Write your code here\n    return s[::-1]",
          cpp: "#include <iostream>\n#include <algorithm>\n#include <string>\nusing namespace std;\n\nstring reverseString(string s) {\n    // Write your code here\n    reverse(s.begin(), s.end());\n    return s;\n}",
          c: "#include <stdio.h>\n#include <string.h>\n\nvoid reverseString(char* s) {\n    // Write your code here\n    int len = strlen(s);\n    for (int i = 0; i < len / 2; i++) {\n        char temp = s[i];\n        s[i] = s[len - i - 1];\n        s[len - i - 1] = temp;\n    }\n}",
          java: "public class Main {\n    public static String reverseString(String s) {\n        // Write your code here\n        return new StringBuilder(s).reverse().toString();\n    }\n}"
        },
        testCases: [
          { input: ["hello"], output: "olleh", is_hidden: false },
          { input: ["world"], output: "dlrow", is_hidden: true },
          { input: ["coding"], output: "gnidoc", is_hidden: true }
        ],
        hints: ["Use string reversal methods"]
      },
      {
        id: 'prob-3',
        title: "Find Maximum",
        description: "Return the maximum number in an array.",
        difficulty: "Easy",
        initialCode: {
          javascript: "function findMax(arr) {\n    // Write your code here\n    return Math.max(...arr);\n}",
          python3: "def find_max(arr):\n    # Write your code here\n    return max(arr)",
          cpp: "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint findMax(vector<int> arr){\n    // Write your code here\n    return *max_element(arr.begin(), arr.end());\n}",
          c: "int findMax(int* arr, int n){\n    // Write your code here\n    int max = arr[0];\n    for(int i=1;i<n;i++) if(arr[i]>max) max=arr[i];\n    return max;\n}",
          java: "public static int findMax(int[] arr){\n    // Write your code here\n    int max = arr[0];\n    for(int n:arr) if(n>max) max=n;\n    return max;\n}"
        },
        testCases: [
          { input: [[1,2,3]], output: 3, is_hidden: false },
          { input: [[-5,0,5]], output: 5, is_hidden: true },
          { input: [[100,50,200]], output: 200, is_hidden: true }
        ],
        hints: ["Iterate and compare values"]
      }
    ]
  },
  {
    id: 'set-2',
    title: "Array Problems",
    duration: 75,
    difficulty: "Medium",
    problems: [
      {
        id: 'prob-4',
        title: "Two Sum",
        description: "Return indices of two numbers that sum to target.",
        difficulty: "Medium",
        initialCode: {
          javascript: "function twoSum(nums, target) {\n    // Write your code here\n    for(let i=0;i<nums.length;i++){\n        for(let j=i+1;j<nums.length;j++){\n            if(nums[i]+nums[j]===target) return [i,j];\n        }\n    }\n    return [];\n}",
          python3: "def two_sum(nums, target):\n    # Write your code here\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i]+nums[j]==target: return [i,j]\n    return [];"
        },
        testCases: [
          { input: [[2,7,11,15],9], output: [0,1], is_hidden: false },
          { input: [[3,2,4],6], output: [1,2], is_hidden: true },
          { input: [[1,1,2],2], output: [0,1], is_hidden: true }
        ],
        hints: ["Use nested loops", "Check all pairs"]
      },
      {
        id: 'prob-5',
        title: "Remove Duplicates",
        description: "Remove duplicates from a sorted array.",
        difficulty: "Medium",
        initialCode: {
          javascript: "function removeDuplicates(nums) {\n    // Write your code here\n    return [...new Set(nums)];\n}",
          python3: "def remove_duplicates(nums):\n    # Write your code here\n    return list(dict.fromkeys(nums))"
        },
        testCases: [
          { input: [[1,1,2]], output: [1,2], is_hidden: false },
          { input: [[2,2,2,3]], output: [2,3], is_hidden: true },
          { input: [[0,0,0,0]], output: [0], is_hidden: true }
        ],
        hints: ["Use set or hashmap"]
      },
      {
        id: 'prob-6',
        title: "Rotate Array",
        description: "Rotate array to the right by k steps.",
        difficulty: "Medium",
        initialCode: {
          javascript: "function rotate(nums,k) {\n    // Write your code here\n    k %= nums.length;\n    return nums.slice(-k).concat(nums.slice(0,-k));\n}",
          python3: "def rotate(nums,k):\n    # Write your code here\n    k %= len(nums)\n    return nums[-k:] + nums[:-k]"
        },
        testCases: [
          { input: [[1,2,3,4,5,6,7],3], output: [5,6,7,1,2,3,4], is_hidden: false },
          { input: [[-1,-100,3,99],2], output: [3,99,-1,-100], is_hidden: true },
          { input: [[1,2,3],4], output: [3,1,2], is_hidden: true }
        ],
        hints: ["Use slicing or reverse segments"]
      }
    ]
  },
  {
    id: 'set-3',
    title: "Advanced Problems",
    duration: 90,
    difficulty: "Hard",
    problems: [
      {
        id: 'prob-7',
        title: "Longest Palindromic Substring",
        description: "Find the longest palindromic substring in a string.",
        difficulty: "Hard",
        initialCode: {
          javascript: "function longestPalindrome(s) {\n    // Write your code here\n}",
          python3: "def longest_palindrome(s):\n    # Write your code here\n    return ''"
        },
        testCases: [
          { input: ["babad"], output: "bab", is_hidden: false },
          { input: ["cbbd"], output: "bb", is_hidden: true },
          { input: ["a"], output: "a", is_hidden: true }
        ],
        hints: ["Expand around center"]
      },
      {
        id: 'prob-8',
        title: "Median of Two Sorted Arrays",
        description: "Find the median of two sorted arrays.",
        difficulty: "Hard",
        initialCode: {
          javascript: "function findMedianSortedArrays(nums1, nums2) {\n    // Write your code here\n}",
          python3: "def find_median(nums1, nums2):\n    # Write your code here\n    return 0"
        },
        testCases: [
          { input: [[1,3],[2]], output: 2.0, is_hidden: false },
          { input: [[1,2],[3,4]], output: 2.5, is_hidden: true },
          { input: [[0,0],[0,0]], output: 0.0, is_hidden: true }
        ],
        hints: ["Use binary search or merge arrays"]
      },
      {
        id: 'prob-9',
        title: "Word Ladder",
        description: "Transform beginWord to endWord with minimum steps.",
        difficulty: "Hard",
        initialCode: {
          javascript: "function ladderLength(beginWord, endWord, wordList) {\n    // Write your code here\n}",
          python3: "def ladder_length(beginWord, endWord, wordList):\n    # Write your code here\n    return 0"
        },
        testCases: [
          { input: ["hit","cog",["hot","dot","dog","lot","log","cog"]], output: 5, is_hidden: false },
          { input: ["hit","cog",["hot","dot","dog","lot","log"]], output: 0, is_hidden: true },
          { input: ["a","c",["a","b","c"]], output: 2, is_hidden: true }
        ],
        hints: ["Use BFS"]
      }
    ]
  }
];

export default problemSets;
