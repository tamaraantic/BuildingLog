package BuildingLog.controller;

import BuildingLog.dto.InOutEventDTO;
import BuildingLog.model.InOutEvent;
import BuildingLog.service.InOutEventService;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/in-out-event")
@AllArgsConstructor
public class InOutEventContoller {
    @Autowired
    private final InOutEventService inOutEventService;

    @PostMapping("/create")
    public ResponseEntity<InOutEvent> createBuilding(@RequestBody InOutEventDTO eventDTO) {
        InOutEvent event = new InOutEvent();
        event.setEmployeeId(eventDTO.getEmployeeId());
        event.setDirection(eventDTO.getDirection());
        event.setLastInspected(Instant.now());
        return inOutEventService.saveEvent(event) ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }
}
