
function generatePools() {
    var allCharacters = characters.slice();
    var pools = [];
    var mega = [];
    swapCharacters.forEach(function(item, index) {
        mega.push(item);
        var topName = item.Name.split(" ")[0];
        var bottomName = item.Name.split(" ")[1];
        if (index < swapCharacters.length - 1) {
            swapCharacters.slice(index + 1).forEach(function(paired) {
                var pairedTopName = paired.Name.split(" ")[0];
                var pairedBottomName = paired.Name.split(" ")[1];
                mega.push({
                    Name: topName + " " + pairedBottomName,
                    Element: item.Element,
                    Category: "COMBINED",
                    OriginalTop: item,
                    OriginalBottom: paired
                });
                if (item.Element !== paired.Element) {
                    mega.push({
                        Name: topName + " " + pairedBottomName,
                        Element: paired.Element,
                        Category: "COMBINED",
                        OriginalTop: item,
                        OriginalBottom: paired
                    });
                }
                mega.push({
                    Name: pairedTopName + " " + bottomName,
                    Element: item.Element,
                    Category: "COMBINED",
                    OriginalTop: item,
                    OriginalBottom: paired
                });
                if (item.Element !== paired.Element) {
                    mega.push({
                        Name: pairedTopName + " " + bottomName,
                        Element: paired.Element,
                        Category: "COMBINED",
                        OriginalTop: item,
                        OriginalBottom: paired
                    });
                }
            });
        }
    });
    var picked = mega[11];
    var remaining = mega.filter(function(item) {
        return item !== picked && item.OriginalTop !== picked && item.OriginalBottom !== picked;
    });

    POOLS.forEach(function(aPool) {

    });
}