import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import CountdownTimer from '../CountdownDir/Countdown';
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
  2024.09.12 - two bgs
  2024.09.26 - rta street bg
  2024.10.10 - pretty space bg and different element icons
  2024.10.24 - menu background and stuffs
  2024.11.07 - ml lua menu items
  2024.11.21 - story bg
} 

Last unit added: Empyrean Ilynav
update info pop up + known issues pop up?
better seo
flip table column/rows for mobile users?

add more backgrounds to settings page (also a featured background)
cry cuz e7vault is dead and you dont remember the dudes name to contact them

post-game guess review in info center (add share button?) (clipboard icon) (SSS+ HoT scoring)
redo rarity stars with awakened ones (?)
animations for guess counter (increment, ! last guess !)

redo json for cleaner hover titles

solution images -> solution GIFs
change solution backgrounds
download images taken from web
make pretty
animations {
  character solution reveal
  div expansion?
  improve guess-table's flip-animation? (fade-in red/green bg)
  expanding divs (new table entry, opening dropdown menu)
}

dailymode {
  reset daily cookies when new dailysolution
}

sagittarius
messed up characterAssets{
  bmhaste (top of scythe is cut off)
  chaos sect axe ?
  taranor guard ?
  taranor royal guard ?
  kikirat v2 ?
  angelic momo (take without effect)
  aux lots (is blinking)
  maid chloe
  lqc
}

new moon luna - class (knight to mage)
*/



function MainGame({ visibility, mode }) {
  const [input, setInput] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [dailyGuesses, setDailyGuesses] = useState([]);
  const [endlessGuesses, setEndlessGuesses] = useState([]);
  const [gameState, setGameState] = useState(false);
  const [dailyGameState, setDailyGameState] = useState(false);
  const [endlessGameState, setEndlessGameState] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackSol, setFeedbackSol] = useState('');
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [dailySolution, setDailySolution] = useState(null);
  const [prevDailySolution, setPrevDailySolution] = useState(null);
  const [endlessSolution, setEndlessSolution] = useState(null);
  const [solution, setSolution] = useState(null);
  const [highestDailyStreak, setHighestDailyStreak] = useState(parseInt(localStorage.getItem('highestDailyStreak') || '0', 10));
  const [highestEndlessStreak, setHighestEndlessStreak] = useState(parseInt(localStorage.getItem('highestEndlessStreak') || '0', 10));
  const [dailyWinStreak, setDailyWinStreak] = useState(parseInt(Cookies.get('dailyWinStreak') || '0', 10));
  const [endlessWinStreak, setEndlessWinStreak] = useState(parseInt(Cookies.get('endlessWinStreak') || '0', 10));
  const [imageSrc, setImageSrc] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dailyReload, setDailyReload] = useState(false);
  // eslint-disable-next-line
  const [dailyWon, setDailyWon] = useState(Cookies.get('dailyWon') === 'true');
  const [randEmojisCorrect, setRandEmojisCorrect] = useState([]);
  const [randEmojisWrong, setRandEmojisWrong] = useState([]);
  const [scoreIcon, setScoreIcon] = useState([]);
  const [filters, setFilters] = useState({
    element: [],
    class: [],
    zodiac: [],
    region: [],
    rarity: [],
    date: []
  });

  const inputRef = useRef(null);

  const MAX_GUESSES = 5;
  const remainingGuesses = MAX_GUESSES - incorrectGuesses;

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
  const filterConfig = {
    element: ['ice', 'fire', 'wind', 'dark', 'light'],
    class: ['warrior', 'knight', 'ranger', 'mage', 'assassin', 'soulweaver'],
    zodiac: ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'],
    region: ['stars', 'ritania', 'death', 'cidonia', 'eureka', 'natalon', 'erasia', 'foreign', 'moonlight', 'specialty', 'collab',],
    rarity: [3, 4, 5],
    date: ['2018', '2019', '2020', '2021', '2022', '2023', '2024']
  };
  const scoreIcons = [
    'miscAssets/extracted_image_14291.png', //SSS
    'miscAssets/extracted_image_1782.png',  // SS
    'miscAssets/extracted_image_1639.png',  //  A
    'miscAssets/extracted_image_1638.png',  //  B
    'miscAssets/extracted_image_1637.png',  //  C
    'miscAssets/extracted_image_1783.png'   //  D
  ]

  const setScoreImage = (isCorrect) => {
    let i;
    if (isCorrect)
      i = guesses.length;
    else
      i = guesses.length + 1;

    setScoreIcon(scoreIcons[i])
  }

  // Win Streak Functions
  const getHighestStreak = (mode) => {
    if (mode === 'daily') {
      return parseInt(localStorage.getItem('highestDailyStreak') || '0', 10);
    } else {
      return parseInt(localStorage.getItem('highestEndlessStreak') || '0', 10);
    }
  };

  const updateHighestStreak = (currentStreak, mode) => {
    if (mode === 'daily') {
      const highestDailyStreak = getHighestStreak('daily');
      if (currentStreak > highestDailyStreak) {
        localStorage.setItem('highestDailyStreak', currentStreak.toString());
        setHighestDailyStreak(currentStreak);
      }
    } else {
      const highestEndlessStreak = getHighestStreak('endless');
      if (currentStreak > highestEndlessStreak) {
        localStorage.setItem('highestEndlessStreak', currentStreak.toString());
        setHighestEndlessStreak(currentStreak);
      }
    }
  };

  // const getWinStreak = (mode) => {
  //   if (mode === 'daily') {
  //     return parseInt(Cookies.get('dailyWinStreak') || '0', 10);
  //   } else {
  //     return parseInt(Cookies.get('endlessWinStreak') || '0', 10);
  //   }
  // };

  const incrementWinStreak = (mode) => {
    if (mode === 'daily') {
      const currentStreak = parseInt(Cookies.get('dailyWinStreak') || '0', 10) + 1;
      Cookies.set('dailyWinStreak', currentStreak, { expires: 7 });
      setDailyWinStreak(currentStreak);
      updateHighestStreak(currentStreak, 'daily');
    } else {
      const currentStreak = parseInt(Cookies.get('endlessWinStreak') || '0', 10) + 1;
      Cookies.set('endlessWinStreak', currentStreak, { expires: 7 });
      setEndlessWinStreak(currentStreak);
      updateHighestStreak(currentStreak, 'endless');
    }
  };

  const resetWinStreak = (mode) => {
    if (mode === 'daily') {
      Cookies.set('dailyWinStreak', 0, { expires: 7 });
      setDailyWinStreak(0);
    } else {
      Cookies.set('endlessWinStreak', 0, { expires: 7 });
      setEndlessWinStreak(0);
    }
  };

  // Function to reset the daily streak if the previous solution wasn't solved
  const resetDailyStreakIfPreviousNotSolved = () => {
    const previousSolved = Cookies.get('previousDailySolved');

    // If the previous daily solution wasn't solved, reset the streak
    if (previousSolved !== 'true') {
      Cookies.set('dailyWinStreak', '0', { expires: 7 });
      setDailyWinStreak(0);
      console.log('Daily streak reset because previous daily solution was not solved.');
    }
  };

  // Function to set whether the current daily puzzle is solved
  const setDailySolvedStatus = (solved) => {
    if (mode === 'daily') {
      setDailyWon(solved);
      Cookies.set('dailyWon', solved ? 'true' : 'false', { expires: 7 });
      if (solved) {
        // If the daily puzzle is solved, mark it as solved and increment the streak
        Cookies.set('previousDailySolved', 'true', { expires: 7 });
        const newDailyWinStreak = dailyWinStreak + 1;
        setDailyWinStreak(newDailyWinStreak);
        Cookies.set('dailyWinStreak', newDailyWinStreak.toString(), { expires: 7 });
      } else {
        Cookies.set('previousDailySolved', 'false', { expires: 7 });
      }
    }
  };

  // Store solution in cookies
  useEffect(() => {
    resetGame();
    if (solution && mode !== 'daily') {
      Cookies.set('solution', JSON.stringify(solution), { expires: 7 });
    } // eslint-disable-next-line
  }, [solution]);


  // Fetch character list when the component mounts
  useEffect(() => {
    setLoading(true);
    fetch('https://epic7dle-server-432df96e6d2b.herokuapp.com/api/characters') // Character API endpoint
      .then(response => response.json())
      .then(data => {
        const characterList = Object.keys(data).map(key => ({
          picture: data[key].assets.image,
          id: data[key]._id,
          name: key,
          element: data[key].attribute,
          class: data[key].role,
          zodiac: data[key].zodiac,
          rarity: data[key].rarity,
          region: data[key].region,
          date: data[key].date,
          photo: data[key].assets.icon,
          hasSkin: data[key].assets.skin.has,
          skin: data[key].assets.skin.image,
        }));

        // Store the character list for use in either mode
        setCharacters(characterList);

        // Generate an initial solution for endless mode
        if (characterList.length > 0) {
          generateNewEndlessSolution(characterList);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to fetch characters:', err)
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [mode]);

  // Fetch daily solution separately
  useEffect(() => {
    if (mode === 'daily') {
      fetch('https://epic7dle-server-432df96e6d2b.herokuapp.com/api/daily_solution')
        .then(response => response.json())
        .then(data => {
          const character = {
            picture: data.assets.image,
            id: data._id,
            name: data.name,
            element: data.attribute,
            class: data.role,
            zodiac: data.zodiac,
            rarity: data.rarity,
            region: data.region,
            date: data.date,
            photo: data.assets.icon,
            hasSkin: data.assets.skin.has,
            skin: data.assets.skin.image,
          };

          setDailySolution(character);

          // If the current mode is 'daily', set solution and imageSrc right away
          setSolution(character);
          setImageSrc(character.picture);
        })
        .catch(err => console.error('Failed to fetch daily solution:', err));
    }
  }, [mode, dailyReload]); // Run only when mode changes, mainly when it is 'daily'

  // Fetch previous daily solution separately
  useEffect(() => {
    if (mode === 'daily') {
      fetch('https://epic7dle-server-432df96e6d2b.herokuapp.com/api/previous_daily_solution')
        .then(response => response.json())
        .then(data => {
          const character = {
            picture: data.assets.image,
            id: data._id,
            name: data.name,
            element: data.attribute,
            class: data.role,
            zodiac: data.zodiac,
            rarity: data.rarity,
            region: data.region,
            date: data.date,
            photo: data.assets.icon,
            hasSkin: data.assets.skin.has,
            skin: data.assets.skin.image,
          };
          setPrevDailySolution(character);
          resetDailyStreakIfPreviousNotSolved();
        })
        .catch(err => console.error('Failed to fetch previous daily solution:', err));
    }
  }, [mode, dailyReload]);

  // Load initial data based on mode
  useEffect(() => {
    if (mode === 'daily') {
      const savedGuesses = Cookies.get('dailyGuesses');
      const savedGameState = Cookies.get('dailyGameState');
      if (savedGuesses) {
        setDailyGuesses(JSON.parse(savedGuesses));
        setGuesses(JSON.parse(savedGuesses));
      }
      if (savedGameState && savedGameState === 'true') {
        setDailyGameState(true);
        setGameState(true);
      }
    } else if (mode === 'endless') {
      const savedGuesses = Cookies.get('endlessGuesses');
      const savedGameState = Cookies.get('endlessGameState');
      if (savedGuesses) {
        setEndlessGuesses(JSON.parse(savedGuesses));
        setGuesses(JSON.parse(savedGuesses));
      }
      if (savedGameState && savedGameState === 'true') {
        setEndlessGameState(true);
        setGameState(true);
      }
    }
    // reset filters
    setFilters({
      element: [],
      class: [],
      zodiac: [],
      region: [],
      rarity: [],
      date: []
    });
  }, [mode]);

  // Sync guesses with the appropriate mode when it changes
  useEffect(() => {
    if (mode === 'daily') {
      setGuesses(dailyGuesses);
      setGameState(dailyGameState);
    } else if (mode === 'endless') {
      setGuesses(endlessGuesses);
      setGameState(endlessGameState);
    }
  }, [mode, dailyGuesses, endlessGuesses, dailyGameState, endlessGameState]);

  // Save guesses to cookies only if they are not empty
  useEffect(() => {
    if (guesses.length > 0) {
      if (mode === 'daily') {
        Cookies.set('dailyGuesses', JSON.stringify(guesses), { expires: 7 });
      } else if (mode === 'endless') {
        Cookies.set('endlessGuesses', JSON.stringify(guesses), { expires: 7 });
      }
    } // eslint-disable-next-line
  }, [guesses]);

  // Save game state to cookies only if it is `true`
  useEffect(() => {
    if (gameState) {
      if (mode === 'daily') {
        Cookies.set('dailyGameState', 'true', { expires: 7 });
      } else if (mode === 'endless') {
        Cookies.set('endlessGameState', 'true', { expires: 7 });
      }
    } // eslint-disable-next-line
  }, [gameState]);

  // Sync solution and imageSrc based on the mode
  useEffect(() => {
    if (mode === 'daily' && dailySolution) {
      setSolution(dailySolution);
      setImageSrc(dailySolution.picture);
    } else if (endlessSolution) {
      setSolution(endlessSolution);
      setImageSrc(endlessSolution.picture);
    }
  }, [mode, dailySolution, endlessSolution]);

  // Function to generate a new endless solution
  const generateNewEndlessSolution = (characterList) => {
    if (mode === 'endless') {
      const savedSolution = Cookies.get('solution');
      if (savedSolution) {
        setSolution(JSON.parse(savedSolution));
        setImageSrc(JSON.parse(savedSolution).picture);
      } else {
        if (!characterList || characterList.length === 0) {
          console.error('Character list is empty. Cannot generate a new solution.');
          return;
        }
        const randomIndex = Math.floor(Math.random() * characterList.length);
        const newEndlessSolution = characterList[randomIndex];
        setEndlessSolution(newEndlessSolution);
        setSolution(newEndlessSolution);
        setImageSrc(newEndlessSolution.picture);
      }
    }
  }

  const setGamesState = (state) => {
    if (mode === 'daily') {
      Cookies.set('dailyGameState', JSON.stringify(state), { expires: 7 });
      setDailyGameState(state)
      setGameState(state)
    } else if (mode === 'endless') {
      Cookies.set('endlessGameState', JSON.stringify(state), { expires: 7 });
      setEndlessGameState(state)
      setGameState(state)
    }
  }

  const setGamesGuesses = (guesses) => {
    if (mode === 'daily') {
      setDailyGuesses(guesses);
      setGuesses(guesses);
    } else if (mode === 'endless') {
      setEndlessGuesses(guesses);
      setGuesses(guesses);
    }
  }

  const setDailyResetDateCookie = () => {
    if (mode === 'daily') {
      const currentDate = new Date().toISOString().split('T')[0]; // Format "YYYY-MM-DD"
      Cookies.set('lastDailyReset', currentDate, { expires: 7 });
    }
  };

  const resetDailyCookies = () => {
    Cookies.remove('dailyGuesses');
    Cookies.remove('dailyGameState');
    setDailyGameState(false);
    setDailyGuesses([]);
  };

  const checkDailyResetCookie = () => {
    const lastResetDateString = Cookies.get('lastDailyReset');

    if (!lastResetDateString) {
      // If no previous reset date exists, we treat it as if a reset is required
      resetDailyCookies();
      setDailyReload(true);
      return;
    }

    const lastResetDate = new Date(lastResetDateString);
    const currentDate = new Date();

    // Calculate the difference in time and convert it to days
    const differenceInTime = currentDate - lastResetDate; // Difference in milliseconds
    const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24); // Convert to days

    if (differenceInDays >= 1) {
      // More than one day has passed, so reset cookies
      resetDailyCookies();
      if (differenceInDays > 1)
        setDailyWinStreak(0);
      setDailyReload(true);
    } else {
      setDailyReload(false);
    }
  };

  useEffect(() => {
    setRandEmojisCorrect(getRandomImages(emojisCorrect));
    setRandEmojisWrong(getRandomImages(emojisWrong));
    checkDailyResetCookie(); // Run this check whenever the component mounts
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const checkInterval = setInterval(() => {
      checkDailyResetCookie();
    }, 6000000); // Check every minute

    return () => clearInterval(checkInterval); // Clean up interval on component unmount
    // eslint-disable-next-line
  }, []);

  // Reset game function
  const resetGame = () => {
    setInput('');
    setGamesGuesses([]);
    setIncorrectGuesses(0);
    setGamesState(false);
    setFeedback('');
    setAnimationReady(false);
    setIsImageLoaded(false);
    setRandEmojisCorrect(getRandomImages(emojisCorrect));
    setRandEmojisWrong(getRandomImages(emojisWrong));
    setFilters({
      element: [],
      class: [],
      zodiac: [],
      region: [],
      rarity: [],
      date: []
    });

    Cookies.set('endlessGuesses', [], { expires: 7 });
    Cookies.set('endlessGameState', false, { expires: 7 });
    Cookies.remove('solution');
  };

  // Reset game and generate a new solution for endless mode
  const resetGameAndGenerateNewSolution = () => {
    resetGame();
    generateNewEndlessSolution(characters);
  };

  const toggleFilter = (category, value = null) => {
    if (value) {
      // Toggle individual filter
      const newFilters = { ...filters };
      const currentValues = newFilters[category] || [];

      if (currentValues.includes(value)) {
        newFilters[category] = currentValues.filter(item => item !== value);
      } else {
        newFilters[category] = [...currentValues, value];
      }

      setFilters(newFilters);
    } else {
      // Toggle all filters in the category
      const newFilters = { ...filters };
      const currentValues = newFilters[category] || [];

      if (currentValues.length === filterConfig[category].length) {
        // All filters are currently active; deactivate them all
        newFilters[category] = [];
      } else {
        // Activate all filters in the category
        newFilters[category] = filterConfig[category].map(item => item);
      }

      setFilters(newFilters);
    }
  };


  //sort input dropdown
  useEffect(() => {
    let updatedCharacters = characters;

    // Filter by name if there is input
    if (input.trim() !== '') {
      updatedCharacters = updatedCharacters.filter(char =>
        char.name.toLowerCase().includes(input.toLowerCase())
      );
    }

    Object.keys(filters).forEach(category => {
      if (filters[category].length > 0) {
        updatedCharacters = updatedCharacters.filter(char =>
          char[category] && filters[category].includes(char[category])
        );
      }
    });

    // Sort so that names starting with the input are at the top
    updatedCharacters.sort((a, b) => {
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

    setFilteredCharacters(updatedCharacters);
  }, [input, characters, filters]);  // Update dependency to activeFilters

  const handleBlur = () => {
    // Delay the onBlur to allow for interaction with the list
    setTimeout(() => {
      if (!document.activeElement.closest('.autocomplete-dropdown')) {
        setIsFocused(false);
      }
    }, 100);  // Delay might need adjusting
  };

  const handleSelect = (name) => {
    setIsFocused(true);
    setInput(name)
    if (inputRef.current && !document.activeElement.isEqualNode(inputRef.current)) {
      inputRef.current.focus();
    }
  };

  const handleDropdownMouseDown = (event) => {
    event.preventDefault();  // Prevents the input from losing focus
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };


  const handleGuessSubmit = async () => {
    if (input.trim() !== '') {
      // First, disable the button or show a loading indicator (not shown here)

      try {
        const response = await fetch(`https://epic7dle-server-432df96e6d2b.herokuapp.com/api/characters/${input.trim()}`);
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
            zodiac: details.zodiac,
            region: details.region,
            rarity: details.rarity,
            date: details.date,
            correct: isCorrect
          };

          // Set all states at once after the fetch is completed and data is processed
          setGamesGuesses(prevGuesses => [newGuess, ...prevGuesses]); // Ensures immutability
          setInput(''); // Clear input

          setGamesState(isCorrect ? true : false); // game win

          // Animate the newly created row
          setIsAnimating(true);
          setTimeout(() => {
            setIsAnimating(false);
          }, 2005); // matches animation duration

          if (isCorrect) {
            incrementWinStreak(mode); // Increment streak based on mode
            setGamesState(true); // End game successfully
            setDailySolvedStatus(true);
            setDailyResetDateCookie();
            setScoreImage(isCorrect);
          } else if (guesses.length + 1 >= MAX_GUESSES) {
            resetWinStreak(mode); // Reset streak based on mode
            setGamesState(true); // End game as a loss
            setDailyResetDateCookie();
            setDailySolvedStatus(false);
            setScoreImage(isCorrect);
            setIncorrectGuesses(prev => prev + 1);
          } else {
            setIncorrectGuesses(prev => prev + 1);
          }
          setFeedback(isCorrect ? 'Correct! Well done.' : 'Incorrect, try again!');
          setFeedbackSol('Answer is')

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

  // Toggle handler to change the image source
  const toggleImage = () => {
    // Check if the current image is the default picture
    if (imageSrc === solution.picture) {
      setImageSrc(solution.skin);  // Change to skin image
    } else {
      setImageSrc(solution.picture);  // Change back to default image
    }
  };

  // if on a mobile device, change html structure
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // on mobile device, scroll up when opening guess input dropdown
  useEffect(() => {
    // Function to handle scrolling the input into view
    const handleFocus = () => {
      if (isMobile === true) {
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300); // Delay to account for the mobile keyboard opening
      }
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener('focus', handleFocus);
    }

    return () => {
      // Cleanup the event listener when the component unmounts
      if (inputElement) {
        inputElement.removeEventListener('focus', handleFocus);
      }
    }; // eslint-disable-next-line
  }, []);

  const [height, setHeight] = useState(3);
  const containerRef = useRef(null);
  const defaultImageRef = useRef(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [animationReady, setAnimationReady] = useState(false);

  useEffect(() => {
    const recalculateHeight = () => {
      if (!loading && gameState && imageSrc) {
        const img = new Image();
        img.src = imageSrc;

        img.onload = () => {
          if (containerRef.current) {
            const newHeight = containerRef.current.scrollHeight;
            if (newHeight > 0) {
              setHeight(newHeight);
              setIsImageLoaded(true);
            }
          }
        };
      } else if (!gameState && defaultImageRef.current) {
        const defaultImg = new Image();
        defaultImg.src = defaultImageRef.current.src;
        defaultImg.onload = () => {
          if (defaultImageRef.current) {
            const newHeight = defaultImageRef.current.clientHeight;
            setHeight(newHeight);
            setIsImageLoaded(true);
          }
        };
      }
    };

    recalculateHeight();

    window.addEventListener('resize', recalculateHeight);

    return () => {
      window.removeEventListener('resize', recalculateHeight);
    };
  }, [gameState, imageSrc, loading]);

  // Start the animation when both height is set and image is loaded
  useEffect(() => {
    if (isImageLoaded) {
      setAnimationReady(true);
    }
  }, [isImageLoaded]);

  // Array of image paths
  const emojisCorrect = [
    '/emoticonAssets/extracted_image_3.png',
    '/emoticonAssets/extracted_image_7.png',
    '/emoticonAssets/extracted_image_25.png',
    '/emoticonAssets/extracted_image_30.png',
    '/emoticonAssets/extracted_image_38.png',
    '/emoticonAssets/extracted_image_33.png',
    '/emoticonAssets/extracted_image_78.png',
    '/emoticonAssets/extracted_image_79.png',
    '/emoticonAssets/extracted_image_81.png',
    '/emoticonAssets/extracted_image_85.png',
    '/emoticonAssets/extracted_image_87.png',
    '/emoticonAssets/extracted_image_88.png',
    '/emoticonAssets/extracted_image_89.png',
    '/emoticonAssets/extracted_image_91.png',
    '/emoticonAssets/extracted_image_121.png',
    '/emoticonAssets/extracted_image_92.png',
    '/emoticonAssets/extracted_image_122.png',
    '/emoticonAssets/extracted_image_157.png',

  ];

  const emojisWrong = [
    '/emoticonAssets/extracted_image_1.png',
    '/emoticonAssets/extracted_image_6.png',
    '/emoticonAssets/extracted_image_8.png',
    '/emoticonAssets/extracted_image_16.png',
    '/emoticonAssets/extracted_image_18.png',
    '/emoticonAssets/extracted_image_20.png',
    '/emoticonAssets/extracted_image_29.png',
    '/emoticonAssets/extracted_image_74.png',
    '/emoticonAssets/extracted_image_33.png',
    '/emoticonAssets/extracted_image_75.png',
    '/emoticonAssets/extracted_image_77.png',
    '/emoticonAssets/extracted_image_80.png',
    '/emoticonAssets/extracted_image_82.png',
    '/emoticonAssets/extracted_image_83.png',
    '/emoticonAssets/extracted_image_84.png',
    '/emoticonAssets/extracted_image_86.png',
    '/emoticonAssets/extracted_image_91.png',
    '/emoticonAssets/extracted_image_121.png',
    '/emoticonAssets/extracted_image_99.png',
    '/emoticonAssets/extracted_image_100.png',
    '/emoticonAssets/extracted_image_101.png',

  ];

  // Function to get two random images
  function getRandomImages(emojiList) {
    let indices = new Set();  // Use a Set to avoid duplicates
    while (indices.size < 2) {
      let randomIndex = Math.floor(Math.random() * emojiList.length);
      indices.add(randomIndex);
    }

    // Convert the Set to an array and map to image paths
    return Array.from(indices).map(index => emojiList[index]);
  }

  const characterDisplay = (
    <div className={`character-display ${(gameState && animationReady) ? 'solution-reveal' : ''}`} style={{ transition: 'height 0.2s ease', height: `${height}px` }}>
      {gameState && solution ? (
        <div ref={containerRef} className='solution-container'>
          <div className='frontside'>
            <img src={imageSrc} alt="Character" className="character-imagesol" onLoad={() => setIsImageLoaded(true)} />
            {solution.hasSkin === "true" && (
              <button className="skin-button" onClick={toggleImage}>
                <img src={'miscAssets/skin.png'} alt="Toggle Skin" className="skin-button-icon" />
              </button>
            )}
          </div>
          <div className='backside'>
            <img src={'miscAssets/avatar-npc0000.png'} alt="Character" className="character-image-blank" ref={defaultImageRef} />
          </div>
        </div>
      ) : (
        <img src={'miscAssets/avatar-npc0000.png'} alt="Character" className="character-image-blank" ref={defaultImageRef} />
      )}
    </div>
  );

  const guessInput = (
    <>
      <div className="guess-input">
        {!gameState ? (
          <>
            <div className="input-button-wrapper">
              <input
                type="text"
                placeholder="Enter character name..."
                value={input}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                ref={inputRef}
              />
              <button className='guessbtn' onClick={handleGuessSubmit}>Guess</button>
            </div>
            {isFocused && (
              <div className="dropdown-container" onMouseDown={handleDropdownMouseDown}>
                <ul className="autocomplete-dropdown" style={mode === 'daily' ? { width: '100%' } : { width: '90%' }}>
                  {filteredCharacters.map(character => (
                    <li key={character.id} onClick={() => handleSelect(character.name)}>
                      <img src={character.photo} alt={character.name} />
                      {character.name}
                    </li>
                  ))}
                </ul>
                {mode !== 'daily' &&
                  <div className="filter-container">
                    {Object.keys(filterConfig).map(category => (
                      <div key={category} className="filter-category">
                        <div className="filter-category-title" onClick={() => toggleFilter(category)}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </div>
                        <div className="filter-icons">
                          {filterConfig[category].map(value => (
                            <button
                              key={value}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the category title's onClick
                                toggleFilter(category, value);
                              }}
                              className={`filter-icon ${filters[category].includes(value) ? 'active' : ''}`}
                            >
                              {imageMap[value] ? (
                                <img src={imageMap[value]} alt={value} />
                              ) : (
                                <span className='datefilterbtns'>{value}</span> // Display the value as text if no icon exists
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                }
              </div>
            )}
          </>
        ) : (
          <div className={solution && guesses[0].guess === solution.name ? 'end-screen-correct' : 'end-screen-incorrect'}>
            <div className='end-message-container'>
              <img src={solution && guesses[0].guess === solution.name ? randEmojisCorrect[0] : randEmojisWrong[0]} alt='emoticon' className="emoji1" />
              <div className='end-message-text-container'>
                <h1 className='end-message-text'>{feedback}</h1>
                <h1 className='end-message-text2'>{feedbackSol}</h1>
                <h1 className='end-message-name'>{solution && solution.name}</h1>
              </div>
              <img src={solution && guesses[0].guess === solution.name ? randEmojisCorrect[1] : randEmojisWrong[1]} alt='emoticon' className="emoji2" />
            </div>
            <div className="summary-table">
              <table>
                <caption className='tablecaption'>
                  Score:
                  <img src={scoreIcon} alt='score' className="scoreIcon" />
                </caption>
                <tbody>
                  {guesses.map((item, index) => (
                    <tr key={index}>
                      <td className={'score-cell'}>
                      </td>
                      <td className={solution && item.guess === solution.name ? 'correct-score' : 'incorrect-score'}>
                      </td>
                      <td className={solution && item.element === solution.element ? 'correct-score' : 'incorrect-score'}>
                      </td>
                      <td className={solution && item.class === solution.class ? 'correct-score' : 'incorrect-score'}>
                      </td>
                      <td className={solution && item.zodiac === solution.zodiac ? 'correct-score' : 'incorrect-score'}>
                      </td>
                      <td className={solution && item.region === solution.region ? 'correct-score' : 'incorrect-score'}>
                      </td>
                      <td className={solution && item.rarity === solution.rarity ? 'correct-score' : 'incorrect-score'}>
                      </td>
                      <td className={solution && item.date === solution.date ? 'correct-score' : 'incorrect-score'}>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {mode === 'daily'
              ? <CountdownTimer />
              : <button onClick={resetGameAndGenerateNewSolution} className="play-again-button">Play Again</button>}
          </div>
        )}
      </div>
      {prevDailySolution && mode === 'daily' &&
        <div className='prevdailysolutiontext'>
          <p>Yesterday's Solution: {prevDailySolution.name}</p>
          <img src={prevDailySolution.photo} alt='prevdailysol-icon' />
        </div>}
    </>
  );

  const cellbackside = (
    <div className="back">
      <img src={'miscAssets/extracted_image_415.png'} alt="cellbackside" />
    </div>
  );

  return (
    <div className="main-game">
      {loading ? (
        <div className="loading-screen">
          <img src={'miscAssets/extracted_image_4250.png'} alt="runningras1" className="loading-image image-1" />
          <img src={'miscAssets/extracted_image_4251.png'} alt="runningras2" className="loading-image image-2" />
        </div>
      ) : (
        <>
          <div className="game-container">
            {isMobile ? ( // mobile version
              <div className="game-info">
                <div className='mobile-info-container'>
                  {characterDisplay}
                  <div className='mobile-info'>
                    <h1 className='gamemodetitle-text'>
                      {mode === 'daily' ? 'Daily Puzzle' : 'Endless Mode'}
                    </h1>
                    <h3 className='tries-text' >Tries {guesses.length}/{MAX_GUESSES}</h3>
                    <div className='health-bar-mobile'>
                      {[...Array(MAX_GUESSES)].map((_, index) => (
                        <img
                          key={index}
                          src={index < remainingGuesses ? 'miscAssets/extracted_image_9905.png' : 'miscAssets/extracted_image_9906.png'}
                          alt="heart"
                          className={`heart${index + 1}`}
                        />
                      ))}
                    </div>
                    <div className="streak-info">
                      {mode === 'daily' ? (
                        <>
                          <p>🔥 Daily Streak: {dailyWinStreak} 🔥</p>
                          <p>🔥 Highest Streak: {highestDailyStreak} 🔥</p>
                        </>
                      ) : (
                        <>
                          <p>🔥 Streak: {endlessWinStreak} 🔥</p>
                          <p>🔥 Highest Score: {highestEndlessStreak} 🔥</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {guessInput}
              </div>
            ) : ( // pc version
              <>
                {characterDisplay}
                <div className="game-info">
                  <h1 className='gamemodetitle-text'>
                    {mode === 'daily' ? 'Daily Puzzle' : 'Endless Mode'}
                  </h1>
                  <h3 className='tries-text' >Tries {guesses.length}/{MAX_GUESSES}</h3>
                  <div className='health-bar'>
                    {[...Array(MAX_GUESSES)].map((_, index) => (
                      <img
                        key={index}
                        src={index < remainingGuesses ? 'miscAssets/extracted_image_17989.png' : 'miscAssets/extracted_image_17991.png'}
                        alt="heart"
                        className={`heart${index + 1}`}
                      />
                    ))}
                  </div>
                  <div className="streak-info">
                    {mode === 'daily' ? (
                      <>
                        <p>🔥 Daily Streak: {dailyWinStreak} 🔥</p>
                        <p>🔥 Highest Daily Streak: {highestDailyStreak} 🔥</p>
                      </>
                    ) : (
                      <>
                        <p>🔥 Streak: {endlessWinStreak} 🔥</p>
                        <p>🔥 Highest Score: {highestEndlessStreak} 🔥</p>
                      </>
                    )}
                  </div>

                  {guessInput}
                </div>
              </>
            )}
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
                  <tr key={index} className={index === 0 && isAnimating ? 'last-row-animated' : ''}>
                    <td className={'photo-cell'}>
                      <div className='celldiv'>
                        <img src={item.photo} alt={item.photo} className="character-imageicon front" />
                        {cellbackside}
                      </div>
                    </td>
                    <td className={solution && item.guess === solution.name ? 'correct-answer' : 'incorrect-answer'}>
                      <div className='celldiv'>
                        <span className='front'>{item.guess}</span>
                        {cellbackside}
                      </div>
                    </td>
                    <td className={solution && item.element === solution.element ? 'correct-answer' : 'incorrect-answer'}>
                      <div className='celldiv'>
                        <div className='iconname-container front'>
                          <img src={imageMap[item.element]} alt={item.element} title={item.element} />
                          {visibility.element && <p className='iconname'>{nameMap[item.element]}</p>}
                        </div>
                        {cellbackside}
                      </div>
                    </td>
                    <td className={solution && item.class === solution.class ? 'correct-answer' : 'incorrect-answer'}>
                      <div className='celldiv'>
                        <div className='iconname-container front'>
                          <img src={imageMap[item.class]} alt={item.class} title={item.class} />
                          {visibility.class && <p className='iconname'>{nameMap[item.class]}</p>}
                        </div>
                        {cellbackside}
                      </div>
                    </td>
                    <td className={solution && item.zodiac === solution.zodiac ? 'correct-answer' : 'incorrect-answer'}>
                      <div className='celldiv'>
                        <div className='iconname-container front'>
                          <img src={imageMap[item.zodiac]} alt={item.zodiac} title={item.zodiac} />
                          {visibility.zodiac && <p className='iconname'>{nameMap[item.zodiac]}</p>}
                        </div>
                        {cellbackside}
                      </div>
                    </td>
                    <td className={solution && item.region === solution.region ? 'correct-answer' : 'incorrect-answer'}>
                      <div className='celldiv'>
                        <div className='iconname-container front'>
                          <img src={imageMap[item.region]} alt={item.region} title={item.region} className="character-regionicon" />
                          {visibility.region && <p className='iconname'>{nameMap[item.region]}</p>}
                        </div>
                        {cellbackside}
                      </div>
                    </td>
                    <td className={solution && item.rarity === solution.rarity ? 'correct-answer' : 'incorrect-answer'}>
                      <div className='celldiv'>
                        <div className='iconname-container front'>
                          <img src={imageMap[item.rarity]} alt={item.rarity} title={item.rarity} />
                          {visibility.rarity && <p className='iconname'>{nameMap[item.rarity]}</p>}
                        </div>
                        {cellbackside}
                      </div>
                    </td>
                    <td className={solution && item.date === solution.date ? 'correct-answer' : 'incorrect-answer'}>
                      <div className='celldiv'>
                        <div className='date-container front'>
                          {solution && item.date > solution.date &&
                            <>
                              {item.date}
                              <img src={Math.abs(item.date - solution.date) >= 3 ? 'arrowAssets/arrow2_down.png' : 'arrowAssets/arrow1_down.png'} alt='arrow down' />
                            </>
                          }
                          {solution && item.date < solution.date &&
                            <>
                              <img src={Math.abs(item.date - solution.date) >= 3 ? 'arrowAssets/arrow2_up.png' : 'arrowAssets/arrow1_up.png'} alt='arrow up' />
                              {item.date}
                            </>
                          }
                          {solution && item.date === solution.date &&
                            <span>{item.date}</span>
                          }
                        </div>
                        {cellbackside}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="debug-container">
            {solution && <div className="debug-info">Debug: Solution is {solution.name}</div>}
          </div>
        </>
      )}
    </div>
  );

}

export default MainGame;