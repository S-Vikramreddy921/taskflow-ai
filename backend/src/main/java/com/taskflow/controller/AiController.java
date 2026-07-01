package com.taskflow.controller;

import com.taskflow.dto.AiSuggestRequest;
import com.taskflow.dto.AiSuggestResponse;
import com.taskflow.service.AiAssistantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiAssistantService aiAssistantService;

    @PostMapping("/suggest")
    public ResponseEntity<AiSuggestResponse> suggest(@Valid @RequestBody AiSuggestRequest request) {
        return ResponseEntity.ok(aiAssistantService.suggest(request));
    }
}
