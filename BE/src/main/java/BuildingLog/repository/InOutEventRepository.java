package BuildingLog.repository;

import BuildingLog.InfluxDBConnection;
import BuildingLog.model.InOutEvent;
import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.WriteApiBlocking;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.exceptions.InfluxException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import com.influxdb.client.QueryApi;
import com.influxdb.client.domain.Query;
import com.influxdb.query.*;


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

    public List<InOutEvent> getAllEmployeesInside(){
        InfluxDBClient influxDBClient = influxDBConnection.buildConnection();
        QueryApi queryApi = influxDBClient.getQueryApi();

        String query = "from(bucket: \"" + influxDBConnection.getBucket() + "\") " +
                "|> range(start: -24h) " +
                "|> sort(columns: [\"_time\"], desc: false) " +
                "|> group(columns: [\"employeeId\"]) "+
                "|> last() "+
                "|> filter(fn: (r) => r._value == \"in\")";

        //List<InOutEvent> result = queryApi.query(query, InOutEvent.class);

        List<FluxTable> fluxTables = queryApi.query(query);

        List<InOutEvent> inOutEvents = new ArrayList<>();

        for (FluxTable fluxTable : fluxTables) {
            for (FluxRecord fluxRecord : fluxTable.getRecords()) {
                InOutEvent inOutEvent = new InOutEvent();
                inOutEvent.setLastInspected(fluxRecord.getTime());
                Object employeeIdObject = fluxRecord.getValueByKey("employeeId");
                if (employeeIdObject != null) {
                    Long employeeId = (Long.valueOf(employeeIdObject.toString()));
                    inOutEvent.setEmployeeId(employeeId);
                }
                inOutEvent.setDirection((String) fluxRecord.getValue());
                inOutEvents.add(inOutEvent);
            }
        }
        return inOutEvents;
    }


}
