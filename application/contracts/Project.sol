pragma solidity ^0.4.23;
/* solhint-disable */

contract Project {

  // Parameters for Porject
  string  private projectName;
  string  private projectShortDescription;
  string  private projectLongDescription;
  address private projectCreator;
  uint    private projectDeadline;
  uint    private projectDurationInSeconds;
  uint    private projectGoal;
  uint    private amountRaised;
  // States the contract can be in
  bool    private fundingGoalReached;
  bool    private deadlineReached;
  // Saving Supporters and their raised amount
  mapping (address => uint256) private supporter;
  // Events for notifying gui clients about updates
  event GoalReached   (address creator, uint raisedAmount);
  event FundTransfer  (address backer, uint amount, bool isContribution);

  // Create a new project instance
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
    // blockfund-contract address -> mus be given by hand
    projectCreator = creator;
    projectName = name;
    projectShortDescription = shortDesc;
    projectLongDescription = longDesc;
    // duration in hours
    projectDurationInSeconds = duration * 1 days;
    projectDeadline = now + projectDurationInSeconds;
    // goal given ether & saved in wei
    projectGoal = fundingGoal * 1 ether;
    amountRaised = 0;
    fundingGoalReached = false;
    deadlineReached = false;
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~ Modifiers ~~~~~~~~~~~~~~~~~~~~~~~~~

  modifier afterDeadline() {
    if (now >= projectDeadline) {
      _;
    }
  }

  modifier onlyCreator() {
    if (msg.sender == projectCreator) {
      _;
    }
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~ Getter ~~~~~~~~~~~~~~~~~~~~~~~~~

  function getDeadline() public view returns (uint) {
    return projectDeadline;
  }

  function getTimeToGoInSeconds() public view returns (uint) {
    // Also check overflow of difference between now and deadline
    if((projectDeadline - now) <= 0 || (projectDeadline - now) > projectDurationInSeconds) {
      return 0;
    } else {
      return (projectDeadline - now);
    }
  }

  function getGoalReached() public view returns (bool) {
    return (amountRaised >= projectGoal);
  }

  function getDeadlineReached() public view returns (bool) {
    return (now >= projectDeadline);
  }

  function getMyPersonalFundAmount(address funder) public view returns (uint) {
    return (supporter[funder] / (1 ether) );
  }

  // Returns all information of the project relevant for
  function getProjectInformation() public view returns(address, string, string, string, uint, uint, uint) {
    return (
      projectCreator,
      projectName,
      projectShortDescription,
      projectLongDescription,
      (amountRaised / (1 ether)),
      (projectGoal / (1 ether)),
      this.getTimeToGoInSeconds()
    );
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~ Contract-Interaction ~~~~~~~~~~~~~~~~~~~~~~~~~

  function checkGoalReached() public afterDeadline {
      if (amountRaised >= projectGoal) {
          fundingGoalReached = true;
          emit GoalReached(projectCreator, amountRaised);
      }
      deadlineReached = true;
  }

  function () public payable {
      require(!deadlineReached);
      uint amount = msg.value;
      supporter[msg.sender] += amount;
      amountRaised += amount;
      emit FundTransfer(msg.sender, amount, true);
      checkGoalReached();
  }

  function safeWithdrawal() public afterDeadline {
      // refund if goal is not reached
      checkGoalReached();
      if (!fundingGoalReached) {
          uint amount = supporter[msg.sender];
          supporter[msg.sender] = 0;
          if (amount > 0) {
              if (msg.sender.send(amount)) {
                  amountRaised -= amount;
                  emit FundTransfer(msg.sender, amount, false);
              } else {
                  supporter[msg.sender] = amount;
              }
          }
      }
      // creator can withdraw fund when goal is reached
      if (fundingGoalReached && projectCreator == msg.sender) {
          if (projectCreator.send(amountRaised)) {
              amountRaised = 0;
              emit FundTransfer(projectCreator, amountRaised, false);
          } else {
              //If we fail to send the funds to beneficiary, unlock supporter balance
              fundingGoalReached = false;
          }
      }
  }
}
