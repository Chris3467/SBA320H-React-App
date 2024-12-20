import { useEffect, useState } from "react";

// Utility function to decode HTML entities
const decodeHtml = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

function Form({ category }) {
  // State to store the fetched trivia questions
  const [triviaQuestions, setTriviaQuestions] = useState([]);
  // State to store the selected category (if not provided as a prop)
  const [selectedCategory, setSelectedCategory] = useState(category || "");
  // State to store the selected difficulty
  const [difficulty, setDifficulty] = useState("");
  // State to store the number of questions
  const [numQuestions, setNumQuestions] = useState(5);
  // State to store the type of questions
  const [questionType, setQuestionType] = useState("multiple");
  // State to indicate whether data is being fetched
  const [loading, setLoading] = useState(false);
  // State to store the number of attempts for each question
  const [attempts, setAttempts] = useState({});

  // Function to fetch trivia questions from the API
  const fetchTriviaQuestions = async () => {
    setLoading(true); // Set loading to true while fetching data
    const url = `https://opentdb.com/api.php?amount=${numQuestions}&category=${selectedCategory}&difficulty=${difficulty}&type=${questionType}`;
    const response = await fetch(url); // Fetch data from the API
    const data = await response.json(); // Parse the JSON response
    setTriviaQuestions(data.results); // Update the state with fetched questions
    setLoading(false); // Set loading to false after data is fetched
  };

  // useEffect to fetch data whenever selectedCategory, difficulty, numQuestions, or questionType changes
  useEffect(() => {
    if (selectedCategory && difficulty && numQuestions && questionType) {
      fetchTriviaQuestions(); // Fetch trivia questions if all options are selected
    }
  }, [selectedCategory, difficulty, numQuestions, questionType]); // Dependency array to trigger useEffect on option changes

  // Handler for category change
  const handleCategoryChange = (evt) => {
    setSelectedCategory(evt.target.value); // Update the selectedCategory state
  };

  // Handler for difficulty change
  const handleDifficultyChange = (evt) => {
    setDifficulty(evt.target.value); // Update the difficulty state
  };

  // Handler for number of questions change
  const handleNumQuestionsChange = (evt) => {
    const value = Math.min(5, Math.max(1, evt.target.value)); // Ensure the value is between 1 and 5
    setNumQuestions(value); // Update the number of questions state
  };

  // Handler for question type change
  const handleQuestionTypeChange = (evt) => {
    setQuestionType(evt.target.value); // Update the question type state
  };

  // Handler for answer selection
  const handleAnswerSelection = (questionIndex, selectedAnswer) => {
    setAttempts((prevAttempts) => {
      const newAttempts = { ...prevAttempts };
      if (!newAttempts[questionIndex]) {
        newAttempts[questionIndex] = 0;
      }
      newAttempts[questionIndex] += 1;
      return newAttempts;
    });

    if (selectedAnswer === triviaQuestions[questionIndex].correct_answer) {
      alert("Correct!");
    } else if (attempts[questionIndex] >= 2) {
      alert(
        `Incorrect! The correct answer is: ${triviaQuestions[questionIndex].correct_answer}`
      );
    } else {
      alert("Incorrect! Try again.");
    }
  };

  return (
    <div>
      <form className="trivia-form">
        {!category && (
          <label>
            Category:
            <select value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">Select Category</option>
              <option value="15">Gaming</option>
              <option value="31">Anime</option>
              <option value="11">Movies</option>
            </select>
          </label>
        )}
        <label>
          Difficulty:
          <select value={difficulty} onChange={handleDifficultyChange}>
            <option value="">Select Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <label>
          Number of Questions:
          <input
            type="number"
            value={numQuestions}
            onChange={handleNumQuestionsChange}
            min="1"
            max="5"
          />
        </label>
        <label>
          Question Type:
          <select value={questionType} onChange={handleQuestionTypeChange}>
            <option value="multiple">Multiple Choice</option>
            <option value="boolean">True/False</option>
          </select>
        </label>
      </form>
      {loading ? (
        <p>Loading...</p> // Display loading message while fetching data
      ) : (
        <ul className="trivia-questions">
          {triviaQuestions.map((question, index) => (
            <li key={index}>
              <p>{decodeHtml(question.question)}</p>
              {question.incorrect_answers
                .concat(question.correct_answer)
                .sort()
                .map((answer, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswerSelection(index, answer)}
                  >
                    {decodeHtml(answer)}
                  </button>
                ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Form;
