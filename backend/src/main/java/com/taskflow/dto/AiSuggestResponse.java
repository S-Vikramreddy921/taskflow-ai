package com.taskflow.dto;

import com.taskflow.model.Task;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiSuggestResponse {
    private String suggestedDescription;
    private Task.Priority suggestedPriority;
}
