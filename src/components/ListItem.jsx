import React from 'react';

export default function ListItem({ d, a, e }) {
  return (
    <div>
      {todos.map((todo, index) => {
        return (
          <li
            key={todo.id}
            ref={index === todos.length - 1 ? lastTodoRef : null}
            className={styles.list__item}
          >
            <div className={styles.list__item__check}>
              <input type='checkBox' defaultChecked={todos.checked} />
              <span>{todo.text}</span>
            </div>
            <div
              className={styles.list__item__remove}
              onClick={() => {
                delTodo(index);
              }}
            >
              <TiDelete />
            </div>
          </li>
        );
      })}
    </div>
  );
}
