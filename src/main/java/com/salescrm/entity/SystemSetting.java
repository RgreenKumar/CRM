package com.salescrm.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "system_settings")
@Data
public class SystemSetting {

    @Id
    private String settingKey;

    @jakarta.persistence.Column(columnDefinition = "TEXT")
    private String settingValue;

    public SystemSetting() {
    }

    public SystemSetting(String settingKey, String settingValue) {
        this.settingKey = settingKey;
        this.settingValue = settingValue;
    }
}
