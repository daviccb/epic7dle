import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './MainGame.css';

/*
TODO:
add more background pictures
  2020.06.25 - loading dots
  2020.11.12 - /img/base_dagger1.png
  2020.12.24 - /img/guide_bg5.png
  2021.01.21 - automaton bgs x4
  2021.03.18 - (white equipment set icons, no bg)
  2021.04.15 - /img/base_pvplive_season_04.png
  2021.05.27 - /img/bg_moonlight_destiny.png
  2021.07.08 - square bgs with borders
  2021.08.05 - /img/base_pvplive_season_05.png
  2021.10.28 - rta backgrounds x5
  2021.11.25 - /img/pvp_rta_ss6_r.png
  2022.02.17 - AI icons + heart health icons + magn glass icon
  2022.03.03 - notif bell + discord + other icons
  2022.03.17 - favorite star icons
  2022.03.31 - /img/pvp_rta_ss7_r.png + sparkles
  2022.04.28 - double up/down icons
  2022.06.23 - /img/icon_menu_theater.png (icon to replace current moonlight region icon?) + (x) icon and more
  2022.07.21 - /img/pvp_rta_ss8_r.png
  2022.08.04 - (-) and (+) icons
  2022.08.18 - /img/z_custom_fullmetal_bg.png
  2022.09.01 - bg x2
  2022.11.10 - /img/pvp_rta_ss9_r.png
  2022.11.24 - /img/lobby_pub_mockup.png
  2023.02.16 - /img/z_memory_bg.png + copy icon:  /img/icon_menu_copy.png
  2023.03.02 - /img/pvp_rta_ss10_r.png
  2023.05.11 - new variant
  2023.06.22 - /img/pvp_rta_ss11_r.png
  2023.08.03 - /title/bg/ggst_title2022.png
  2023.10.12 - /img/pvp_rta_ss12_r.png
  2023.11.09 - /img/base_unit_blue.png *YESSSSSSSSSSSSSSSSSSS*
               /img/_btn_blue_r.png
               + BUTTONS
  2024.02.01 - /img/pvp_rta_ss13_r.png + https://www.e7vau.lt/static/datamine/2024/20240215/title/bg/24_valentine_bg.png
  2024.03.14 - /img/pvp_draft_1_r.png
  2024.03.28 - /story/ folder
  2024.05.23 - /img/pvp_rta_ss14_r.png + LULUCA bg -> https://www.e7vau.lt/static/datamine/2024/20240523/story/bg/img_vsu3aa_1.webp
  2024.06.05 - https://www.e7vau.lt/static/datamine/2024/20240605/img/e7wc_event_bg.png
  2024.06.20 - /img/pvp_bg_blur.png (backdrop)
  2024.07.04 - /img/_box_shop_special.png + /story/
  2024.07.18 - /story/bg/img_e7wc_2024_collab.webp
  2024.08.01 - rythm game images + /story/
  2024.09.02 - bgs + /story/ + dividing lines
}

post-game guess review in info center (add share button?) (clipboard icon)
hover icon to see name (region icon -> region name)
style settings page (iconname toggle buttons + background changing)
redo rarity stars with awakened ones
add emojis to result message
hover icon for name

fix layout + add theme (green buttons from game?) (nice borders) (style the dropdown)
make pretty
animations

retake characterAssets:
  bmhaste (top of scythe is cut off)
  chaos sect axe ?
  taranor guard ?
  taranor royal guard ?
  kikirat v2 ?
  angelic momo (take without effect)
  aux lots (is blinking)
  maid chloe
*/



function MainGame({ visibility }) {
  const [input, setInput] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [gameState, setGameState] = useState(false); // eslint-disable-next-line
  const [feedback, setFeedback] = useState('');
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [solution, setSolution] = useState(null);  // State to hold the solution
  const [highestStreak, setHighestStreak] = useState(0);
  const [imageSrc, setImageSrc] = useState(null);


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
    scorpio: '/zodiacAssets/Scorpio.png',
    taurus: '/zodiacAssets/Taurus.png',
    virgo: '/zodiacAssets/Virgo.png',

    //region
    stars: '/regionAssets/stargenes.png',
    ritania: '/regionAssets/ritania.png',
    death: '/regionAssets/landofdeath.png',
    cidonia: '/regionAssets/cidonia.png',
    eureka: '/regionAssets/eureka.png',
    natalon: '/regionAssets/natalon.png',
    erasia: '/regionAssets/erasia.png',
    foreign: '/regionAssets/foreignland.png',
    moonlight: '/regionAssets/moonlight.png',
    specialty: '/regionAssets/specialtychange.png',
    collab: '/regionAssets/collaboration.png',
  };
  const nameMap = {
    //element
    ice: 'Ice',
    wind: 'Earth',
    fire: 'Fire',
    light: 'Light',
    dark: 'Dark',

    //rarity
    3: '3-star',
    4: '4-star',
    5: '5-star',

    //class
    knight: 'Knight',
    mage: 'Mage',
    ranger: 'Ranger',
    soulweaver: 'Soul Weaver',
    assassin: 'Thief',
    warrior: 'Warrior',

    //zodiac
    aquarius: 'Aquarius',
    aries: 'Aries',
    cancer: 'Cancer',
    capricorn: 'Capricorn',
    gemini: 'Gemini',
    leo: 'Leo',
    libra: 'Libra',
    pisces: 'Pisces',
    sagittarius: 'Sagittarius',
    scorpio: 'Scorpio',
    taurus: 'Taurus',
    virgo: 'Virgo',

    //region
    stars: 'Star Genes',
    ritania: 'Ritania',
    death: 'Land of Death',
    cidonia: 'Cidonia',
    eureka: 'Eureka',
    natalon: 'Natalon',
    erasia: 'Erasia',
    foreign: 'Foreign land',
    moonlight: 'Moonlight',
    specialty: 'Specialty Change',
    collab: 'Collab',
  }

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
          photo: data[key].assets.icon,
          hasSkin: data[key].assets.skin.has,
          skin: data[key].assets.skin.image
        }));
        setCharacters(characterList);
        // Set a random solution from the list
        if (characterList.length > 0) {
          const randomIndex = Math.floor(Math.random() * characterList.length);
          setSolution(characterList[randomIndex]); //[1]
          setImageSrc(characterList[randomIndex].picture);
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

    // Fetch a new solution from your character list or backend if neede
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
        photo: data[key].assets.icon,
        hasSkin: data[key].assets.skin.has,
        skin: data[key].assets.skin.image
      }));
      setCharacters(characterList);
      if (characterList.length > 0) {
        const randomIndex = Math.floor(Math.random() * characterList.length);
        setSolution(characterList[randomIndex]);
        setImageSrc(characterList[randomIndex].picture);
      }
    } catch (error) {
      console.error('Failed to fetch new characters:', error);
      setFeedback('Failed to load new game data.');
    }
  };

  

    // Toggle handler to change the image source
    const toggleImage = () => {
        // Check if the current image is the default picture
        if (imageSrc === solution.picture) {
            setImageSrc(solution.skin);  // Change to skin image
        } else {
            setImageSrc(solution.picture);  // Change back to default image
        }
    };

    useEffect(() => {
      console.log("Image source updated:", imageSrc);
      // Any other action that needs to run right after imageSrc updates
    }, [imageSrc]);  // Dependency array includes imageSrc to watch for change


  return (
    <div className="main-game">


      <div className="game-container">
        <div className="character-display">
          {gameState && solution ? (
            <div className='solution-container'>
              <img src={imageSrc} alt="Character" className="character-imagesol" />
              {solution.hasSkin === "true" && (
                <button className="skin-button" onClick={toggleImage}>
                    <img src={'miscAssets/skin.png'} alt="Toggle Skin" className="skin-button-icon" />
                </button>
              )}
            </div>
          ) : (
            <img src={'miscAssets/avatar-npc0000.png'} alt="Character" className="character-image-blank" />
          )}
        </div>

        <div className="game-info">
          <h1 className='gamemodetitle-text'>Endless Mode</h1>
          <h3 className='tries-text' >Tries {guesses.length}/{MAX_GUESSES}</h3>
          <div className="streak-info">
            <p>🔥   Streak: {getWinStreak()}   🔥</p>
            <p>🔥🔥 Highest score: {highestStreak} 🔥🔥</p>
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
              <>
              <div className="summary-table">
                <table>
                <caption>Your Score</caption>
                  <tbody>
                    {guesses.map((item, index) => (
                      <tr key={index}>
                        <td className={'score-cell'}>
                        </td>
                        <td className={item.guess === solution.name ? 'correct-score' : 'incorrect-score'}>
                        </td>
                        <td className={item.element === solution.element ? 'correct-score' : 'incorrect-score'}>
                        </td>
                        <td className={item.class === solution.class ? 'correct-score' : 'incorrect-score'}>
                        </td>
                        <td className={item.starsign === solution.starsign ? 'correct-score' : 'incorrect-score'}>
                        </td>
                        <td className={item.region === solution.region ? 'correct-score' : 'incorrect-score'}>
                        </td>
                        <td className={item.rarity === solution.rarity ? 'correct-score' : 'incorrect-score'}>
                        </td>
                        <td className={item.date === solution.date ? 'correct-score' : 'incorrect-score'}>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={resetGame} className="play-again-button">Play Again</button>
              </>
            )}
          </div>

          {/* <p>{feedback}</p> Display feedback message */}
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
            </tr>
          </thead>
          <tbody>
            {guesses.map((item, index) => (
              <tr key={index}>
                <td className={'photo-cell'}>
                  <img src={item.photo} alt={item.photo} className="character-imageicon"/>
                </td>
                <td className={item.guess === solution.name ? 'correct-answer' : 'incorrect-answer'}>
                  {item.guess}
                </td>
                <td className={item.element === solution.element ? 'correct-answer' : 'incorrect-answer'}>
                  <div className='iconname-container'>
                    <img src={imageMap[item.element]} alt={item.element} />
                    {visibility.element && <p className='iconname'>{nameMap[item.element]}</p>}
                  </div>
                </td>
                <td className={item.class === solution.class ? 'correct-answer' : 'incorrect-answer'}>
                  <div className='iconname-container'>
                    <img src={imageMap[item.class]} alt={item.class} />
                    {visibility.class && <p className='iconname'>{nameMap[item.class]}</p>}
                  </div>
                </td>
                <td className={item.starsign === solution.starsign ? 'correct-answer' : 'incorrect-answer'}>
                  <div className='iconname-container'>
                    <img src={imageMap[item.starsign]} alt={item.starsign} />
                    {visibility.starsign && <p className='iconname'>{nameMap[item.starsign]}</p>}
                  </div>
                </td>
                <td className={item.region === solution.region ? 'correct-answer' : 'incorrect-answer'}>
                  <div className='iconname-container'>
                    <img src={imageMap[item.region]} alt={item.region} className="character-regionicon"/>
                    {visibility.region && <p className='iconname'>{nameMap[item.region]}</p>}
                  </div>
                </td>
                <td className={item.rarity === solution.rarity ? 'correct-answer' : 'incorrect-answer'}>
                  <div className='iconname-container'>
                    <img src={imageMap[item.rarity]} alt={item.rarity} />
                    {visibility.rarity && <p className='iconname'>{nameMap[item.rarity]}</p>}
                  </div>
                </td>
                <td className={item.date === solution.date ? 'correct-answer' : 'incorrect-answer'}>
                  <div className='date-container'>
                    {item.date > solution.date &&
                      <>
                        {item.date}
                        <img src={Math.abs(item.date - solution.date) >= 3 ? 'arrowAssets/arrow2_down.png' : 'arrowAssets/arrow1_down.png'} alt='arrow down' /> 
                      </>
                    }
                    {item.date < solution.date &&
                      <>
                        <img src={Math.abs(item.date - solution.date) >= 3 ? 'arrowAssets/arrow2_up.png' : 'arrowAssets/arrow1_up.png'} alt='arrow up' />
                        {item.date}
                      </>
                    }
                    {item.date === solution.date &&
                      <span>{item.date}</span>
                    }
                  </div>
                </td>
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