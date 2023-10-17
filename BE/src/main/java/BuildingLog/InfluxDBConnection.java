package BuildingLog;

import BuildingLog.model.InOutEvent;
import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import lombok.Data;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Data
public class InfluxDBConnection {
    private String token = "jPfaxnHaSVwvDOQ2dooykPr6nH-cLBGsvRz9y_oyLEhgtm5xNYDN5s6hnS6I-Qdnrm5U61ug7VZsEc7P-ljyuw==";
    private String bucket = "buildingEvents";
    private String org = "ftn";
    private String url = "http://localhost:8086";

    @Bean
    public InfluxDBClient buildConnection() {
        return InfluxDBClientFactory.create(getUrl(), getToken().toCharArray(), getOrg(), getBucket());
    }
}
