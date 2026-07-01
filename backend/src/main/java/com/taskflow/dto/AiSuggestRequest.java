package com.taskflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AiSuggestRequest {

    @NotBlank
    private String title;

    /** Optional extra context, e.g. the board/column name, to steer the suggestion. */
    private String context;
}
