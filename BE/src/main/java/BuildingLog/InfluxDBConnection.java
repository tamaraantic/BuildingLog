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
    private String token = "2YOtQ12voGenwPe_caURyB4y_o6qWrnjYiuJgNOIgfaphTi_1nWr93LhJK07fEhH6AsKimOIGROJf_jPgKzFpw==";
    private String bucket = "buildingLog";
    private String org = "ftn";
    private String url = "http://localhost:8086";

    @Bean
    public InfluxDBClient buildConnection() {
        return InfluxDBClientFactory.create(getUrl(), getToken().toCharArray(), getOrg(), getBucket());
    }
}
