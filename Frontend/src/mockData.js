export const mockCurriculums = {
  "DSA": [
    {
      _id: 'dsa_1',
      title: '1. Arrays & Hashing',
      subtopics: [
        {
          _id: 'dsa_s1',
          title: 'Two Sum',
          status: 'completed',
          theoryContent: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
          starterCode: 'def two_sum(nums, target):\n    # Write your code here\n    pass'
        },
        {
          _id: 'dsa_s2',
          title: 'Valid Anagram',
          status: 'in_progress',
          theoryContent: 'An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
          starterCode: 'def is_anagram(s, t):\n    # Write your code here\n    pass'
        }
      ]
    },
    {
      _id: 'dsa_2',
      title: '2. Two Pointers',
      subtopics: [
        {
          _id: 'dsa_s3',
          title: 'Valid Palindrome',
          status: 'not_done',
          theoryContent: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
          starterCode: 'def is_palindrome(s):\n    # Write your code here\n    pass'
        }
      ]
    }
  ],
  "C++ programming": [
    {
      _id: 'cpp_1',
      title: '1. Basics',
      subtopics: [
        {
          _id: 'cpp_s1',
          title: 'Hello World & Variables',
          status: 'completed',
          theoryContent: 'C++ is a compiled language. Every C++ program must have a `main()` function.\nVariables store data and must be declared with a type.',
          starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
        }
      ]
    },
    {
      _id: 'cpp_2',
      title: '2. Control Flow',
      subtopics: [
        {
          _id: 'cpp_s2',
          title: 'If-Else Statements',
          status: 'in_progress',
          theoryContent: 'Use `if` to specify a block of code to be executed, if a specified condition is true.',
          starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int x = 10;\n    // check if x > 5\n    return 0;\n}'
        }
      ]
    }
  ],
  "Java OOP": [
    {
      _id: 'java_1',
      title: '1. Classes and Objects',
      subtopics: [
        {
          _id: 'java_s1',
          title: 'Defining a Class',
          status: 'not_done',
          theoryContent: 'A Class is like an object constructor, or a "blueprint" for creating objects.',
          starterCode: 'public class Main {\n  int x = 5;\n\n  public static void main(String[] args) {\n    Main myObj = new Main();\n    System.out.println(myObj.x);\n  }\n}'
        }
      ]
    },
    {
      _id: 'java_2',
      title: '2. Inheritance',
      subtopics: [
        {
          _id: 'java_s2',
          title: 'Extending Classes',
          status: 'not_done',
          theoryContent: 'In Java, it is possible to inherit attributes and methods from one class to another.',
          starterCode: 'class Vehicle {\n  protected String brand = "Ford";\n}\n\nclass Car extends Vehicle {\n  // Write code here\n}'
        }
      ]
    }
  ],
  "Web Programming": [
    {
      _id: 'web_1',
      title: '1. HTML & CSS',
      subtopics: [
        {
          _id: 'web_s1',
          title: 'Semantic HTML',
          status: 'not_done',
          theoryContent: 'Semantic HTML introduces meaning to the web page rather than just presentation.',
          starterCode: '<!DOCTYPE html>\n<html>\n<head>\n<title>Page Title</title>\n</head>\n<body>\n\n<h1>This is a Heading</h1>\n<p>This is a paragraph.</p>\n\n</body>\n</html>'
        }
      ]
    },
    {
      _id: 'web_2',
      title: '2. JavaScript Fundamentals',
      subtopics: [
        {
          _id: 'web_s2',
          title: 'DOM Manipulation',
          status: 'not_done',
          theoryContent: 'The HTML DOM is a standard for how to get, change, add, or delete HTML elements.',
          starterCode: 'document.getElementById("demo").innerHTML = "Hello World!";'
        }
      ]
    }
  ]
};
