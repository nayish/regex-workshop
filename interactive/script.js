const workshopPromise = fetch('./workshop.json');

let phrasesContainer;
let inputElement;
let titleElement;
let descriptionElement;
let challengeElement;
let challengeContainerElement;
let nextElement;
let previousElement;
let chapterNumberElement;
let nodes = [];
let hasError;
let hasCompleted;
let phrases;
let chapters;
let currentValue;
let currentChapter;
let lessonTitle;
let gotoButton;
let body;
window.onload= async () => {
    const urlParams = new URLSearchParams(window.location.search);
    currentChapter = +urlParams.get('chapter') ?? 0;

    phrasesContainer = document.querySelector('.phrases');
    inputElement = document.querySelector('.solution');
    titleElement = document.querySelector('.title');
    descriptionElement = document.querySelector('.description');
    challengeElement = document.querySelector('.challenge');
    challengeContainerElement = document.querySelector('.challenge-container');
    nextElement = document.querySelector('.next');
    previousElement = document.querySelector('.previous');
    chapterNumberElement = document.querySelectorAll('.chapter-number');
    lessonTitle = document.querySelector('.lesson h1');
    gotoButton = document.querySelector('.goto-challenge');
    body = document.querySelector('body');

    const workshop = await (await workshopPromise).json();
    chapters = workshop.chapters;

    setChapter()

    inputElement.oninput = (e) => setCurrentValue(e.target.value)

    nextElement.onclick = () => {
        if (currentChapter === chapters.length - 1) {
            return;
        }
        currentChapter++;
        setChapter();
    };
    previousElement.onclick = () => {
        if (!currentChapter) {
            return;
        }
        currentChapter--;
        setChapter();
    };

    window.addEventListener('popstate', function() {
        const urlParams = new URLSearchParams(window.location.search);
        currentChapter = +urlParams.get('chapter') ?? 0;
        setChapter({withoutPush: true});
    });

    lessonTitle.onclick = () => {
        if (chapters[currentChapter].description) {
            body.classList.remove('challenge-mode');
        }
    }

    gotoButton.onclick = () => {
        if (chapters[currentChapter].description) {
            body.classList.add('challenge-mode');
        }
    }
}

const setState = () => {
    if (hasError) {
        challengeContainerElement.classList.add('error');
    } else {
        challengeContainerElement.classList.remove('error');
    }

    if (hasCompleted) {
        challengeContainerElement.classList.add('completed');
    } else {
        challengeContainerElement.classList.remove('completed');
    }
    save(currentChapter, currentValue);
}

function save() {
    const challengeSolutions = {
        ...JSON.parse(localStorage.getItem('challengeSolutions') || '[]'),
        [currentChapter]: hasCompleted ? currentValue: undefined
    };

    const arr = [];
    Object.keys(challengeSolutions).forEach(key => {
        arr[key] = challengeSolutions[key];
    });
    localStorage.setItem('challengeSolutions', JSON.stringify(arr));
}

function mapToPhraseNode({phrase, index, column, isValid}) {
    const node = document.createElement("div");
    if (phrase.length > 16) {
        phrase = `"${phrase.substring(0,9)}…"(${phrase.length})`
    } else {
        phrase = JSON.stringify(phrase);
    }
    node.innerText = phrase;
    node.className = `phrase ${isValid? 'valid' : 'invalid'} phrase-${index}`;
    return node;
}

function setChapter({withoutPush} = {}) {
    if (!withoutPush) {
        const url = new URL(window.location);
        url.searchParams.set('chapter', currentChapter);
        window.history.pushState(null, '', url.toString());
    }
    const challengeSolutions = JSON.parse(localStorage.getItem('challengeSolutions') || '{}');
    if (currentChapter && !isArrayFull(challengeSolutions.slice(0, currentChapter))) {
        currentChapter--;
        setChapter();
        return;
    }

    const {title, description, challenge, valid, invalid} = chapters[currentChapter];

    chapterNumberElement.forEach(a => a.innerText = `${currentChapter + 1}`);

    if (chapters[currentChapter].description) {
        body.classList.remove('challenge-mode')
    } else {
        body.classList.add('challenge-mode')
    }

    titleElement.innerText = title;
    descriptionElement.innerHTML = '';
    description && (descriptionElement.append(...description.split('\n').map((line) => {
        const node = document.createElement("p");
        node.innerHTML = line;
        return node;
    })));
    challengeElement.innerHTML = challenge;
    phrases = [...valid.map(phrase => ({phrase, isValid:true})), ...invalid.map(phrase => ({phrase, isValid:false}))]
    nodes = phrases.map((p, index) => mapToPhraseNode( {...p, index, column: 1}))
    phrasesContainer.innerHTML = '';
    phrasesContainer.append(...nodes);
    hasError = false;
    hasCompleted = false;
    setCurrentValue(challengeSolutions[currentChapter] || '//');
    inputElement.value = currentValue || '';
    setState();


}

function setCurrentValue(value) {
    currentValue = value;
    let regex, flags, r;
    try {
        [_, regex, flags] = currentValue.match(/\/(.*)\/(\w*)/);

        r = new RegExp(regex,flags);
        hasError = false;
    } catch {
        hasError = true;
    }

    if (!regex || hasError) {
        hasCompleted = false;
        nodes.forEach((node, index) => {
            nodes[index].classList.remove('fail')
            nodes[index].classList.remove('pass');
        });
        setState();
        return;
    }
    const values = phrases.map(({phrase, isValid}, index) => {
        const pass = r.test(phrase);
        if (pass) {
            nodes[index].classList.add('pass');
            nodes[index].classList.remove('fail')
        } else {
            nodes[index].classList.remove('pass');
            nodes[index].classList.add('fail')
        }
        return pass === isValid;
    });

    hasCompleted = values.every(a => a);

    setState();
}

function isArrayFull( arr ) {
    for ( let i = 0, l = arr.length; i < l; i++ )
    {
        if ( 'undefined' == typeof arr[i] || null === arr[i] )
        {
            return false
        }
    }
    return true;
}
