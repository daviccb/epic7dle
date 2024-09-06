import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './MainGame.css';

/*
TODO:
background pictures (more)
button to show solution's skin
post-game guess review in info center

hover icon to see name (region icon -> region name)
fix assets (region icons/date)
arrow for release year to give more of a hint

fix layout + add theme (green buttons from game?)
make pretty
animations

retake characterAssets:
  bmhaste
*/



function MainGame() {
  const [input, setInput] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [gameState, setGameState] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [solution, setSolution] = useState(null);  // State to hold the solution
  const [highestStreak, setHighestStreak] = useState(0);

  const MAX_GUESSES = 5;
  const imageMap = {
    //element
    ice: 'https://epic7db.com/images/elements/Ice-circle.png',
    wind: 'https://epic7db.com/images/elements/Earth-circle.png',
    fire: 'https://epic7db.com/images/elements/Fire-circle.png',
    light: 'https://epic7db.com/images/elements/Light-circle.png',
    dark: 'https://epic7db.com/images/elements/Dark-circle.png',

    //rarity
    3: '/rarityAssets/3-star.png',
    4: '/rarityAssets/4-star.png',
    5: '/rarityAssets/5-star.png',

    //class
    knight: '/classAssets/Knight.png',
    mage: '/classAssets/Mage.png',
    ranger: '/classAssets/Ranger.png',
    soulweaver: '/classAssets/Soul Weaver.png',
    assassin: '/classAssets/Thief.png',
    warrior: '/classAssets/Warrior.png',

    //zodiac
    aquarius: '/zodiacAssets/Aquarius.png',
    aries: '/zodiacAssets/Aries.png',
    cancer: '/zodiacAssets/Cancer.png',
    capricorn: '/zodiacAssets/Capricorn.png',
    gemini: '/zodiacAssets/Gemini.png',
    leo: '/zodiacAssets/Leo.png',
    libra: '/zodiacAssets/Libra.png',
    pisces: '/zodiacAssets/Pisces.png',
    sagittarius: '/zodiacAssets/Sagittarius.png',
    scorpion: '/zodiacAssets/Scorpio.png',
    taurus: '/zodiacAssets/Taurus.png',
    virgo: '/zodiacAssets/Virgo.png',

    //region
    stars: 'https://static.wikia.nocookie.net/epic-seven/images/6/68/Star_Genealogy.png',
    ritania: 'https://static.wikia.nocookie.net/epic-seven/images/4/40/Ritania_icon.png',
    death: 'https://static.wikia.nocookie.net/epic-seven/images/e/e1/Land_of_Death.png',
    cidonia: '',
    eureka: 'https://static.wikia.nocookie.net/epic-seven/images/f/f2/Eureka_icon.png',
    natalon: '',
    erasia: '',
    foreign: 'https://static.wikia.nocookie.net/epic-seven/images/7/75/Foreign_Land.png',
    moonlight: 'https://static.wikia.nocookie.net/epic-seven/images/1/10/Moonlight.png',
    specialty: 'https://static.wikia.nocookie.net/epic-seven/images/8/89/Specialty_Change_icon.png',
    collab: 'https://static.wikia.nocookie.net/epic-seven/images/0/09/Collaboration.png',

    //year
    2018: '',
    2019: '',
    2020: '',
    2021: '',
    2022: '',
    2023: '',
    2024: '',
  };

  // Win Streak Functions
  const getHighestStreak = () => {
    return parseInt(localStorage.getItem('highestStreak') || '0', 10);
  };
  const updateHighestStreak = (currentStreak) => {
    const highestStreak = getHighestStreak();
    if (currentStreak > highestStreak) {
      localStorage.setItem('highestStreak', currentStreak.toString());
      setHighestStreak(currentStreak);
    }
  };
  const getWinStreak = () => parseInt(Cookies.get('winStreak') || '0', 10);
  const incrementWinStreak = () => {
    const currentStreak = parseInt(Cookies.get('winStreak') || '0', 10) + 1;
    Cookies.set('winStreak', currentStreak, { expires: 7 });
    updateHighestStreak(currentStreak);
  };
  const resetWinStreak = () => {
    Cookies.set('winStreak', 0, { expires: 7 });
  };
  useEffect(() => {
    setHighestStreak(getHighestStreak());
  }, []);

  //get characters from json and create list with their data
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/characters')
      .then(response => response.json())
      .then(data => {
        const characterList = Object.keys(data).map(key => ({
          picture: data[key].assets.image,
          id: data[key]._id,
          name: key,
          element: data[key].attribute,
          class: data[key].role, // Assuming role is equivalent to class
          starsign: data[key].zodiac,
          rarity: data[key].rarity,
          region: data[key].region,
          date: data[key].date,
          photo: data[key].assets.icon
        }));
        setCharacters(characterList);
        // Set a random solution from the list
        if (characterList.length > 0) {
          const randomIndex = Math.floor(Math.random() * characterList.length);
          setSolution(characterList[randomIndex]); //[1]
        }
      });
  }, []);

  //sort input dropdown
  useEffect(() => {
    if (input.trim() === '') {
      setFilteredCharacters([]);
    } else {
      const filtered = characters.filter(char =>
        char.name.toLowerCase().includes(input.toLowerCase())
      );

      // Sort so that names starting with the input are at the top
      filtered.sort((a, b) => {
        const aStartsWith = a.name.toLowerCase().startsWith(input.toLowerCase());
        const bStartsWith = b.name.toLowerCase().startsWith(input.toLowerCase());
        if (aStartsWith && !bStartsWith) {
          return -1;  // a should come before b
        } else if (!aStartsWith && bStartsWith) {
          return 1;  // b should come before a
        } else {
          return 0;  // default order
        }
      });

      setFilteredCharacters(filtered);
    }
  }, [input, characters]);


  const handleInputChange = (event) => {
    setInput(event.target.value);
  };


  const handleGuessSubmit = async () => {
    if (input.trim() !== '') {
      // First, disable the button or show a loading indicator (not shown here)

      try {
        const response = await fetch(`http://127.0.0.1:5000/api/characters/${input.trim()}`);
        const details = await response.json();
        console.log(details);

        // Check if details are valid and contain 'attribute'
        if (details && details.attribute) {
          const isCorrect = details._id === solution.id;
          const newGuess = {
            picture: details.assets.thumbnail,
            photo: details.assets.icon,
            guess: input,
            element: details.attribute,
            class: details.role,
            starsign: details.zodiac,
            region: details.region,
            rarity: details.rarity,
            date: details.date,
            correct: isCorrect
          };

          // Set all states at once after the fetch is completed and data is processed
          setGuesses(prevGuesses => [newGuess, ...prevGuesses]); // Ensures immutability
          setInput(''); // Clear input

          setGameState(isCorrect ? true : false); // game win

          if (isCorrect === true) {
            incrementWinStreak();
            updateHighestStreak();
          }
          else {
            if (guesses.length + 1 >= MAX_GUESSES) {
              setGameState(true); // game loss
              resetWinStreak();
            }
          }
          setFeedback(isCorrect ? 'Correct! Well done.' : 'Incorrect, try again!');

        } else {
          // Handle case where no valid details are returned
          setFeedback('Failed to fetch details for the character. Try again.');
        }
      } catch (error) {
        console.error('Failed to fetch character details:', error);
        setFeedback('Error fetching character details.');
      } finally {
        // Re-enable the button or hide loading indicator here
      }
    }
  };

  const resetGame = async () => {
    // Reset game state
    setInput('');
    setGuesses([]);
    setGameState(false);
    setFeedback('');

    // Fetch a new solution from your character list or backend if needed
    try {
      const response = await fetch('http://127.0.0.1:5000/api/characters');
      const data = await response.json();
      const characterList = Object.keys(data).map(key => ({
        picture: data[key].assets.image,
        id: data[key]._id,
        name: key,
        element: data[key].attribute,
        class: data[key].role,
        starsign: data[key].zodiac,
        region: data[key].region,
        rarity: data[key].rarity,
        date: data[key].date,
        photo: data[key].assets.icon
      }));
      setCharacters(characterList);
      if (characterList.length > 0) {
        const randomIndex = Math.floor(Math.random() * characterList.length);
        setSolution(characterList[randomIndex]);
      }
    } catch (error) {
      console.error('Failed to fetch new characters:', error);
      setFeedback('Failed to load new game data.');
    }
  };

  return (
    <div className="main-game">


      <div className="game-container">
        <div className="character-display">
          {gameState && solution ? (
            <img src={solution.picture} alt="Character" className="character-imagesol" />
          ) : (
            <img src={'silhouette_question_mark.png'} alt="Character" className="character-imageqstnmk" />
          )}
        </div>

        <div className="game-info">
          <h1>Endless Mode</h1>
          <p>Tries {guesses.length}/{MAX_GUESSES}</p>
          <div className="streak-info">
            <p>Streak: {getWinStreak()}</p>
            <p>Highest score: {highestStreak}</p>
          </div>

          <div className="guess-input">
            {!gameState ? (
              <>
                <div className="input-button-wrapper">
                  <input
                    type="text"
                    placeholder="Enter character name..."
                    value={input}
                    onChange={handleInputChange}
                  />
                  <button className='guessbtn' onClick={handleGuessSubmit}>Guess</button>
                </div>
                {filteredCharacters.length > 0 && (
                  <ul className="autocomplete-dropdown">
                    {filteredCharacters.map(character => (
                      <li key={character.id} onClick={() => setInput(character.name)}>
                        <img src={character.photo} alt={character.name} />
                        {character.name}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <button onClick={resetGame} className="play-again-button">Play Again</button>
            )}
          </div>

          <p>{feedback}</p> {/* Display feedback message */}
        </div>
      </div>
      
      <div className="guess-table">
        <table>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Element</th>
              <th>Class</th>
              <th>Star Sign</th>
              <th>Region</th>
              <th>Rarity</th>
              <th>Release Year</th>
              {/* <th>Episode</th> */}
            </tr>
          </thead>
          <tbody>
            {guesses.map((item, index) => (
              <tr key={index}>
                <td className={item.photo === solution.photo ? 'correct-answer' : 'incorrect-answer'}>
                  <img src={item.photo} alt={item.photo} className="character-imageicon"/>
                </td>
                <td className={item.guess === solution.name ? 'correct-answer' : 'incorrect-answer'}>
                  {item.guess}
                </td>
                <td className={item.element === solution.element ? 'correct-answer' : 'incorrect-answer'}>
                  <img src={imageMap[item.element]} alt={item.element} />
                </td>
                <td className={item.class === solution.class ? 'correct-answer' : 'incorrect-answer'}>
                  <img src={imageMap[item.class]} alt={item.class} />
                </td>
                <td className={item.starsign === solution.starsign ? 'correct-answer' : 'incorrect-answer'}>
                  <img src={imageMap[item.starsign]} alt={item.starsign} />
                </td>
                <td className={item.region === solution.region ? 'correct-answer' : 'incorrect-answer'}>
                  <img src={imageMap[item.region]} alt={item.region} className="character-regionicon"/>
                </td>
                <td className={item.rarity === solution.rarity ? 'correct-answer' : 'incorrect-answer'}>
                  <img src={imageMap[item.rarity]} alt={item.rarity} />
                </td>
                <td className={item.date === solution.date ? 'correct-answer' : 'incorrect-answer'}>
                  <img src={imageMap[item.date]} alt={item.date} />
                </td>
                {/* <td className={item.correct ? 'correct' : 'incorrect'}>
                                {item.correct ? 'Correct' : 'Incorrect'}
                            </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {solution && <div>Debug: Solution is {solution.name}</div>}
    </div>
  );

}

export default MainGame;