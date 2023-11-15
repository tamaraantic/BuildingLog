class InOutEvent {
    constructor(lastInspected, employeeId, direction) {
      this.lastInspected = lastInspected;
      this.employeeId = employeeId;
      this.direction = direction;
    }
  }
  
  module.exports = InOutEvent;