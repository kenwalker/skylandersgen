var relayContent = '';

function generatePools() {
    $('table').find('tr:gt(0)').remove();
    // Make a duplicate of the regular characters
    var allCharacters = characters.slice();

    // Create a full list of pools to generate to pick from at random
    // Does not include the BOSS pool which is done after all other pools chosen.
    poolsLeft = [];
    POOL_COUNTS.forEach(function (aPool) {
        for (var i = 0; i < aPool.Count; i++) {
            poolsLeft.push(aPool.Pool);
        }
    });

    // Do a deep combination of all possible half characters to include in the random pick
    swapCharacters.forEach(function (item, index) {
        allCharacters.push(item);
        var topName = item.Name.split(" ")[0];
        var bottomName = item.Name.split(" ")[1];
        if (index < swapCharacters.length - 1) {
            swapCharacters.slice(index + 1).forEach(function (paired) {
                var pairedTopName = paired.Name.split(" ")[0];
                var pairedBottomName = paired.Name.split(" ")[1];
                allCharacters.push({
                    Name: topName + " " + pairedBottomName,
                    Element: item.Element,
                    Category: "COMBINED",
                    OriginalTop: item,
                    OriginalBottom: paired
                });
                if (item.Element !== paired.Element) {
                    allCharacters.push({
                        Name: topName + " " + pairedBottomName,
                        Element: paired.Element,
                        Category: "COMBINED",
                        OriginalTop: item,
                        OriginalBottom: paired
                    });
                }
                allCharacters.push({
                    Name: pairedTopName + " " + bottomName,
                    Element: item.Element,
                    Category: "COMBINED",
                    SecondGo: true,
                    OriginalTop: paired,
                    OriginalBottom: item
                });
                if (item.Element !== paired.Element) {
                    allCharacters.push({
                        Name: pairedTopName + " " + bottomName,
                        Element: paired.Element,
                        Category: "COMBINED",
                        SecondGo: true,
                        OriginalTop: paired,
                        OriginalBottom: item
                    });
                }
            });
        }
    });
    allPools = {};
    while (poolsLeft.length > 0) {
        var nextIndex = Math.floor(Math.random() * poolsLeft.length);
        var nextElement = poolsLeft[nextIndex];
        var nextCharacterIndex, nextCharacter;
        if (nextElement !== "BOSS") {
            var filterByElement = allCharacters.filter(function (character) {
                return character.Element === nextElement;
            });
            nextCharacterIndex = Math.floor(Math.random() * filterByElement.length);
            nextCharacter = filterByElement[nextCharacterIndex];
        } else {
            nextCharacterIndex = Math.floor(Math.random() * allCharacters.length);
            nextCharacter = allCharacters[nextCharacterIndex];
        }
        if (!allPools[nextElement]) {
            allPools[nextElement] = [];
        }
        allPools[nextElement].push(nextCharacter);
        allCharacters = allCharacters.filter(function (item) {
            if (item === nextCharacter) {
                return false;
            }
            if (nextCharacter.Category === "SWAP" && item.Category === "COMBINED") {
                if (nextCharacter === nextCharacter.OriginalTop) {
                    return false;
                }
                if (nextCharacter === nextCharacter.OriginalBottom) {
                    return false;
                }
                return true;
            }
            if (nextCharacter.Category === "COMBINED" && item.Category === "COMBINED") {
                if (item.OriginalTop === nextCharacter.OriginalTop) {
                    return false;
                }
                if (item.OriginalBottom === nextCharacter.OriginalBottom) {
                    return false;
                }
                return true;
            }
            if (nextCharacter.Category === "COMBINED") {
                return nextCharacter.OriginalTop !== item && nextCharacter.OriginalBottom !== item;
            }
            return true;
        });
        poolsLeft.splice(nextIndex, 1);
    }

    var htmlContent = '';
    var characterHTMLLine = '';
    var characterLine = '';
    relayContent = '';
    GAMELIST.forEach(function (element) {
        var capsElement = element.toUpperCase();
        var nextCharacter = allPools[capsElement].pop();
        characterHTMLLine = '';
        characterLine = '';
        characterHTMLLine = '<tr><td>' + nextCharacter.Name + '</td>';
        characterLine += nextCharacter.Name + '\t';
        characterHTMLLine += '<td>' + element + '</td>';
        characterLine += element + '\t';
        characterHTMLLine += '<td>' + (nextCharacter.Category === "COMBINED" ? "YES" : "NO") + "</td>";
        characterLine += (nextCharacter.Category === "COMBINED" ? "YES" : "NO") + "\t";
        if (nextCharacter.Category === "COMBINED") {
            characterHTMLLine += '<td>' + nextCharacter.OriginalTop.Name + "</td>";
            characterLine += nextCharacter.OriginalTop.Name + "\t";
            characterHTMLLine += '<td>' + nextCharacter.OriginalBottom.Name + "</td>";
            characterLine += nextCharacter.OriginalBottom.Name + "\t";
        } else {
            characterHTMLLine += '<td></td><td></td>';
            characterLine += '\t\t';
        }
        characterHTMLLine += '</tr>';
        characterLine += '\r\n';
        htmlContent += characterHTMLLine;
        relayContent += characterLine;
    });
    $('#GAMETable').append(htmlContent);

    $('.allresults').attr('hidden', false);
}

function copyTextToClipboard(str) {
    var el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

function copyRelayToClipboard() {
    var allCSV = 'Name\tElement\tCombined\tFirst\tSecond\r\n';
    allCSV += relayContent;
    copyTextToClipboard(allCSV);
}
