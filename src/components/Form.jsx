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
  // State to store any error messages
  const [error, setError] = useState(null);

  // Function to fetch trivia questions from the API with retry mechanism
  // This prevents the app from crashing if the API request fails
  const fetchTriviaQuestions = async (retryCount = 3, delay = 1000) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://opentdb.com/api.php?amount=${numQuestions}&category=${selectedCategory}&difficulty=${difficulty}&type=${questionType}`;
      console.log(`Fetching data from: ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        if (retryCount > 0) {
          console.log(`Retrying... Attempts left: ${retryCount - 1}`);
          // Retry after a delay if the request fails
          setTimeout(
            () => fetchTriviaQuestions(retryCount - 1, delay * 2),
            delay
          );
          return;
        } else {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
      }
      const data = await response.json();
      if (data.results.length === 0) {
        setError("No questions available for the selected options.");
        setTriviaQuestions([]);
      } else {
        setTriviaQuestions(data.results);
      }
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch data whenever selectedCategory, difficulty, numQuestions, or questionType changes
  useEffect(() => {
    if (selectedCategory && difficulty && numQuestions && questionType) {
      fetchTriviaQuestions();
    }
  }, [selectedCategory, difficulty, numQuestions, questionType]);

  // Handler for category change
  const handleCategoryChange = (evt) => {
    setSelectedCategory(evt.target.value);
  };

  // Handler for difficulty change
  const handleDifficultyChange = (evt) => {
    setDifficulty(evt.target.value);
  };

  // Handler for number of questions change
  const handleNumQuestionsChange = (evt) => {
    const value = Math.min(5, Math.max(1, evt.target.value));
    setNumQuestions(value);
  };

  // Handler for question type change
  const handleQuestionTypeChange = (evt) => {
    setQuestionType(evt.target.value);
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
        <p className="load">Loading...</p> // Display loading message while fetching data
      ) : error ? (
        <p className="error">Error: {error}</p> // Display error message if data fetch fails
      ) : (
        <ol className="trivia-questions">
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
        </ol>
      )}
    </div>
  );
}

export default Form;
