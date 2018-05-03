pragma solidity ^0.4.23;
/* solhint-disable */

import './Project.sol';

contract Blockfund {

    address[] private projects;
    address private admin;
    // Events for notifying gui clients about updates
    event NewProjectAdded (address contractAddress);

  constructor() public {
    admin = msg.sender;
  }


  modifier adminOnly() {
    if (msg.sender == admin) {
      _;
    }
  }


  function getAllExistingProjects() public view returns (address[]) {
    return projects;
  }

  function getBlockfundAdmin() public view returns (address) {
    return admin;
  }

  // Create a new Blockfund-Project and add it to the project-array
  function createNewProject(
    string name,
    string shortDescription,
    string longDescription,
    uint duration,
    uint goal
  ) public returns (Project) {
      Project newProject = new Project(name, shortDescription, longDescription, duration, goal, msg.sender);
      projects.push(newProject);
      emit NewProjectAdded(newProject);
      return newProject;
  }

}
