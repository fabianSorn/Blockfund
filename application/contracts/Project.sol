pragma solidity ^0.4.23;
/* solhint-disable */

contract Project {

  struct ProjectInformation {
    string  name;
    string  shortDescription;
    string  longDescription;
    address creator;
    uint    deadline;
    uint    durationInSeconds;
    uint    goal;
    uint    amountRaised;
    bool    fundingGoalReached;
    bool    deadlineReached;
  }
  ProjectInformation project;
  mapping (address => uint256) private supporter;
  event GoalReached   (address creator, uint raisedAmount);
  event FundTransfer  (address backer, uint amount, bool isContribution);

  constructor (
    string name,
    string shortDesc,
    string longDesc,
    uint duration,
    uint fundingGoal,
    address creator
  ) public
  {
    // creator cannot be retrieved from msg.sender, because msg.sender is the
    // blockfund-contract address -> must be given by hand
    project =  ProjectInformation({
      creator: creator,
      name: name,
      shortDescription: shortDesc,
      longDescription: longDesc,
      durationInSeconds: (duration * 1 days),
      deadline: (now + project.durationInSeconds),
      goal: (fundingGoal * 1 ether),
      amountRaised: 0,
      fundingGoalReached: (project.amountRaised >= project.goal),
      deadlineReached: false
    });
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~ Modifiers ~~~~~~~~~~~~~~~~~~~~~~~~~

  modifier afterDeadline() {
    if (now >= project.deadline) {
      _;
    }
  }

  modifier onlyCreator() {
    if (msg.sender == project.creator) {
      _;
    }
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~ Getter ~~~~~~~~~~~~~~~~~~~~~~~~~

  function getDeadline() public view returns (uint) {
    return project.deadline;
  }

  function getTimeToGoInSeconds() public view returns (uint) {
    // Also check overflow of difference between now and deadline
    if((project.deadline - now) <= 0 || (project.deadline - now) > project.durationInSeconds) {
      return 0;
    } else {
      return (project.deadline - now);
    }
  }

  function getGoalReached() public view returns (bool) {
    return (project.amountRaised >= project.goal);
  }

  function getDeadlineReached() public view returns (bool) {
    return (now >= project.deadline);
  }

  function getMyPersonalFundAmount(address funder) public view returns (uint) {
    return (supporter[funder] / (1 ether) );
  }

  // Returns all information of the project relevant for
  function getProjectInformation() public view returns(address, string, string, string, uint, uint, uint) {
    return (
      project.creator,
      project.name,
      project.shortDescription,
      project.longDescription,
      (project.amountRaised / (1 ether)),
      (project.goal / (1 ether)),
      this.getTimeToGoInSeconds()
    );
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~ Contract-Interaction ~~~~~~~~~~~~~~~~~~~~~~~~~

  function checkGoalReached() public afterDeadline {
      if (project.amountRaised >= project.goal) {
          project.fundingGoalReached = true;
          emit GoalReached(project.creator, project.amountRaised);
      }
      project.deadlineReached = true;
  }

  function () public payable {
      require(!project.deadlineReached);
      uint amount = msg.value;
      supporter[msg.sender] += amount;
      project.amountRaised += amount;
      emit FundTransfer(msg.sender, amount, true);
      checkGoalReached();
  }

  function safeWithdrawal() public afterDeadline {
      // refund contributors if goal is not reached
      checkGoalReached();
      if (!project.fundingGoalReached) {
          uint amount = supporter[msg.sender];
          supporter[msg.sender] = 0;
          if (amount > 0) {
              if (msg.sender.send(amount)) {
                  project.amountRaised -= amount;
                  emit FundTransfer(msg.sender, amount, false);
              } else {
                  supporter[msg.sender] = amount;
              }
          }
      }
      // creator can withdraw fund when goal is reached
      if (project.fundingGoalReached && project.creator == msg.sender) {
          if (project.creator.send(project.amountRaised)) {
              project.amountRaised = 0;
              emit FundTransfer(project.creator, project.amountRaised, false);
          } else {
              //If we fail to send the funds to beneficiary, unlock supporter balance
              project.fundingGoalReached = false;
          }
      }
  }
}
