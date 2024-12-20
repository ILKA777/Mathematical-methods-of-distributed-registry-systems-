// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MMDLSFinalGrade {
    // The professor's address
    address public professor;

    // Grades mapping: student address => grades[8]
    mapping(address => uint256[8]) public grades;

    // Final grades mapping: student address => final grade
    mapping(address => uint256) public finalGrades;

    // Events
    event GradesAssigned(address indexed student, uint256[8] grades);
    event FinalGradeComputed(address indexed student, uint256 finalGrade);

    // Modifier to restrict access to professor only
    modifier onlyProfessor() {
        require(msg.sender == professor, "Only the professor can perform this action.");
        _;
    }

    // Constructor: Set the professor's address
    constructor() {
        professor = msg.sender;
    }

    // Assign grades to a student
    function assignGrades(address student, uint256[8] memory _grades) public onlyProfessor {
        require(student != address(0), "Invalid student address.");
        grades[student] = _grades;
        emit GradesAssigned(student, _grades);
    }

    // Compute the final grade for a student
    function computeFinalGrade(address student) public onlyProfessor {
    require(student != address(0), "Invalid student address.");

    uint256[8] memory studentGrades = grades[student];

    uint256 HA1 = studentGrades[0];
    uint256 HA2 = studentGrades[1];
    uint256 HA3 = studentGrades[2];
    uint256 HA4 = studentGrades[3];
    uint256 HA5 = studentGrades[4];
    uint256 HA6 = studentGrades[5];
    uint256 ExamTerm1 = studentGrades[6];
    uint256 ExamFinal = studentGrades[7];

    // Calculate maxTerm using integer math
    uint256 maxTerm = (HA1 + HA2 > 2 * ExamTerm1) ? (HA1 + HA2) : (2 * ExamTerm1);

    // Calculate Intermediate grade using integer rounding
    uint256 intermediate = ((maxTerm + HA3 + HA4 + HA5 + HA6) * 10 / 6 + 5) / 10;
    if (intermediate > 10) {
        intermediate = 10; // Cap at 10
    }

    uint256 finalGrade;

    if (ExamFinal > 0) {
        // Calculate finalGrade using integer math
        finalGrade = ((4 * intermediate + 6 * ExamFinal) * 10 / 10 + 5) / 10;
        if (finalGrade > 10) {
            finalGrade = 10; // Cap at 10
        }
    } else {
        // Final grade depends on Intermediate
        finalGrade = (intermediate >= 6) ? intermediate : 0;
    }

    // Update the mapping
    finalGrades[student] = finalGrade;

    emit FinalGradeComputed(student, finalGrade);
    }


    // Utility function: Compute the max of two numbers
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    // Utility function: Compute the min of two numbers
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    // Utility function: Round a number to the nearest integer
    function round(uint256 x) internal pure returns (uint256) {
        return (x + 5) / 10; // Simulates rounding to the nearest integer
    }
}
