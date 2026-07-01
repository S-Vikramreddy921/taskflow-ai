package com.taskflow.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskflow.dto.AiSuggestRequest;
import com.taskflow.dto.AiSuggestResponse;
import com.taskflow.model.Task;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * Calls the Anthropic Messages API to turn a bare task title into a fleshed-out
 * description and a suggested priority. Requires the ANTHROPIC_API_KEY environment
 * variable to be set; see backend/README section in the project root README.
 */
@Service
public class AiAssistantService {

    private static final String API_URL = "https://api.anthropic.com/v1/messages";
    private static final String MODEL = "claude-sonnet-4-6";

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${anthropic.api.key:}")
    private String apiKey;

    public AiSuggestResponse suggest(AiSuggestRequest request) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "ANTHROPIC_API_KEY is not set. Export it as an environment variable before starting the backend.");
        }

        String prompt = buildPrompt(request);

        String requestBody = """
                {
                  "model": "%s",
                  "max_tokens": 300,
                  "messages": [{"role": "user", "content": %s}]
                }
                """.formatted(MODEL, objectMapper.valueToTree(prompt).toString());

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(API_URL))
                .header("Content-Type", "application/json")
                .header("x-api-key", apiKey)
                .header("anthropic-version", "2023-06-01")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new IllegalStateException("Anthropic API call failed (" + response.statusCode() + "): " + response.body());
            }

            JsonNode root = objectMapper.readTree(response.body());
            String rawText = root.path("content").get(0).path("text").asText();

            return parseModelOutput(rawText);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to get AI suggestion: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(AiSuggestRequest request) {
        return """
                You are helping fill out a Kanban task card. Given a short task title, write a 1-2 sentence \
                actionable description and pick a priority.

                Task title: "%s"
                Additional context: "%s"

                Respond with ONLY valid JSON in this exact shape, no other text:
                {"description": "...", "priority": "LOW" | "MEDIUM" | "HIGH"}
                """.formatted(request.getTitle(), request.getContext() == null ? "" : request.getContext());
    }

    private AiSuggestResponse parseModelOutput(String rawText) throws Exception {
        // Model is instructed to return raw JSON, but strip code fences defensively.
        String cleaned = rawText.trim()
                .replaceAll("^```json", "")
                .replaceAll("^```", "")
                .replaceAll("```$", "")
                .trim();

        JsonNode node = objectMapper.readTree(cleaned);
        String description = node.path("description").asText("");
        String priorityStr = node.path("priority").asText("MEDIUM").toUpperCase();

        Task.Priority priority;
        try {
            priority = Task.Priority.valueOf(priorityStr);
        } catch (IllegalArgumentException e) {
            priority = Task.Priority.MEDIUM;
        }

        return new AiSuggestResponse(description, priority);
    }
}
