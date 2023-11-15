class CreateInOutEvent {
    constructor(employeeId, direction) {
      this.employeeId = employeeId;
      this.direction = direction;
    }
  }
  
  module.exports = CreateInOutEvent;