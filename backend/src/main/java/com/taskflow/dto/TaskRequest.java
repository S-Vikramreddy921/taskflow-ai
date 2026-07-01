package com.taskflow.dto;

import com.taskflow.model.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskRequest {

    @NotBlank
    private String title;

    private String description;

    private Task.Priority priority = Task.Priority.MEDIUM;

    @NotNull
    private Long columnId;

    private Integer position;

    /** Optional. Format: "YYYY-MM-DD". Leave null for no due date. */
    private LocalDate dueDate;
}
