package com.taskflow.service;

import com.taskflow.dto.MoveTaskRequest;
import com.taskflow.dto.TaskRequest;
import com.taskflow.model.BoardColumn;
import com.taskflow.model.Task;
import com.taskflow.repository.ColumnRepository;
import com.taskflow.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ColumnRepository columnRepository;

    public List<Task> getTasksForColumn(Long columnId) {
        return taskRepository.findByColumnIdOrderByPositionAsc(columnId);
    }

    @Transactional
    public Task createTask(TaskRequest request) {
        BoardColumn column = columnRepository.findById(request.getColumnId())
                .orElseThrow(() -> new NoSuchElementException("Column not found: " + request.getColumnId()));

        int position = request.getPosition() != null
                ? request.getPosition()
                : taskRepository.findByColumnIdOrderByPositionAsc(column.getId()).size();

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setColumn(column);
        task.setPosition(position);
        task.setDueDate(request.getDueDate());

        return taskRepository.save(task);
    }

    @Transactional
    public Task updateTask(Long taskId, TaskRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NoSuchElementException("Task not found: " + taskId));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());

        return taskRepository.save(task);
    }

    @Transactional
    public Task moveTask(Long taskId, MoveTaskRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NoSuchElementException("Task not found: " + taskId));

        BoardColumn targetColumn = columnRepository.findById(request.getTargetColumnId())
                .orElseThrow(() -> new NoSuchElementException("Column not found: " + request.getTargetColumnId()));

        task.setColumn(targetColumn);
        task.setPosition(request.getTargetPosition());

        return taskRepository.save(task);
    }

    @Transactional
    public void deleteTask(Long taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new NoSuchElementException("Task not found: " + taskId);
        }
        taskRepository.deleteById(taskId);
    }

    /** Deletes every task currently in the given column. Used for "Clear Done tasks". */
    @Transactional
    public void clearColumn(Long columnId) {
        if (!columnRepository.existsById(columnId)) {
            throw new NoSuchElementException("Column not found: " + columnId);
        }
        taskRepository.deleteByColumnId(columnId);
    }
}
