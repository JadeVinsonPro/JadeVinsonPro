const { promises: fs } = require('fs');
const readme = require('./readme');

const msInOneDay = 1000 * 60 * 60 * 24;

const today = new Date();

function generateNewREADME() {
    const readmeRow = readme.split('\n');

    function updateIdentifier(identifier, replaceText) {
        const identifierIndex = findIdentifierIndex(readmeRow, identifier);
        if (!readmeRow[identifierIndex]) return;
        readmeRow[identifierIndex] = readmeRow[identifierIndex].replace(
            `<#${identifier}>`,
            replaceText
        );
    }

    const identifierToUpdate = {
        day_before_new_years: getDBNWSentence(),
        today_date: getTodayDate(),
        gabot_signing: getGabotSigning(),
    };

    Object.entries(identifierToUpdate).forEach(([key, value]) => {
        updateIdentifier(key, value);
    });

    return readmeRow.join('\n');
}

const moodByDay = {
    1: 'beauté',
    2: 'amour',
    3: 'plaisir',
    4: 'bonheur',
    5: 'joie',
    6: 'bonne foi',
    7: 'amour',
};

function getGabotSigning() {
    const mood = moodByDay[today.getDay()];
    return `🤖 Ce README.md est mis à jour avec ${mood}️`;
}

function getTodayDate() {
    return today.toDateString();
}

function getMySelf() {
    // test if we are in a PAIR DAY
    return today.getDate() % 2 === 0
        ? Math.floor(Math.random() * 2)
            ? 'penguin 🐧'
            : 'bear 🐻'
        : 'penguin bear 🐧🐻';
}

function getDBNWSentence() {
    const nextYear = today.getFullYear() + 1;
    const nextYearDate = new Date(String(nextYear));

    const timeUntilNewYear = nextYearDate.getTime() - today.getTime();
    const dayUntilNewYear = Math.round(timeUntilNewYear / msInOneDay);

    return `**Only ${dayUntilNewYear} days remaining before ${nextYear} ⏱ !!**`;
}

const findIdentifierIndex = (rows, identifier) =>
    rows.findIndex((r) => Boolean(r.match(new RegExp(`<#${identifier}>`, 'i'))));

const updateREADMEFile = (text) => fs.writeFile('./README.md', text);

function main() {
    const newREADME = generateNewREADME();
    console.log(newREADME);
    updateREADMEFile(newREADME);
}
main();