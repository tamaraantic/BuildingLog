package BuildingLog.repository;

import BuildingLog.InfluxDBConnection;
import BuildingLog.dto.InOutEventDTO;
import BuildingLog.model.InOutEvent;
import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.WriteApiBlocking;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import com.influxdb.exceptions.InfluxException;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;

@Repository
@AllArgsConstructor
public class InOutEventRepository {
    private final InfluxDBConnection influxDBConnection;

    public boolean saveInOutEvent(InOutEvent event) {
        boolean flag = false;
        InfluxDBClient influxDBClient = influxDBConnection.buildConnection();
        try {
            WriteApiBlocking writeApi = influxDBClient.getWriteApiBlocking();
            writeApi.writeMeasurement(WritePrecision.MS, event);
            flag = true;
        } catch (InfluxException e) {
            System.out.println("Exception!!" + e.getMessage());
        }
        return flag;
    }
}
