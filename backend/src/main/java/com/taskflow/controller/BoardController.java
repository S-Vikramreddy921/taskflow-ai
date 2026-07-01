package com.taskflow.controller;

import com.taskflow.model.Board;
import com.taskflow.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @GetMapping
    public List<Board> getAllBoards() {
        return boardService.getAllBoards();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Board> getBoard(@PathVariable Long id) {
        return ResponseEntity.ok(boardService.getBoard(id));
    }

    public record CreateBoardRequest(String name, List<String> columns) {}

    @PostMapping
    public ResponseEntity<Board> createBoard(@RequestBody CreateBoardRequest request) {
        Board board = boardService.createBoard(request.name(), request.columns());
        return ResponseEntity.ok(board);
    }
}
