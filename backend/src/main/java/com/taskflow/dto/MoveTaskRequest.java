package com.taskflow.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MoveTaskRequest {

    @NotNull
    private Long targetColumnId;

    @NotNull
    private Integer targetPosition;
}
