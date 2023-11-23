import styles from './App.module.css';
import { BiSolidSun } from 'react-icons/bi';
import { HiMoon } from 'react-icons/hi';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from './components/Todo';

function App() {
  const [todos, setTodos] = useState(() => readTodosFromLocalStroage());
  const [darkMode, setDarkMode] = useState(true);
  const [activeItem, setActiveItem] = useState('All');
  const [inputValue, setInputValue] = useState('');
  const filteredTodos = getFilteredTodos(todos, activeItem);

  // 카테고리
  const handleActiveItem = (e) => {
    setActiveItem(e.target.textContent);
  };

  // 인풋값 받기
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // todo 추가
  const addTodo = () => {
    if (inputValue.trim().length === 0) {
      return alert('빈칸입니다');
    }
    setTodos([...todos, { id: uuidv4(), text: inputValue, checked: false }]);
    setInputValue('');
  };

  // todo 삭제
  const delTodo = (index) => {
    // 내가 선택한 요소 이외의 인덱스만 남기고 선택 요소만 필터링
    setTodos(todos.filter((_, i) => i !== index));
  };

  // 클릭 이벤트받기
  const handleClick = (e) => {
    e.preventDefault();
    addTodo();
  };

  // 엔터 이벤트받기
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTodo();
    }
  };

  // 토글 체크
  const toggleCheck = (index) => {
    setTodos(
      todos.map((todo, i) =>
        i === index ? { ...todo, checked: !todo.checked } : todo
      )
    );
  };

  // 다크 모드
  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // 로컬에서 todos받아오기
  function readTodosFromLocalStroage() {
    const todos = localStorage.getItem('todos');
    console.log(todos);
    return todos ? JSON.parse(todos) : [];
  }

  // 카테고리 필터
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

  // todo 수정
  const editTodo = (index, newText) => {
    setTodos(
      todos.map((todo, i) => (i === index ? { ...todo, text: newText } : todo))
    );
  };

  // 마지막 아이템에 대한 ref 생성
  const lastTodoRef = useRef(null);
  const todosLengthRef = useRef(0); // todos 배열의 길이를 저장하는 ref

  // todos가 변경되면 로컬에저장
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // 새로운 투두가 추가될 때마다 실행되는 스크롤이동 useEffect
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
            <Todo
              key={todo.id}
              todo={todo}
              todos={todos}
              index={index}
              lastTodoRef={lastTodoRef}
              delTodo={delTodo}
              editTodo={editTodo}
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

export default App;
