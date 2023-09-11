import styles from './App.module.css';
import { BiSolidSun } from 'react-icons/bi';
import { HiMoon } from 'react-icons/hi';
import { useEffect, useRef, useState } from 'react';
import { TiDelete } from 'react-icons/ti';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [todos, setTodos] = useState(() => readTodosFromLocalStroage());
  const [darkMode, setDarkMode] = useState(true);
  const [activeItem, setActiveItem] = useState('All');
  const [inputValue, setInputValue] = useState('');
  const filteredTodos = getFilteredTodos(todos, activeItem);

  const handleActiveItem = (e) => {
    setActiveItem(e.target.textContent);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const addTodo = () => {
    if (inputValue.trim().length === 0) {
      return;
    }
    setTodos([...todos, { id: uuidv4(), text: inputValue, checked: false }]);
    setInputValue('');
  };

  const delTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleClick = (e) => {
    e.preventDefault();
    addTodo();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTodo();
    }
  };

  const toggleCheck = (index) => {
    setTodos(
      todos.map((todo, i) =>
        i === index ? { ...todo, checked: !todo.checked } : todo
      )
    );
  };

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // 마지막 아이템에 대한 ref 생성
  const lastTodoRef = useRef(null);
  const todosLengthRef = useRef(0); // todos 배열의 길이를 저장하는 ref

  // 새로운 투두가 추가될 때마다 실행되는 useEffect
  useEffect(() => {
    if (lastTodoRef.current && todos.length > todosLengthRef.current) {
      // 만약 todos.length 가 증가했다면...
      // 마지막 아이템으로 스크롤 이동
      lastTodoRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    if (lastTodoRef.current && todos.length < todosLengthRef.current) {
    }

    todosLengthRef.current = todos.length; // ref 업데이트
  }, [todos]);

  return (
    <div className={styles.container}>
      <header className={darkMode ? styles.header__darkmode : styles.header}>
        <button
          className={styles.header__darkmode__btn}
          onClick={handleDarkMode}
        >
          {darkMode ? <BiSolidSun /> : <HiMoon className={styles.moon} />}
        </button>

        <div className={styles.navMenus}>
          <span
            className={
              activeItem === 'All'
                ? styles.navMenu__item__active
                : styles.navMenu__item
            }
            onClick={handleActiveItem}
          >
            All
          </span>
          <span
            className={
              activeItem === 'Active'
                ? styles.navMenu__item__active
                : styles.navMenu__item
            }
            onClick={handleActiveItem}
          >
            Active
          </span>
          <span
            className={
              activeItem === 'Completed'
                ? styles.navMenu__item__active
                : styles.navMenu__item
            }
            onClick={handleActiveItem}
          >
            Completed
          </span>
        </div>
      </header>

      <section
        className={
          darkMode ? styles.list__container__darkmode : styles.list__container
        }
      >
        <ol className={styles.list}>
          {filteredTodos.map((todo, index) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              todos={todos}
              index={index}
              lastTodoRef={lastTodoRef}
              delTodo={delTodo}
              toggleCheck={toggleCheck}
              darkMode={darkMode}
            />
          ))}
        </ol>
      </section>

      <footer className={darkMode ? styles.footer__darkmode : styles.footer}>
        <form className={styles.footer__form} action='미정'>
          <input
            className={styles.footer__input}
            type='text'
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            value={inputValue}
          />
          <button className={styles.footer__btn} onClick={handleClick}>
            Add
          </button>
        </form>
      </footer>
    </div>
  );
}

function readTodosFromLocalStroage() {
  const todos = localStorage.getItem('todos');
  return todos ? JSON.parse(todos) : [];
}

function TodoItem({
  todo,
  todos,
  index,
  lastTodoRef,
  delTodo,
  toggleCheck,
  darkMode,
}) {
  const [itemChecked, setItemChecked] = useState(todo.checked);

  const handleCheckBox = () => {
    toggleCheck(index);
    setItemChecked(!todo.checked);
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
        {darkMode ? (
          <span
            className={
              itemChecked ? styles.list__span__check : styles.list__span
            }
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
          >
            {todo.text}
          </span>
        )}
      </div>
      <div className={styles.list__item__remove} onClick={() => delTodo(index)}>
        <TiDelete />
      </div>
    </li>
  );
}

function getFilteredTodos(todos, activeItem) {
  switch (activeItem) {
    case 'All':
      return todos;
    case 'Active':
      // Return only active todos
      return todos.filter((todo) => !todo.checked);
    case 'Completed':
      // Return only completed todos
      return todos.filter((todo) => todo.checked);
    default:
      throw new Error(`Unknown filter: ${activeItem}`);
  }
}

export default App;
