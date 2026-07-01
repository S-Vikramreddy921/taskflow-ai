package com.taskflow.service;

import com.taskflow.model.Board;
import com.taskflow.model.BoardColumn;
import com.taskflow.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;

    public List<Board> getAllBoards() {
        return boardRepository.findAll();
    }

    public Board getBoard(Long id) {
        return boardRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Board not found: " + id));
    }

    public Board createBoard(String name, List<String> columnNames) {
        Board board = new Board();
        board.setName(name);

        int position = 0;
        for (String columnName : columnNames) {
            BoardColumn column = new BoardColumn();
            column.setName(columnName);
            column.setPosition(position++);
            column.setBoard(board);
            board.getColumns().add(column);
        }

        return boardRepository.save(board);
    }
}
