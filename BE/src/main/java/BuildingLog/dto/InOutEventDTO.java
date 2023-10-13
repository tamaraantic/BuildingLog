package BuildingLog.dto;

import lombok.Data;

@Data
public class InOutEventDTO {
    private Long employeeId;
    private String direction;
}
