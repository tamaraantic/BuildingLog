package BuildingLog.service;

import BuildingLog.model.InOutEvent;
import BuildingLog.repository.InOutEventRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
@Service
@AllArgsConstructor
public class InOutEventService {
    private final InOutEventRepository inOutEventRepository;

    public boolean saveEvent(InOutEvent event) {
        try {
            inOutEventRepository.saveInOutEvent(event);
            return true;
        } catch (Exception e) {
            System.out.println("Error while saving Building object: " + e.getMessage());
            return false;
        }
    }
}



