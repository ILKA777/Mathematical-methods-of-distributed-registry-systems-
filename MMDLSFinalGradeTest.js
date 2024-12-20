const { expect } = require("chai");
const { ethers } = require("hardhat");

// Custom helper functions
function max(a, b) {
  return a > b ? a : b;
}

function min(a, b) {
  return a < b ? a : b;
}

function solidityRound(value) {
  const scaledValue = value * 10 + 5; // Scale by 10 and add 5 for rounding
  return parseInt(scaledValue / 10); // Integer division simulating Solidity's rounding
}

describe("MMDLSFinalGrade", function () {
  let MMDLSFinalGrade, contract, professor, student1, student2;

  beforeEach(async function () {
    // Deploy the contract and get accounts
    [professor, student1, student2, other] = await ethers.getSigners();
    MMDLSFinalGrade = await ethers.getContractFactory("MMDLSFinalGrade");
    contract = await MMDLSFinalGrade.connect(professor).deploy();
    await contract.deployed();
  });

  it("should deploy the contract and set the professor correctly", async function () {
    expect(await contract.professor()).to.equal(professor.address);
  });

  it("should allow the professor to assign grades", async function () {
    const grades = [8, 7, 9, 6, 5, 8, 7, 9]; // HA1 to ExamFinal
    await expect(contract.connect(professor).assignGrades(student1.address, grades))
      .to.emit(contract, "GradesAssigned")
      .withArgs(student1.address, grades);
  });

  it("should correctly compute the final grade when ExamFinal > 0", async function () {
    const grades = [8, 7, 9, 6, 5, 8, 7, 9]; // ExamFinal = 9
    await contract.connect(professor).assignGrades(student1.address, grades);
    await contract.connect(professor).computeFinalGrade(student1.address);

    const finalGrade = await contract.finalGrades(student1.address);

    // Custom calculations without Math
    const maxTerm = max(grades[0] + grades[1], 2 * grades[6]);
    const intermediate = min(solidityRound((maxTerm + grades[2] + grades[3] + grades[4] + grades[5]) / 6), 10);
    const expectedFinalGrade = min(solidityRound((4 * intermediate + 6 * grades[7]) / 10), 10);

    expect(finalGrade).to.equal(expectedFinalGrade);
  });

  it("should correctly compute the final grade when ExamFinal = 0 and Intermediate >= 6", async function () {
    const grades = [8, 7, 9, 6, 5, 8, 7, 0]; // ExamFinal = 0
    await contract.connect(professor).assignGrades(student1.address, grades);
    await contract.connect(professor).computeFinalGrade(student1.address);

    const finalGrade = await contract.finalGrades(student1.address);

    // Custom calculations without Math
    const maxTerm = max(grades[0] + grades[1], 2 * grades[6]);
    const intermediate = min(solidityRound((maxTerm + grades[2] + grades[3] + grades[4] + grades[5]) / 6), 10);

    expect(finalGrade).to.equal(intermediate);
  });

  it("should correctly compute the final grade when ExamFinal = 0 and Intermediate < 6", async function () {
    const grades = [2, 3, 4, 5, 6, 3, 4, 0]; // ExamFinal = 0
    await contract.connect(professor).assignGrades(student1.address, grades);
    await contract.connect(professor).computeFinalGrade(student1.address);

    const finalGrade = await contract.finalGrades(student1.address);

    // Custom calculations without Math
    const maxTerm = max(grades[0] + grades[1], 2 * grades[6]);
    const intermediate = min(solidityRound((maxTerm + grades[2] + grades[3] + grades[4] + grades[5]) / 6), 10);

    expect(finalGrade).to.equal(0); // Intermediate < 6, so finalGrade = 0
  });

  it("should only allow the professor to assign grades", async function () {
    const grades = [8, 7, 9, 6, 5, 8, 7, 9];
    await expect(
      contract.connect(student1).assignGrades(student1.address, grades)
    ).to.be.revertedWith("Only the professor can perform this action.");
  });

  it("should only allow the professor to compute final grades", async function () {
    const grades = [8, 7, 9, 6, 5, 8, 7, 9];
    await contract.connect(professor).assignGrades(student1.address, grades);

    await expect(
      contract.connect(student1).computeFinalGrade(student1.address)
    ).to.be.revertedWith("Only the professor can perform this action.");
  });

  it("should revert if an invalid student address is used", async function () {
    const grades = [8, 7, 9, 6, 5, 8, 7, 9];
    await expect(
      contract.connect(professor).assignGrades(ethers.constants.AddressZero, grades)
    ).to.be.revertedWith("Invalid student address.");
  });
});
