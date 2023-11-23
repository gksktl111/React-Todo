// Todo.js

import { useState } from 'react';
import { TiDelete } from 'react-icons/ti';
import { FaEdit } from 'react-icons/fa';
import styles from '../App.module.css';

export function Todo({
  todo,
  todos,
  index,
  lastTodoRef,
  delTodo,
  toggleCheck,
  editTodo,
  darkMode,
}) {
  const [itemChecked, setItemChecked] = useState(todo.checked);

  // 수정 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleCheckBox = () => {
    toggleCheck(index);
    setItemChecked(!todo.checked);
  };

  // 수정 상태 변경
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditInputChange = (e) => {
    setEditText(e.target.value);
  };

  const handleEditSubmit = () => {
    if (editText.trim().length === 0) {
      // 빈 문자열인 경우 수정되지 않음
      setIsEditing(false);
      return;
    }

    editTodo(index, editText);
    setIsEditing(false);

    // 수정된 내용을 로컬 스토리지에 저장
    localStorage.setItem('todos', JSON.stringify(todos));
  };

  return (
    <li
      key={todo.id}
      ref={index === todos.length - 1 ? lastTodoRef : null}
      className={styles.list__items}
    >
      <div className={styles.list__item}>
        <input
          type='checkBox'
          defaultChecked={todo.checked}
          onChange={handleCheckBox}
        />
        {isEditing ? (
          <input
            type='text'
            value={editText}
            onChange={handleEditInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleEditSubmit();
              }
            }}
            autoFocus
          />
        ) : darkMode ? (
          <span
            className={
              itemChecked ? styles.list__span__check : styles.list__span
            }
            onDoubleClick={handleEdit}
          >
            {todo.text}
          </span>
        ) : (
          <span
            className={
              itemChecked
                ? styles.list__span__check__darkMode
                : styles.list__span__darkMode
            }
            onDoubleClick={handleEdit}
          >
            {todo.text}
          </span>
        )}
      </div>

      <div className={styles.item__button__comtainer}>
        <div className={styles.list__item__edit}>
          <FaEdit onClick={handleEdit} />
        </div>
        <div
          className={styles.list__item__remove}
          onClick={() => delTodo(index)}
        >
          <TiDelete />
        </div>
      </div>
    </li>
  );
}
