
function generatePools() {
    $('table').find('tr:gt(0)').remove();
    // Make a duplicate of the regular characters
    var allCharacters = characters.slice();

    // Create a full list of pools to generate to pick from at random
    // Does not include the BOSS pool which is done after all other pools chosen.
    poolsLeft = [];
    POOL_COUNTS.forEach(function(aPool) {
        for (var i=0; i<aPool.Count; i++) {
            poolsLeft.push(aPool.Pool);
        }
    });

    // Do a deep combination of all possible half characters to include in the random pick
    swapCharacters.forEach(function(item, index) {
        allCharacters.push(item);
        var topName = item.Name.split(" ")[0];
        var bottomName = item.Name.split(" ")[1];
        if (index < swapCharacters.length - 1) {
            swapCharacters.slice(index + 1).forEach(function(paired) {
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
        var filterByElement = allCharacters.filter(function(character) {
            return character.Element === nextElement;
        });
        var nextCharacterIndex = Math.floor(Math.random() * filterByElement.length);
        if (!allPools[nextElement]) {
            allPools[nextElement] = [];
        }
        var nextCharacter = filterByElement[nextCharacterIndex];
        allPools[nextElement].push(nextCharacter);
        allCharacters = allCharacters.filter(function(item) {
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
                // console.log("COMBINED INCLUDE: " + item.OriginalTop !== nextCharacter.OriginalTop && item.OriginalBottom !== nextCharacter.OriginalBottom);
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

    bossPool = [];
    for (var j=0; j<5; j++) {
        var nextCharacterIndex = Math.floor(Math.random() * allCharacters.length);
        var nextCharacter = allCharacters[nextCharacterIndex];
        bossPool.push(nextCharacter);
        allCharacters = allCharacters.filter(function(item) {
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
                // console.log("COMBINED INCLUDE: " + item.OriginalTop !== nextCharacter.OriginalTop && item.OriginalBottom !== nextCharacter.OriginalBottom);
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
    }
    var htmlContent = '';
    var characterLine = '';
    allPools["BOSS"] = bossPool;
    GAMELIST.forEach(function(element) {
        var capsElement = element.toUpperCase();
        var nextCharacter = allPools[capsElement].pop();
        characterLine = '';
        if (nextCharacter.Page) {
            characterLine = '<tr><td><a href="' + nextCharacter.Page + '" target="_blank">' + nextCharacter.Name + '</a<</td>';
        } else {
            characterLine = '<tr><td>' + nextCharacter.Name + '</td>';
        }
        characterLine += '<td>' + element + '</td>';
        characterLine += '<td>' + (nextCharacter.Category === "COMBINED" ? "YES" : "NO") + "</td>";
        if (nextCharacter.Category === "COMBINED") {
            characterLine += '<td>' + nextCharacter.OriginalTop.Name + "</td>";
            characterLine += '<td>' + nextCharacter.OriginalBottom.Name + "</td>";
        } else {
            characterLine += '<td></td><td></td>';
        }
        characterLine += '</tr>';
        htmlContent += characterLine;
    });
    $('#GAMETable').append(htmlContent);

    // allPoolsKeys = Object.keys(allPools).sort();
    // allPools["BOSS"] = bossPool;
    // allPoolsKeys.push("BOSS");
    // allPoolsKeys.forEach(function(poolName) {
    //     allPools[poolName].forEach(function(aCharacter) {
    //         characterLine = '';
    //         characterLine = '<tr><td>' + aCharacter.Name + '</td>';
    //         characterLine += '<td>' + (aCharacter.Category === "COMBINED" ? "YES" : "NO") + "</td>";
    //         if (aCharacter.Category === "COMBINED") {
    //             characterLine += '<td>' + aCharacter.OriginalTop.Name + "</td>";
    //             characterLine += '<td>' + aCharacter.OriginalBottom.Name + "</td>";
    //         } else {
    //             characterLine += '<td></td><td></td>';
    //         }
    //         characterLine += '</tr>';
    //         htmlContent += characterLine;
    //     });
    //     $('#' + poolName + 'Table').append(htmlContent);
    //     htmlContent = '';
    // });

    $('.allresults').attr('hidden', false);

}